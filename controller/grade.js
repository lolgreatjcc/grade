// imports
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const uuid = require('fix-esm').require("uuid");
exports.uuid = uuid;
const uuidv7 = uuid.v7;
const answerKey = require('../model/answerKey');
const attempt = require('../model/attempt')

const {openaiClient} = require('./openAI/openaiClient');

// cache for testing
const app = express();
app.locals.CACHE = null;

// utils
const mcqMarker = require('../utils/mcqMarker/mcqMarker');
const verifyBodyUserId = require('../utils/verify');
const splitQuestions = require('./gradeUtils/splitQuestions');
const genAnsSheet = require('../utils/genAnsSheet');


// Azure imports
const { ShareServiceClient } = require('@azure/storage-file-share');
const connectionString = process.env.AZURESTORAGECONNECTIONSTRING;
const shareServiceClient = connectionString ? ShareServiceClient.fromConnectionString(connectionString) : "";

const fs = require('fs');

// File handling
const path = require('path');
const multer = require('multer');
const { base64 } = require('zod');
const openAIFileUpload = require('./openAI/openAIFileUpload');
const findBoundaries = require('./gradeUtils/findBoundaries');
const splitQuestionsBuffer = require('./gradeUtils/splitQuestionsBuffer');

// deprecated, can use this to select between buffer or disk storage
const storageSelectorByEnv = (env) => {
    if (env === 'staging') {
        // using memory buffer for azure
        return multer.memoryStorage();
    } else {
        // using local storage
        return multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './mediaUploadTemp/')
            },
            filename: function (req, file, cb) {
                cb(null, uuidv7() + path.extname(file.originalname)) //Appending extension
            }
        })
    }
}

// using buffer
const storage = multer.memoryStorage();


const upload = multer({
    'storage': storage, 
    'limits': {
        'fileSize': 5242880, // 5MB
        'files': 3
    }
}).array('files', 3);


// Checks extension of accepted files (used on /grade endpoint)
const checkExtension = (files, acceptedExt) => {
    let valid = true;
    for (let i = 0; i < files.length; i++) {
        if (acceptedExt.includes(path.extname(files[i].originalname)) == false) {
            valid = false;
            break;
        }
    }
    return valid;
}

const azureFileUpload = async (serviceClient, shareName, directoryName, content, fileName) => {
    const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName);

    const fileClient = directoryClient.getFileClient(fileName);
    await fileClient.create(content.length);
    console.log(`Create file ${fileName} successfully`);

    // Upload file range
    await fileClient.uploadRange(content, 0, content.length);
    console.log(`Uploaded file range to ${fileName} successfully`);
}

// function to saves files to DB. 
const saveAnsFilesToDb = (answerKeyId, answerKeyFileName, attemptId, attemptFileName, userId, res ) => {
    if (process.env.DB_IGNORED !== 'true') {
        const uploadedAnsKey = answerKey.createAnswerKey(answerKeyId, answerKeyFileName, userId, (err, result) => {
        if (err) { // Answer key link save failed EC_45
            res.status(500).send({'message': "An error occured while processing a file. EC_45"});
            return;
        } else {
            attempt.createAttempt(attemptId, attemptFileName, userId, answerKeyId, (err, result) => {
                if (err) { // Attempt sheet link save failed EC_46
                    answerKey.deleteAnswerKey(answerKeyId, (err, result) => {
                        if (err) {
                            console.log({'message': 'failed to cleanup answer key after failed attempt insertion. EC_46a'})
                        }
                    })
                    res.status(500).send({'message': "An error occured while processing a file. EC_46"});
                    return;
                } else {
                    return;
                }
            })
        }
        });   
    } else {
        console.log('db is ignored')
        return;
    }
    
}

// --------------------------------------------------------
// Hello world endpoint.
router.get('/grade', (req, res) => {
    res.status(200).send('grade');
})


// Client needs to set request enctype to "multipart/form-data"
// Returns a question's details like question text, correctness, idea behind answering question.
router.post('/grade',(req, res) => {
    // Size check handled by "upload" function
    upload(req, res, async (err) => {
        // error handling from incoming files (41)
        if (err instanceof multer.MulterError) {
            res.status(400).send({'message':'One or more files ran into an issue. EC_41'});
        } else if (err) { // other errors (42)
          console.log(err);
            res.status(400).send({'message':'An unexpected error occured. EC_42'});
        } else {
            // receive both files
            let files = req.files;
            let azureLinks = []
            const numOfFiles = files.length;
            const answerSheet = files[0];
            const answerKey = files[numOfFiles - 1];
            const questionPaper = numOfFiles === 3 ? files[1] : null;

            // file checks
            if (numOfFiles < 2) { // didn't receive both files (43)
                res.status(400).send({'message': 'Invalid number of files submitted. EC_43'});
                return;
            } else if (checkExtension(files, ['.pdf']) == false) { // invalid file format (44)
                res.status(400).send({'message': 'Invalid file format. EC_44'});
                return;
            }


            // if (req.body.user_id !== "undefined" && req.body.user_id !== undefined && req.body.user_id !== null) {
            //   console.log('testing');
            //     verifyBodyUserId(req, res);
            // };            
           
            // // file upload to azure (if applicable) and save to db
            // let userId = (req.body.user_id === null || req.body.user_id === "undefined") ? '019e555d-94ed-7336-ba9f-2b0622f5370f' : req.body.user_id; //dummy value for now
            
            // Creating uuid names for azure/openai
            const answerKeyId = uuidv7();
            const answerKeyFileName = `${answerKeyId}.pdf`;
            answerKey.filename = answerKeyFileName;

            const attemptId = uuidv7();
            const attemptFileName = `${attemptId}.pdf`;
            answerSheet.filename = attemptFileName;

            const questionPaperId = uuidv7();
            const questionPaperFileName = `${questionPaperId}.pdf`;
            questionPaper && (questionPaper.filename = questionPaperFileName);

            // upload into azure storage
            //const shareName = process.env.AZUREFILESHARENAME;
            //const directory = process.env.AZUREFILEDIRECTORY;
            //await azureFileUpload(shareServiceClient, shareName, directory, files[0].buffer, attemptFileName);
            //await azureFileUpload(shareServiceClient, shareName, directory, files[1].buffer, answerKeyFileName);
            //saveAnsFilesToDb(answerKeyId, answerKeyFileName, attemptId, attemptFileName, userId, res);
            

            // process answer sheet and answer key
            try {
                // cached version
                // let response = undefined;

                // if (app.locals.CACHE === 'undefined' || app.locals.CACHE === null) {
                //     response = await splitQuestionsBuffer(answerSheet, answerKey, questionPaper);
                //     let splitQuestionsData = JSON.parse(response.output_text);
                //     splitQuestionsData = JSON.stringify(splitQuestionsData);
                //     app.locals.CACHE = splitQuestionsData;
                // }

                // const markedImages = await mcqMarker(answerSheet, answerKey, questionPaper);
                

                // res.status(200).send({
                //     'message': 'marking successful', 
                //     'data': app.locals.CACHE,
                //     'answer_sheet': markedImages.answerSheet,
                //     'qrData': markedImages.qrData
                // });

                let response = await splitQuestionsBuffer(answerSheet, answerKey, questionPaper);
                let splitQuestionsData = JSON.parse(response.output_text);
                splitQuestionsData = JSON.stringify(splitQuestionsData);

                const markedImages = await mcqMarker(answerSheet, answerKey, questionPaper);
                

                res.status(200).send({
                    'message': 'marking successful', 
                    'data': splitQuestionsData,
                    'answer_sheet': markedImages.answerSheet,
                    'qrData': markedImages.qrData
                });
                return;
            } catch(err) {
              console.log(err);
                res.status(400).send({'message': 'An error occured while marking. EC_45'});
                return;
            }
        }    
    }) 
})


// Takes in an image and questions, then returns the boundaries of said questions on the image.
router.post('/grade/marking', async (req, res) => {

  let base64pageImage = req.body.pageImage;
  let questionData = req.body.questions;

  let parsedQuestionData = [];
  for(let i = 0; i < questionData.length; i++) {
    const newObj = {
      // uuid: questionData[i].uuid,
      //questionNumber: questionData[i].questionNumber,
      questionText: questionData[i].questionText,
      questionPage:  questionData[i].questionPage
    };
    parsedQuestionData.push(newObj);
  }
  
  let boundaries = await findBoundaries(base64pageImage, parsedQuestionData);
  let parsedBoundaries = JSON.parse(boundaries.output_text);
  for (let i = 0; i < questionData.length; i++) {
    const current_uuid = questionData[i].uuid;
    parsedBoundaries.questions[i].uuid = current_uuid;
  }

  

  // error checking for uuid?
  res.status(200).send(parsedBoundaries);
  //res.status(200).send();


})

// --------------------------------------------------------
// Generate Answer Sheet testing endpoint
// router.get('/grade/generate', (req, res) => {
//     generateAnswerSheetMcq(30, 4, `${uuidv7()}.pdf`)
//     res.status(200).send('generated pdf');
// })

module.exports = router;
