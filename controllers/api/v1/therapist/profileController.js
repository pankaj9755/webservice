const constants = require("./../../../../config/constants");
const UtilityHelper = require("./../../../../libraries/UtilityHelper")();
const validators = require("./../../../../validators/users/therapist/profile");
const profileServices = require("./../../../../services/users/therapist/profile");
const logger = require("./../../../../config/winstonConfig");
const signUpServices = require("./../../../../services/users/signUp");
const fs = require("fs");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

const profileController = {
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
    let years_experience = req.body.years_experience
      ? req.body.years_experience.trim()
      : "";
    let address = req.body.address ? req.body.address.trim() : "";
    let qualification = req.body.qualification
      ? req.body.qualification.trim()
      : null;
    let therapy_type = req.body.therapy_type
      ? req.body.therapy_type.trim()
      : "";
    let hpcsa_no = req.body.hpcsa_no ? req.body.hpcsa_no.trim() : "";
    let about_me = req.body.about_me ? req.body.about_me.trim() : null;
    let profile_image = req.body.profile_image
      ? req.body.profile_image.trim()
      : "";
    let id_proof = req.body.id_proof ? req.body.id_proof.trim() : "";
    let lattitude = req.body.lattitude ? req.body.lattitude.trim() : null;
    let longitude = req.body.longitude ? req.body.longitude.trim() : null;
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
      address,
      years_experience,
      qualification,
      therapy_type,
      hpcsa_no,
      about_me,
      profile_image,
      id_proof,
      lattitude,
      longitude,
      user_id,
    };
    //check validation
    let validator_data = await validators.updateProfile(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    if (res.locals.userData.user_type != "therapist") {
      response.message = constants.INVALID_USER_TYPE;
      res.statusCode = 400;
      return res.json(response);
    }
    qualification = JSON.stringify(qualification);
    let EncrytedEmail = UtilityHelper.encrypted(email);
    let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);
    data.email = EncrytedEmail;
    data.mobile_number = Encryted_mobile_number;
    let exist_result = await signUpServices.checkEmailMobileAlreadyExists(data);
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
    let update_result = await profileServices.updateProfile(data);
    if (update_result === "result_failed") {
      res.statusCode = 500;
      return res.json(response);
    }
    // delete previous profile image
    if (profile_image != "" && result.profile_image != "") {
      fs.unlink(
        constants.IMAGE_UPLOAD_PATH + "user/therapist/" + result.profile_image,
        (err) => {}
      );
    }
    // delete previous profile image
    if (id_proof != "" && result.id_proof != "") {
      fs.unlink(
        constants.IMAGE_UPLOAD_PATH + "user/id_proof/" + result.id_proof,
        (err) => {}
      );
    }
    response.statusCode = 200;
    res.statusCode = 200;
    response.message = constants.PROFILE_UPDATE_SUCCESS;
    return res.json(response);
  },

  /**
   * get bank info
   */
  getBankInfo: async (req, res) => {
    console.log(res.locals.userData);
    let user_id = res.locals.userData.id;
    let data = {
      user_id,
    };
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let result = await profileServices.getBankInfo(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      response.statusCode = 200;
      res.statusCode = 200;
      delete response.message;
      response.result = result;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: profileController.my review failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * add bank info
   */
  addBankInfo: async (req, res) => {
    let bank_name = req.body.bank_name ? req.body.bank_name : "";
    let account_holder_name = req.body.account_holder_name
      ? req.body.account_holder_name
      : "";
    let account_number = req.body.account_number ? req.body.account_number : "";
    // let zipcode = req.body.zipcode ? req.body.zipcode : "";
    // let id_proof = req.body.id_proof ? req.body.id_proof : "";
    // let address_line_1 = req.body.address_line_1 ? req.body.address_line_1 : "";
    // let address_line_2 = req.body.address_line_2 ? req.body.address_line_2 : "";
    // let state = req.body.state ? req.body.state : "";
    // let city = req.body.city ? req.body.city : "";
    let routing_number = req.body.routing_number ? req.body.routing_number : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id: user_id,
      bank_name: bank_name,
      account_holder_name: account_holder_name,
      account_number: account_number,
      routing_number: routing_number,
      ssn_number: 0,
      //zipcode,
      //id_proof,
      //address_line_1,
      //address_line_2,
      //state,
      // city,
    };
    //check validation
    let validator_data = await validators.addBankInfo(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      data.bank_id = shortid.generate();
      data.stripe_customer_id = shortid.generate();
      // check exist or not bank info
      let exist_result = await profileServices.getBankInfo(data);
      if (exist_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!exist_result) {
        let result = await profileServices.addBankInfo(data);
        if (result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        response.statusCode = 200;
        res.statusCode = 200;
        response.message = constants.BANK_INFORMATION_ADDED_SUCCESSFUL;
        return res.json(response);
      } else {
        let result = await profileServices.updateBankInfo(data);
        if (result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        response.statusCode = 200;
        res.statusCode = 200;
        response.message = constants.BANK_INFORMATION_UPDATED_SUCCESSFUL;
        return res.json(response);
      }
    } catch (err) {
      logger.log(
        "error",
        "try-catch: profileController.add bank info failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * edit bank info
   */
  editBankInfo: async (req, res) => {
    let bank_name = req.body.bank_name ? req.body.bank_name : "";
    let account_holder_name = req.body.account_holder_name
      ? req.body.account_holder_name
      : "";
    let account_number = req.body.account_number ? req.body.account_number : "";
    // let zipcode = req.body.zipcode ? req.body.zipcode : "";
    // let id_proof = req.body.id_proof ? req.body.id_proof : "";
    // let address_line_1 = req.body.address_line_1 ? req.body.address_line_1 : "";
    // let address_line_2 = req.body.address_line_2 ? req.body.address_line_2 : "";
    // let state = req.body.state ? req.body.state : "";
    // let city = req.body.city ? req.body.city : "";
    let routing_number = req.body.routing_number ? req.body.routing_number : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
      bank_name,
      account_holder_name,
      account_number,
      routing_number,
      // ssn_number,
      //zipcode,
      //id_proof,
      //address_line_1,
      //address_line_2,
      //state,
      // city,
    };
    //check validation
    let validator_data = await validators.updateBankInfo(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await profileServices.updateBankInfo(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.statusCode = 200;
      res.statusCode = 200;
      response.message = constants.BANK_INFORMATION_UPDATED_SUCCESSFUL;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: profileController.update bank info failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * my review
   */
  myReview: async (req, res) => {
    let user_id = res.locals.userData.id;
    let data = {
      user_id,
    };
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let result = await profileServices.getMyReview(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.REVIEW_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      response.statusCode = 200;
      delete response.message;
      res.statusCode = 200;
      response.result = result;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: profileController.my review failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = profileController;
