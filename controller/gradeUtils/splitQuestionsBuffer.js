const fs = require('fs');
const openaiClient = require('../openAI/openaiClient');
const openAIGradeBufferUpload = require('../openAI/openAIGradeBufferUpload');
const openAIPrompts = require('../openAI/openAIPrompts');


// Splits PDF into respective questions, then retrieves correctness, key idea behind question etc.
// Uploads files to OpenAI, Designs prompts based on files, Sends OpenAI a request to retrieve details.
// Specifically uses buffer instead of saving file.
const splitQuestionsBuffer = async (answerSheetBuffer, answerSheetFileName, answerKeyBuffer, answerKeyFileName) => {
  const files = await openAIGradeBufferUpload(answerSheetBuffer, answerSheetFileName, answerKeyBuffer, answerKeyFileName);
  const prompt = openAIPrompts.splitQuestionsPrompt(files.answerSheetFile.id, files.answerKeyFile.id);
  const response = await openaiClient.responses.create(prompt);

  //console.log(response);
  return response;
}

module.exports = splitQuestionsBuffer;