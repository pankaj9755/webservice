const constants = require("./../../../../../config/constants");
const UtilityHelper = require("./../../../../../libraries/UtilityHelper")();
const validators = require("./../../../../../validators/users/profile");
const profileServices = require("./../../../../../services/users/profile");
const logger = require("./../../../../../config/winstonConfig");
const signUpServices = require("./../../../../../services/users/signUp");
const fs = require("fs");
var md5 = require("md5");

const profileController = {
  /**
   * change password
   */
  changePassword: async (req, res) => {
    let old_password = req.body.old_password
      ? req.body.old_password.trim()
      : "";
    let new_password = req.body.new_password
      ? req.body.new_password.trim()
      : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let validate_data = { old_password, new_password };
    //check validation
    let validator_data = await validators.changePassword(validate_data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      if (new_password === old_password) {
        res.statusCode = 200;
        response.message = constants.OLD_PASSWORD_NEW_PASSWORD_SAME;
        response.success = 2;
        return res.json(response);
      }
      old_password = md5(old_password);
      new_password = md5(new_password);
      // check old password exist
      let data = { old_password, user_id };
      const checkPassword = await profileServices.checkPasswordExist(data);
      if (!checkPassword) {
        //if old password not match
        response.message = constants.CHANGE_PASSWORD_NOT_MATCH;
        res.statusCode = 400;
        return res.json(response);
      }
      //update new password
      let update_data = { new_password, user_id };
      let update_result = await profileServices.updatePassword(update_data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return await res.json(response);
      }
      response.message = constants.PASSWORD_CHANGE_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: profileController.change password failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * profile update
   */
  editProfile: async (req, res) => {
    let first_name = req.body.first_name ? req.body.first_name.trim() : "";
    let last_name = req.body.last_name ? req.body.last_name.trim() : "";
    let email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    let mobile_number = req.body.mobile_number
      ? req.body.mobile_number.trim()
      : "";
    let gender = req.body.gender ? req.body.gender.trim() : "";
    let city = req.body.city ? req.body.city.trim() : "";
    let kin_name = req.body.kin_name ? req.body.kin_name.trim() : "";
    let kin_number = req.body.kin_number ? req.body.kin_number.trim() : "";
    let profile_image = req.body.profile_image
      ? req.body.profile_image.trim()
      : "";
    let age = req.body.age ? req.body.age.trim() : "";
    let address = req.body.address ? req.body.address.trim() : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    first_name = UtilityHelper.ucwords(first_name);
    last_name = UtilityHelper.ucwords(last_name);
    let data = {
      first_name,
      last_name,
      email,
      mobile_number,
      gender,
      city,
      profile_image,
      age,
      address,
      user_id,
    };
    //check validation
    let validator_data = await validators.updateProfile(data);
    if (!validator_data.validate) {
		console.log('validator_data.message',validator_data.message);
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let EncrytedEmail = UtilityHelper.encrypted(email);
      let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);
      let Encryted_kin_number = UtilityHelper.encrypted(kin_number);
      data.email = EncrytedEmail;
      data.mobile_number = Encryted_mobile_number;
      data.kin_number = Encryted_kin_number;
      data.kin_name = kin_name;
      let exist_result = await signUpServices.checkEmailMobileAlreadyExists(
        data
      );
      if (exist_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (exist_result.emailExist) {
        res.statusCode = 409;
        response.message = constants.EMAIL_EXIST;
        response.statusCode = 409;
        return res.json(response);
      }
      if (exist_result.mobileExist) {
        res.statusCode = 409;
        response.message = constants.PHONE_EXIST;
        response.statusCode = 409;
        return res.json(response);
      }
      let result = await profileServices.checkExistId(data);
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let reffralCode = first_name;
      if (result.referral_code) {
        reffralCode = result.referral_code;
      }
      let lenghtOfCode = reffralCode.length;
      if (lenghtOfCode < 6) {
        reffralCode =
          reffralCode + UtilityHelper.randomIntNumber(5 - lenghtOfCode);
      } else {
        reffralCode = reffralCode.slice(0, 5);
      }
      reffralCode = reffralCode.replace(/ /g, "");
      let NewreffralCode = "";
      let check_referral_data = {
        user_id,
        reffralCode,
      };
      // check exist in database
      var referralResult = await profileServices.checkRefferalCode(
        check_referral_data
      );
      if (referralResult.length > 0) {
        var i = 0;
        while (i < referralResult.length) {
          let k1 = reffralCode + UtilityHelper.randomIntNumber(2);
          check_referral_data.reffralCode = k1;
          referralResult = await profileServices.checkRefferalCode(
            check_referral_data
          );
          if (referralResult.length > 0) {
            i = 0;
          } else {
            NewreffralCode = k1;
            i++;
          }
        }
      } else {
        NewreffralCode = reffralCode;
      }
      data.referral_code = NewreffralCode;
     
      let update_result = await profileServices.updateProfile(data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // delete previous profile image
      if (profile_image != "" && result.profile_image != "") {
        fs.unlink(
          constants.IMAGE_UPLOAD_PATH + "user/customer/" + result.profile_image,
          (err) => {}
        );
      }
      response.statusCode = 200;
      response.message = constants.PROFILE_UPDATE_SUCCESS;
      response.referral_code = NewreffralCode;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: profileController.edit profile failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = profileController;
