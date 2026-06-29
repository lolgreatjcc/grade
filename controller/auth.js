const express = require('express');
const router = express.Router();
const user = require('../model/user');


// Handles google authenthication  from googleID.
// Creates a user entry on our DB if user isn't found,
// finally retrieves users details.
router.post('/auth', (req, res) => {
    if (process.env.DB_IGNORED == 'true') {
        // db is ignored, EC_10
        console.log("Auth: DB_IGNORED is enabled. Please disable it and have your database set up before using this endpoint.");
        res.status(503).send({'message': 'Unable to process request at the moment. EC_10'});
        return;
    } else {
        const userData = req.body;
        if (userData.googleId == null || userData.googleId == undefined) {
            // missing googleId. EC_11
            res.status(400).send({'message': 'Missing credentials. EC_11'});
            return;
        } else {
                user.findUser(userData.googleId, (err, result, token) => {
                    if (err) {
                        // db error, EC_12
                        console.log(err);
                        res.status(500).send({'message': 'Unable to process request at the moment. EC_12'});
                        return;
                    }
                    else {
                        if (result == null) {
                            // user does not exist in db, create
                            user.createUser(userData.username, userData.email, userData.googleId, (err, result, token) => {
                                if (err) {
                                    // db error, EC_13
                                    console.log("Invalid parameters");
                                    console.log(err)
                                    res.status(500).send({'message': 'Unable to process request at the moment. EC_13'});
                                    return;
                                } else {
                                    res.status(200).send({'user_id': result.dataValues.user_id, 'token': token});
                                    console.log("User creation success");
                                    return;    
                                }
                            })
                        } else {
                            res.status(200).send({'user_id': result.dataValues.user_id, 'token':token});
                            console.log("User retrieval success");
                            return;  
                        }
                    }
                })
            }
    } 
})

module.exports = router;