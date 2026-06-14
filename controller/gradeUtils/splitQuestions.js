const fs = require('fs');
const openaiClient = require('../openAI/openaiClient');
const openAIFileUpload = require('../openAI/openAIGradeFileUpload');
const openAIPrompts = require('../openAI/openAIPrompts');


const splitQuestions = async (answerSheetFileName, answerKeyFileName) => {
  
  const files = await openAIFileUpload(answerSheetFileName, answerKeyFileName);
  const prompt = openAIPrompts.splitQuestionsPrompt(files.answerSheetFile.id, files.answerKeyFile.id);
  const response = await openaiClient.responses.create(prompt);

  response.answerSheetFileId = files.answerSheetFile.id;
  response.answerKeyFileId= files.answerKeyFile.id;

  return response;
}

module.exports = splitQuestions;