var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var md5 = require('md5');
// var jwt = require('jsonwebtoken');
var moment = require('moment');

EditAdminprofile = (req, res) => {
    var first_name = req.body.first_name ? req.body.first_name : "";
    var email = req.body.email ? req.body.email : "";
    var image = req.body.image ? req.body.image : "";
    var update = new Date();
    update = moment(update).format("YYYY-MM-DD HH:mm:ss");
    console.log(update);
    console.log("user data: ", res.locals.userData);
    var res_for_token = {};
    var response = {};
   
   // var token = jwt.sign(res_for_token, constants.TOKEN_VALUE);
   response.status = constants.VALIDATION_STATUS_CODE;
   
/*   if (email == "") {
       email=res.locals.userData.email;
    }

    if(first_name == "") {
        first_name=res.locals.userData.first_name;
    }

    if(image == "") {
        image =res.locals.userData.image;
    }*/

    var sql = "UPDATE `admin` SET email='" + email + "',first_name='" + first_name + "',image='" + image + "', updated_at='"+update+"' WHERE id = '" + res.locals.userData.id + "'";
    dbConnection.query(sql, { type: dbConnection.QueryTypes.UPDATE })
    .then(function (user) {
        if (user.length > 0) {
            var response = {
                status: constants.SUCCESS_STATUS_CODE,
                message: constants.UPDATE_SUCCESS,
                result:{ email: email, name: first_name, image: image}
            };
            return res.status(constants.SUCCESS_STATUS_CODE).json(response);
        } else {
            var response = {};
            response.status = constants.VALIDATION_STATUS_CODE;
            response.message = constants.INVALID_CREDENTIALS;
            res.status(response.status).json(response);
        }
    }).catch(function (err) {
        console.error("Error in edit_admin_profile.js: "+ err);
        response.status = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        response.message = constants.SOMETHING_WENT_WRONG;
        return res.json(response);
    });
}
module.exports = EditAdminprofile;