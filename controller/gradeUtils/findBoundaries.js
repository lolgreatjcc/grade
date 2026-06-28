const openaiClient = require("../openAI/openaiClient");
const openAIPrompts = require("../openAI/openAIPrompts")


// Finds the boundaries of question through OpenAI
// Designs a prompt using the question data and an image.
// and sends OpenAI a request based on said prompt. 
const findBoundaries = async (base64Image, questionData) => {
  const prompt = openAIPrompts.findBoundaries(base64Image, questionData);
  const response = await openaiClient.responses.create(prompt);

  return response
}

module.exports = findBoundaries