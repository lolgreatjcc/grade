const OpenAI = require('openai');

console.log('Starting OpenAI Client...');

// Starts up OpenAI client. Imported across files to access the same openAI client.
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openaiClient;