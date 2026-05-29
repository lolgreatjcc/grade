const OpenAI = require('openai');

console.log('Starting OpenAI Client...');

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openaiClient;