const openaiClient = require("../openAI/openaiClient");
const openAIPrompts = require("../openAI/openAIPrompts")

const findQuestionNumbers = async (qnSheetFileID) => {
  const prompt = openAIPrompts.findQuestionNumbers(qnSheetFileID);
  const response = await openaiClient.responses.create(prompt);

  return response;
}

module.exports = findQuestionNumbers;