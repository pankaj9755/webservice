const constants = require("./../../../../../config/constants");
const UtilityHelper = require("./../../../../../libraries/UtilityHelper")();
const jwtHelper = require("./../../../../../libraries/jwtHelper");
const validators = require("./../../../../../validators/users/login");
const loginServices = require("./../../../../../services/users/login");
const signUpServices = require("./../../../../../services/users/signUp");
const logger = require("./../../../../../config/winstonConfig");
var EmailHelper = require("./../../../../../libraries/EmailHelper")();
var googleRecaptcha = require("./../../../../../libraries/googleRecaptcha")();
var md5 = require("md5");
require("dotenv").config();

const loginController = {
  /**
   * login
   */
  signIn: async (req, res) => {
    let user_name = req.body.user_name
      ? req.body.user_name.trim().toLowerCase()
      : "";
    let password = req.body.password ? req.body.password : "";
    let device_type = req.body.device_type ? req.body.device_type : "";
    let device_key = req.body.device_key ? req.body.device_key : null;
    let social_key1 = req.body.social_key ? req.body.social_key : "";
    let social_type1 = req.body.social_type ? req.body.social_type : "";
    let notification_key = req.body.notification_key
      ? req.body.notification_key
      : null;
    let dd = req.body.dd ? req.body.dd : null;
    let dod = req.body.dod ? req.body.dod : null;
    const response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_name,
      password,
      device_type,
      device_key,
      notification_key,
      social_key1,
      social_type1,
    };
    // check validation error
    let validator_result = await validators.signIn(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // check login
      let credentials = UtilityHelper.encrypted(user_name);
      password = md5(password);
      let login_data = {
        credentials,
        password,
        social_key1,
        social_type1,
      };
      let result = await loginServices.login(login_data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.statusCode = 400;
        response.message = constants.WRONG_CREDENTIALS;
        response.notification_key = notification_key;
        res.statusCode = 400;
        return res.json(response);
      }
      if (result.status == "inactive") {
        response.statusCode = 400;
        response.message = constants.INACTIVE_USER;
        return res.json(response);
      }
      if (result.user_type == "therapist") {
        result.is_bank_info = "no";
        let bankInfo = await loginServices.checkBankInfo(result.id);
        if (bankInfo === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        if (bankInfo) {
          result.is_bank_info = "yes";
        }
      }
      result.email = UtilityHelper.decrypted(result.email);
      result.mobile_number = UtilityHelper.decrypted(result.mobile_number);
      if (result.kin_number) {
        result.kin_number = UtilityHelper.decrypted(result.kin_number);
      }
      if (result.qualification) {
        result.qualification = JSON.parse(result.qualification);
      }
      // make token
      let token_data = {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        mobile_number: result.mobile_number,
        user_type: result.user_type,
        kin_number: result.kin_number,
        kin_name: result.kin_name,
        referral_code: result.referral_code,
        used_group_code: result.used_group_code,
      };
      let tokenInfo = await jwtHelper.JWTSighing(token_data);
      if (!tokenInfo.status) {
        response.statusCode = 400;
        response.message = constants.SOMETHING_WENT_WRONG;
        res.statusCode = 400;
        return res.json(response);
      }
      // update user info
      let last_seen = new Date();
      let id = result.id;
      let update_data = {
        id,
        device_type,
        device_key,
        notification_key,
        dod,
        dd,
        last_seen,
      };
      let update_user_info = await loginServices.updateUserInfo(update_data);
      if (update_user_info === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      delete result.password;
      delete result.updated_at;
      delete result.social_key;
      delete data.social_type;
      delete result.created_at;
      delete result.deleted_at;
      delete result.is_mobile_verify;
      delete result.is_email_verify;
      result.token = tokenInfo.token;
      response.statusCode = 200;
      response.message = constants.LOGIN_SUCCESSFULLY;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: loginController.signIn failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * forgot password
   */
  forgotPassword: async (req, res) => {
    let email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = { email: email };
    let validator_result = await validators.forgotPassword(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let EncrytedEmail = UtilityHelper.encrypted(email);
      // let recaptchaResutl = await googleRecaptcha.verifyRecaptcha(data);
      // googleRecaptcha.verifyRecaptcha(data, async function(recaptchaResutl) {
      //   if (recaptchaResutl.status == 1) {
      let check_data = {
        email: EncrytedEmail,
      };
      let result = await loginServices.checkEmailExist(check_data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.EMAIL_NOT_EXIST;
        res.statusCode = 400;
        return res.json(response);
      }
      let otp_code = _.random(1000, 9999);
      let data = {
        user_id: result.id,
        otp_code: otp_code,
      };
      let user_key = result.id;
      let update_result = await loginServices.updateOtpCode(data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (process.env.MAIL_SEND.toString() === "true") {
        let get_template_data = {
          id: 2,
        };
        let templateResult = await loginServices.getEmailTemplate(
          get_template_data
        );
        if (templateResult) {
          let CUSTOMERNAME = "Hello";
          if (result.first_name != "") {
            CUSTOMERNAME = "Hi " + result.first_name + " " + result.last_name;
          }
          var LOGO = constants.BASEURL + "public/images/email_logo.png";
          var LINK =
            '<a style="border-radius: 3px; font-size: 15px; color: white; border: 1px #bac866 solid; box-shadow: inset 0 1px 0 #bac866, inset 1px 0 0 #bac866; text-decoration: none; padding: 10px 7px 10px 7px; width: 110px; max-width: 210px; margin: 6px auto; display: block; background-color: #bac866; text-align: center;" href="' +
            constants.BASE_PATH +
            "reset-password/" +
            user_key +
            "/" +
            otp_code +
            '">Reset Password</a>';
          var htmlTemplate = templateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[CUSTOMERNAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[LINK]", LINK);
          let mailOption = {
            subject: templateResult.subject,
            body: htmlTemplate,
            email: email,
          };
          EmailHelper.sendEmail(mailOption, function (mailResutl) {
            console.log("EMAIL SEND");
          });
        }
      }
      response.statusCode = 200;
      response.code = otp_code;
      response.message = constants.FORGOT_PASSWORD;
      return res.json(response);
      // } else {
      //   response.statusCode = 400;
      //   response.message = constants.SOMETHING_WENT_WRONG;
      //   //res.statusCode = 400;
      //   return res.send(response);
      // }
      //});
    } catch (err) {
      logger.log(
        "error",
        "try-catch: loginController.forgotPassword failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * reset password
   */
  resetPassword: async (req, res) => {
    let token = req.body.token ? req.body.token.trim() : "";
    let password = req.body.password ? req.body.password : "";
    let user_id = req.body.user_id ? req.body.user_id : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let validation_data = { token, password, user_id };
    let validator_result = await validators.resetPassword(validation_data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      password = md5(password);
      let check_data = { user_id, token };
      let exist_result = await loginServices.checkToken(check_data);
      if (!exist_result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let data = {
        user_id,
        password,
      };
      let result = await loginServices.updatePassword(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.RESET_PASSWORD_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: loginController.resetPassword failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = loginController;
