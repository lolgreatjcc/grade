const openaiClient = require("../openAI/openaiClient");
const openAIPrompts = require("../openAI/openAIPrompts")


const findBoundaries = async (base64Image, questionData) => {


  const prompt = openAIPrompts.findBoundaries(base64Image, questionData);
  const response = await openaiClient.responses.create(prompt);

  return response
}

module.exports = findBoundaries