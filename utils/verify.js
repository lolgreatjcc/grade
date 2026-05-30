const jwt = require('jsonwebtoken');

const verifyBodyUserId = (req, res) => {
    const user_id = req.body.user_id;
    if (typeof req.headers.authorization !== "undefined") { 
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
        if (err) {
        return res.status(403).send({ "message": "Unauthorized access, EC_01"});
        } else {
            if (result.user_id != user_id){
                return res.status(403).send({ "message": "Unauthorized access, EC_02"});
            } else {
                console.log("User verification okay");
            }
        }
    });
    } else {
        res.status(403).send({ "message": "Unauthorized access, missing authorization headers. EC_03" });
    }
}


module.exports = verifyBodyUserId;