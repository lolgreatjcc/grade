const sequelize = require("./sequelize/databaseModel.js");

const { AnswerKey } = sequelize.models;

const answerKey = {
  createAnswerKey: (answer_key_id, answer_key_file_name, user_id, callback) => {
    AnswerKey.create({
      'answer_key_id': answer_key_id, 
      'answer_key_file_name': answer_key_file_name, 
      'user_id': user_id}).then((result) => {
        return callback(null, result);
      }).catch((err) => {
        return callback(err, null);
      })
  },
  deleteAnswerKey: (answer_key_id, callback) => {
    AnswerKey.destroy({
      'where': {'answer_key_id' : answer_key_id}
    }).then((result) => {
        return callback(null, result);
      }).catch((err) => {
        return callback(err, null);
      })
  }
}

module.exports = answerKey;