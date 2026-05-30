const sequelize = require("./sequelize/databaseModel.js");
const jwt = require('jsonwebtoken');

const { User } = sequelize.models;

const user = {
  createUser: (user_username, user_email, user_google_sso, callback) => {
    User.create({
      'user_username': user_username, 
      'user_email': user_email, 
      'user_google_sso': user_google_sso}).then((result) => {
        const token = jwt.sign({
          user_id: result.user_id
        }, 
        process.env.SECRET_KEY,
        {
          'expiresIn': 86400
        });
        return callback(null, result, token);
      }).catch((err) => {
        return callback(err, null, null);
      })
  },
  findUser: (user_google_sso, callback) => {
    User.findOne({
      'where': {'user_google_sso' : user_google_sso}
    }).then((result) => {
      const token = jwt.sign({
        user_id: result.user_id
        }, 
        process.env.SECRET_KEY,
        {
          'expiresIn': 86400
        });
        return callback(null, result, token);
      }).catch((err) => {
        return callback(err, null, null);
      })
  }
}

module.exports = user;