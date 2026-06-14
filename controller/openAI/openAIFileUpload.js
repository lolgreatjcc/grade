const fs = require('fs');
const openaiClient = require('./openaiClient');

const openAIFileUpload = async (image_url) => {
  const file = await openaiClient.files.create({
    file: fs.createReadStream(`mediaUploadTemp/${filename}`),
    purpose: "user_data"
  })
  return file;
}

module.exports = openAIFileUpload;
