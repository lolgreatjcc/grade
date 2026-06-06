const fs = require('fs');
const openaiClient = require('../openAI/openaiClient');
const openAIBufferUpload = require('../openAI/openAIBufferUpload');
const openAIPrompts = require('../openAI/openAIPrompts');



const splitQuestionsBuffer = async (answerSheetBuffer, answerSheetFileName, answerKeyBuffer, answerKeyFileName) => {
  const files = await openAIBufferUpload(answerSheetBuffer, answerSheetFileName, answerKeyBuffer, answerKeyFileName);
  const prompt = openAIPrompts.splitQuestionsPrompt(files.answerSheetFile.id, files.answerKeyFile.id);
  const response = await openaiClient.responses.create(prompt);

  //console.log(response);
  return response;
}

module.exports = splitQuestionsBuffer;