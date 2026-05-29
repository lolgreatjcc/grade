import fs from "fs";
import { openaiClient } from "./openaiClient";

const openAIFileUpload = async (fileName) => {
  const file = await openaiClient.files.create({
    file: fs.createReadStream(`/mediaUploadTemp/${fileLoc}`),
    purpose: "user_data"
  })

  return file;
}

module.exports = openAIFileUpload;