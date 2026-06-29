const fs = require('fs');
const openaiClient = require('./openaiClient');
const { toFile } = require('openai');

const openAISheetGenBufferUpload = async (questionPaperBuffer, questionPaperName) => {
  const questionPaper = await toFile(questionPaperBuffer, questionPaperName, { type: 'application/pdf' });
  const questionPaperFile = await openaiClient.files.create({
    file: questionPaper,
    purpose: "user_data"
  })

  return questionPaperFile
}

module.exports = openAISheetGenBufferUpload;