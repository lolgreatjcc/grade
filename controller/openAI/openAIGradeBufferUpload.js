const fs = require('fs');
const openaiClient = require('./openaiClient');
const { toFile } = require('openai')
const openAIGradeBufferUpload = async (answerSheetBuffer, answerSheetName, answerKeyBuffer, answerKeyName) => {
  const answerSheet = await toFile(answerSheetBuffer, answerSheetName, { type: 'application/pdf' });
  const answerSheetFile = await openaiClient.files.create({
    file: answerSheet,
    purpose: "user_data"
  })

  const answerKey = await toFile(answerKeyBuffer, answerKeyName, { type: 'application/pdf' });
  const answerKeyFile = await openaiClient.files.create({
    file: answerKey,
    purpose: "user_data"
  })

  return {
    answerSheetFile,
    answerKeyFile
  }
}

module.exports = openAIGradeBufferUpload;