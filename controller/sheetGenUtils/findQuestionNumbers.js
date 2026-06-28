const openaiClient = require("../openAI/openaiClient");
const openAIPrompts = require("../openAI/openAIPrompts")


// Finds the number of MCQs and FRQs on an uploaded file.
// Designs a prompt using the question file ID.
// and sends OpenAI a request based on said prompt. 
const findQuestionNumbers = async (qnSheetFileID) => {
  const prompt = openAIPrompts.findQuestionNumbers(qnSheetFileID);
  const response = await openaiClient.responses.create(prompt);

  return response;
}

module.exports = findQuestionNumbers;