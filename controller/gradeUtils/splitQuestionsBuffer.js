const fs = require('fs');
const openaiClient = require('../openAI/openaiClient');
const openAIGradeBufferUpload = require('../openAI/openAIGradeBufferUpload');
const openAIPrompts = require('../openAI/openAIPrompts');


// Splits PDF into respective questions, then retrieves correctness, key idea behind question etc.
// Uploads files to OpenAI, Designs prompts based on files, Sends OpenAI a request to retrieve details.
// Specifically uses buffer instead of saving file.
const splitQuestionsBuffer = async (answerSheet, answerKey, questionPaper) => {
  const files = await openAIGradeBufferUpload(answerSheet, answerKey, questionPaper);
  let prompt;
  if (questionPaper) {
    prompt = openAIPrompts.splitQuestionsPromptTriple(files.answerSheetFile.id, files.answerKeyFile.id, 
      files.questionPaperFile.id);
  } else {
    prompt = openAIPrompts.splitQuestionsPromptDual(files.answerSheetFile.id, files.answerKeyFile.id);
  }

  const response = await openaiClient.responses.create(prompt);
  return response;
  
  //console.log(response);

}

module.exports = splitQuestionsBuffer;