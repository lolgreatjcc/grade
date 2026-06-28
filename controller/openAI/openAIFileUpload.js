const fs = require('fs');
const openaiClient = require('./openaiClient');

// Uploads a single file to OpenAI.  
const openAIFileUpload = async (image_url) => {
  const file = await openaiClient.files.create({
    file: fs.createReadStream(`mediaUploadTemp/${image_url}`),
    purpose: "user_data"
  })
  return file;
}

module.exports = openAIFileUpload;
