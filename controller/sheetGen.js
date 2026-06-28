const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuid = require('fix-esm').require("uuid");
const uuidv7 = uuid.v7;
const path = require('path');
const openAIFileUpload = require('./openAI/openAIFileUpload');
const findQuestionNumbers = require('./sheetGenUtils/findQuestionNumbers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './mediaUploadTemp/')
  },
  filename: (req, file, cb) => {
    cb(null, uuidv7() + path.extname(file.originalname))
  }
})
const upload = multer({
  'storage': storage,
  'limits': {
    'fileSize': 5242880,
    'files': 1
  },

})


// Finds the number of MCQs and FRQs a pdf file has.
router.post('/sheetGen', upload.single('file'), async (req, res) => {

  const inputQnSheetFile = req.file;
  // upload to openai api
  const uploadedQnSheetFile = await openAIFileUpload(inputQnSheetFile.filename);

  // use uploaded file for openai request
  const qnData = await findQuestionNumbers(uploadedQnSheetFile.id);


  // return to user
  const parsedQnData = qnData.output_text;
  res.status(200).send(parsedQnData);
})

module.exports = router