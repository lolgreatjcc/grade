// imports
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const uuid = require('fix-esm').require("uuid");
const uuidv7 = uuid.v7;
const answerKey = require('../model/answerKey');
const attempt = require('../model/attempt')

const {openaiClient} = require('./openAI/openaiClient');

// utils
const mcqMarker = require('../utils/mcqMarker');
const verifyBodyUserId = require('../utils/verify');
const splitQuestions = require('./gradeUtils/splitQuestions');


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

const storage = storageSelectorByEnv(process.env.NODE_ENV);

const upload = multer({
    'storage': storage, 
    'limits': {
        'fileSize': 5242880, // 5MB
        'files': 2
    }
}).array('files', 2);


// functions
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

router.get('/grade', (req, res) => {
    res.status(200).send('grade');
})


// Client needs to set request enctype to "multipart/form-data"
router.post('/grade',(req, res) => {
    // Size check handled by "upload" function
    upload(req, res, async (err) => {
        // error handling from incoming files (41)
        if (err instanceof multer.MulterError) {
            res.status(400).send({'message':'One or more files ran into an issue. EC_41'});
        } else if (err) { // other errors (42)
            res.status(400).send({'message':'An unexpected error occured. EC_42'});
        } else {
            // receive both files
            let files = req.files;
            let azureLinks = []
            let numOfFiles = files.length;
            const answerSheet = files[0];
            const answerKey = files[1];

            // file checks
            if (numOfFiles !== 2) { // didn't receive both files (43)
                res.status(400).send({'message': 'Invalid number of files submitted. EC_43'});
                return;
            } else if (checkExtension(files, ['.pdf']) == false) { // invalid file format (44)
                res.status(400).send({'message': 'Invalid file format. EC_44'});
                return;
            }

            if (req.body.user_id !== "undefined" & req.body.user_id !== null) {
                verifyBodyUserId(req, res);
            };            
           
            // file upload to azure (if applicable) and save to db
            let userId = (req.body.user_id === null || req.body.user_id === "undefined") ? '019e555d-94ed-7336-ba9f-2b0622f5370f' : req.body.user_id; //dummy value for now
            if (process.env.NODE_ENV === 'staging') {
                // Creating uuid names for azure
                let answerKeyId = uuidv7();
                let answerKeyFileName = `${answerKeyId}.pdf`;
                answerKey.filename = answerKeyFileName;

                let attemptId = uuidv7();
                let attemptFileName = `${attemptId}.pdf`;
                answerSheet.filename = attemptFileName;
                // upload into azure storage
                //const shareName = process.env.AZUREFILESHARENAME;
                //const directory = process.env.AZUREFILEDIRECTORY;
                //await azureFileUpload(shareServiceClient, shareName, directory, files[0].buffer, attemptFileName);
                //await azureFileUpload(shareServiceClient, shareName, directory, files[1].buffer, answerKeyFileName);
                //saveAnsFilesToDb(answerKeyId, answerKeyFileName, attemptId, attemptFileName, userId, res);
            } else {
                // local implementation (multer configured to generate uuid names)
                let answerKeyId = path.basename(files[0].filename, '.pdf');
                let answerKeyFileName = files[0].filename;
                let attemptId = path.basename(files[1].filename, '.pdf');
                let attemptFileName = files[1].filename;
                //saveAnsFilesToDb(answerKeyId, answerKeyFileName, attemptId, attemptFileName, userId, res);
            }

            // process answer sheet and answer key
            try {
                const markedImages = await mcqMarker(answerSheet, answerKey);
                let response = undefined;
              
                if (process.env.NODE_ENV == 'staging') {
                  response = await splitQuestionsBuffer(files[0].buffer, markedImages.answerSheetFilename, files[1].buffer, markedImages.answerKeyFilename);
                } else {
                  response = await splitQuestions(markedImages.answerSheetFilename, markedImages.answerKeyFilename);
                }
              
                let splitQuestionsData = JSON.parse(response.output_text);
                for (let i = 0; i < splitQuestionsData.questions.length; i++) {
                  splitQuestionsData.questions[i].uuid = uuidv7();
                }
                splitQuestionsData = JSON.stringify(splitQuestionsData);

                res.status(200).send({
                    'message': 'marking successful', 
                    'data': splitQuestionsData,
                    'answer_sheet': markedImages.answerSheet
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


router.post('/grade/marking', async (req, res) => {

  let base64pageImage = req.body.pageImage;
  // let base64Img = pageImage.split(';base64,').pop();

  // let imageFileName = uuidv7() + '.png';

  // fs.writeFile(`./mediaUploadTemp/${imageFileName}`, base64Img, {encoding: 'base64'}, function(err) {
  //   console.log('File created');
  // });

  // const uploadedFile = await openAIFileUpload(pageImage);

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

module.exports = router;
