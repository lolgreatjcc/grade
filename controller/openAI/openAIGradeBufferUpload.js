const fs = require('fs');
const openaiClient = require('./openaiClient');
const { toFile } = require('openai')
const openAIGradeBufferUpload = async (answerSheet, answerKey, questionPaper) => {
  const answerSheetBlob = await toFile(answerSheet.buffer, answerSheet.filename, { type: 'application/pdf' });
  const answerSheetFile = await openaiClient.files.create({
    file: answerSheetBlob,
    purpose: "user_data"
  })

  const answerKeyBlob = await toFile(answerKey.buffer, answerKey.filename, { type: 'application/pdf' });
  const answerKeyFile = await openaiClient.files.create({
    file: answerKeyBlob,
    purpose: "user_data"
  })

  let questionPaperFile = null;
  if (questionPaper) {
    const questionPaperBlob = await toFile(questionPaper.buffer, questionPaper.filename, { type: 'application/pdf' });
    questionPaperFile = await openaiClient.files.create({
      file: questionPaperBlob,
      purpose: "user_data"
    })
  }

  return {
    answerSheetFile,
    answerKeyFile,
    questionPaperFile
  }
}

module.exports = openAIGradeBufferUpload;