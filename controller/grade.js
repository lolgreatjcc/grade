// imports
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const uuidv7 = uuid.v7;

// File handling
const path = require('path');
const multer = require('multer');
// if using local storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './mediaUploadTemp/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, uuidv7() + path.extname(file.originalname)) //Appending extension
//     }
// })

// if using Azure
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

router.get('/grade', (req, res) => {
    res.status(200).send('grade');
})

// Client needs to set request enctype to "multipart/form-data"
router.post('/grade', (req, res) => {
    // Size check handled by "upload" function
    // temporarily stored into local storage

    upload(req, res, (err) => {
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

            if (numOfFiles !== 2) { // (43)
                res.status(400).send({'message': 'Invalid number of files submitted. EC_43'});
                return;
            } else if (checkExtension(files, ['.pdf']) == false) { // (44)
                res.status(400).send({'message': 'Invalid file format. EC_44'});
                return;
            }

            let filesProcessed = 0;
            

            // upload into azure storage and get links
            // store answer key link (tied to fk user_id) and get answer_key_id
            // store attempt sheet (tied to fk user_id and answer_key_id) aand get attempt_id
            // return attempt id

            res.status(201).send({'message' : "Grading attempt created."});
        }    
    }) 
})

module.exports = router;