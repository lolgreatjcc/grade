// imports
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const uuidv7 = uuid.v7;
const answerKey = require('../model/answerKey');
const attempt = require('../model/attempt')

// Azure imports
const { ShareServiceClient } = require('@azure/storage-file-share');
const connectionString = process.env.AZURESTORAGECONNECTIONSTRING;
const shareServiceClient = ShareServiceClient.fromConnectionString(connectionString);

// File handling
const path = require('path');
const multer = require('multer');

// if using local storage, COMMENT IF AZURE
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './mediaUploadTemp/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, uuidv7() + path.extname(file.originalname)) //Appending extension
//     }
// })

// if using Azure, COMMENT IF LOCAL
const storage = multer.memoryStorage();

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
        console.log(path.extname(files[i].originalname));
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

router.get('/grade', (req, res) => {
    res.status(200).send('grade');
})

// Client needs to set request enctype to "multipart/form-data"
router.post('/grade', (req, res) => {
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

            if (numOfFiles !== 2) { // didn't receive both files (43)
                res.status(400).send({'message': 'Invalid number of files submitted. EC_43'});
                return;
            } else if (checkExtension(files, ['.pdf']) == false) { // invalid file format (44)
                res.status(400).send({'message': 'Invalid file format. EC_44'});
                return;
            }

            // Azure implementation, COMMENT IF LOCAL
            let answerKeyId = uuidv7();
            let answerKeyFileName = `${answerKeyId}.pdf`;
            let attemptId = uuidv7();
            let attemptFileName = `${attemptId}.pdf`;
            let userId = '019e555d-94ed-7336-ba9f-2b0622f5370f'; //dummy value for now

            // upload into azure storage, COMMENT IF LOCAL
            const shareName = process.env.AZUREFILESHARENAME;
            const directory = process.env.AZUREFILEDIRECTORY;
            await azureFileUpload(shareServiceClient, shareName, directory, files[0].buffer, attemptFileName);
            await azureFileUpload(shareServiceClient, shareName, directory, files[1].buffer, answerKeyFileName);

            // local storage implementation, COMMENT IF AZURE
            // let answerKeyId = path.basename(files[0].filename, '.pdf');
            // let answerKeyFileName = files[0].filename;
            // let attemptId = path.basename(files[1].filename, '.pdf');
            // let attemptFileName = files[1].filename;


            // Saving Answer Key link then Attempt Sheet link to database
            const uploadedAnsKey = answerKey.createAnswerKey(answerKeyId, answerKeyFileName, userId, (err, result) => {
                if (err) { // Answer key link save failed EC_45
                    res.status(500).send({'message': "An error occured while processing a file. EC_45"});
                    return;
                } else {
                    attempt.createAttempt(attemptId, attemptFileName, userId, answerKeyId, (err, result) => {
                        if (err) { // Attempt sheet link save failed EC_46
                            //console.log(err);
                            answerKey.deleteAnswerKey(answerKeyId, (err, result) => {
                                if (err) {
                                    console.log({'message': 'failed to cleanup answer key after failed attempt insertion. EC_46a'})
                                }
                            })
                            res.status(500).send({'message': "An error occured while processing a file. EC_46"});
                            return;
                        } else {
                            res.status(201).send({'message' : "Grading attempt created.", 'attempt_id': attemptId});
                        }
                    })
                }
            });   

        }    
    }) 
})

module.exports = router;