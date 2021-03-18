var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var md5 = require('md5');

ChangePassword = (req, res) => {
    var response = {};
    var Id = res.locals.userData.id;
    var current_password = req.body.old_password ? md5(req.body.old_password) : "";
    var new_password = req.body.new_password ? md5(req.body.new_password) : "";
    var confirm_new_password = req.body.new_password ? md5(req.body.new_password) : "";

    if (current_password == '') {
        response.message = constants.OLD_PASSWORD_VALIDATION;
        return res.status(constants.VALIDATION_STATUS_CODE).json(response);
    }

    if(new_password == '') {
        response.message = constants.NEW_PASSWORD_VALIDATION;
        return res.status(constants.VALIDATION_STATUS_CODE).json(response);
    }

    if(confirm_new_password == ''){
        response.message = constants.CONFIRM_PASSWORD_VALIDATION;
        return res.status(constants.VALIDATION_STATUS_CODE).json(response);
    }

    sql = "SELECT * FROM `admin` WHERE id = '"+Id+"' && password = '"+current_password+"'";
    dbConnection.query(sql, {type: dbConnection.QueryTypes.SELECT})
    .then(function(user) {
        if(user.length > 0) {
            sql="UPDATE `admin` SET  password = '"+new_password+"' WHERE id='"+Id+"' && password='"+current_password+"'";
            dbConnection.query(sql, {type: dbConnection.QueryTypes.UPDATE}).then(function(result1) {
                var response = {
                    status: constants.SUCCESS_STATUS_CODE,
                    message: constants.PASSWORD_CHANGE_SUCCESS
                };        
                return res.status(constants.SUCCESS_STATUS_CODE).json(response);
            })
        } else {
            response.status = constants.VALIDATION_STATUS_CODE;
            response.message = constants.PASSWORD_CHANGE_FAIL;
            res.status(response.status).json(response);
        }
    })
    .catch(function (err) {
        console.error("Error in change_password.js: "+ err);
        response.status = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        response.message = constants.SOMETHING_WENT_WRONG;
        return res.json(response);
    });
}
module.exports = ChangePassword;
