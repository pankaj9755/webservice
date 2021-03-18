/**
 * token middleware file
 */
var constants = require("./../config/adminConstants"),
    dbConnection = require("./../config/connection"),
    jwt = require("jsonwebtoken");

tokenMiddleware = function(req, res, next) {

    var token = req.headers.token ? req.headers.token : "";
    console.log("ttoken============", token);
    var response = {
        message: ""
    };
    if (token === "") {
        console.log()
        response.status = 400;
        response.message = constants.TOKEN_VALIDATION;
        return res.json(response);
    } else {
        jwt.verify(token, constants.TOKEN_VALUE, function(err, decoded) {
            if (err) { console.log('error=====',err)
                response.status = 400;
                response.message = err.message;
                res.send(response);
            } else {
                res.locals.userData = decoded;
                next();
            }
        });
    }
};
module.exports = tokenMiddleware;
