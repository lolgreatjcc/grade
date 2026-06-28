const fs = require('fs');
const openaiClient = require('./openaiClient');


// Uploads answerSheets and answerKeys to OpenAI using file inside mediaUploadTemp
const openAIGradeFileUpload = async (answerSheetFileName, answerKeyFileName) => {
  const answerSheetFile = await openaiClient.files.create({
    file: fs.createReadStream(`mediaUploadTemp/${answerSheetFileName}`),
    purpose: "user_data"
  })


  const answerKeyFile = await openaiClient.files.create({
    file: fs.createReadStream(`mediaUploadTemp/${answerKeyFileName}`),
    purpose: "user_data"
  })

  return {
    answerSheetFile,
    answerKeyFile
  }
}

module.exports = openAIGradeFileUpload;