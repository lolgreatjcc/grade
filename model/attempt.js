const sequelize = require("./sequelize/databaseModel.js");

const { Attempt } = sequelize.models;

const attempt = {
  createAttempt: (attempt_id, attempt_file_name, user_id, answer_key_id, callback) => {
    Attempt.create({
        'attempt_id': attempt_id,
        'attempt_file_name': attempt_file_name,
        'answer_key_id': answer_key_id, 
        'user_id': user_id,
    }).then((result) => {
        return callback(null, result);
      }).catch((err) => {
        return callback(err, null);
      })
  }
}

module.exports = attempt;