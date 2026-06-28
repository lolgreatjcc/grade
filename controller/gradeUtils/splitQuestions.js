const fs = require('fs');
const openaiClient = require('../openAI/openaiClient');
const openAIFileUpload = require('../openAI/openAIGradeFileUpload');
const openAIPrompts = require('../openAI/openAIPrompts');


// Splits PDF into respective questions, then retrieves correctness, key idea behind question etc.
// Uploads files to OpenAI, Designs prompts based on files, Sends OpenAI a request to retrieve details.
const splitQuestions = async (answerSheetFileName, answerKeyFileName) => {
  
  const files = await openAIFileUpload(answerSheetFileName, answerKeyFileName);
  const prompt = openAIPrompts.splitQuestionsPrompt(files.answerSheetFile.id, files.answerKeyFile.id);
  const response = await openaiClient.responses.create(prompt);

  response.answerSheetFileId = files.answerSheetFile.id;
  response.answerKeyFileId= files.answerKeyFile.id;

  return response;
}

module.exports = splitQuestions;