var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
const jwtHelper = require("../../../libraries/jwtHelper");
var md5 = require("md5");

Login = (req, res) => {
  var email = req.body.email ? req.body.email : "";
  var password = req.body.password ? md5(req.body.password) : "";
  var type = req.body.type ? req.body.type : "";
  var res_for_token = {};
  var response = {};

  if (email == "") {
    response.message = constants.EMAIL_VALIDATION;
    return res.status(constants.VALIDATION_STATUS_CODE).json(response);
  }

  if (password == "") {
    response.message = constants.PASSWORD_VALIDATION;
    return res.status(constants.VALIDATION_STATUS_CODE).json(response);
  }

  var sql = "SELECT * FROM admin WHERE email = '"+email+"' && password = '"+password+"'";
  dbConnection.query(sql, {type: dbConnection.QueryTypes.SELECT})
  .then(function(user) {  
    var result = user[0];
    if (user.length > 0) {
      res_for_token.id = result.id;
      res_for_token.first_name = result.first_name;
      res_for_token.image = result.image;
      res_for_token.email = result.email;

      jwtHelper.JWTSighing(res_for_token)
      .then(jwt_result => {
        if (jwt_result.status) {
          result["token"] = jwt_result.token;
          result["email"] = result.email;
          response = {
            status: constants.SUCCESS_STATUS_CODE,
            message: constants.LOGIN_SUCCESS,
            result: result
          };
          return res.status(constants.SUCCESS_STATUS_CODE).json(response);
        } else {
          response.status = constants.VALIDATION_STATUS_CODE;
          response.message = "Token error.";
          return res.status(constants.VALIDATION_STATUS_CODE).json(response);
        }
      });
    } else {
      response.status = constants.VALIDATION_STATUS_CODE;
      response.message = constants.INVALID_CREDENTIALS;
      return res.status(constants.VALIDATION_STATUS_CODE).json(response);
    }
  })
  .catch(function (err) {
    console.error("Error in login.js: "+ err);
    response.status = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
    response.message = constants.SOMETHING_WENT_WRONG;
    return res.status(constants.SOMETHING_WENT_WRONG_STATUS_CODE).json(response);
  });
}
module.exports = Login;
