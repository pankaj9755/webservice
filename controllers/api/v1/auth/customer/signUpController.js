const constants = require("./../../../../../config/constants");
const UtilityHelper = require("./../../../../../libraries/UtilityHelper")();
var SmsHelper = require("./../../../../../libraries/SmsHelper")();
const jwtHelper = require("./../../../../../libraries/jwtHelper");
const validators = require("./../../../../../validators/users/signUp");
const services = require("./../../../../../services/users/signUp");
const logger = require("./../../../../../config/winstonConfig");
var md5 = require("md5");
require("dotenv").config();
var EmailHelper = require("./../../../../../libraries/EmailHelper")();
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

const signUpController = {
  /**
   * Registration
   */
  registration: async (req, res) => {
    let first_name = req.body.first_name ? req.body.first_name.trim() : "";
    let last_name = req.body.last_name ? req.body.last_name.trim() : "";
    let email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    let password = req.body.password ? req.body.password.trim() : "";
    let mobile_number = req.body.mobile_number
      ? req.body.mobile_number.trim()
      : "";
    let user_type = req.body.user_type ? req.body.user_type.trim() : "";
    let age = req.body.age ? req.body.age.trim() : "";
    let kin_name = req.body.kin_name ? req.body.kin_name.trim() : null;
    let kin_number = req.body.kin_number ? req.body.kin_number.trim() : null;
    let group_code = req.body.group_code
      ? req.body.group_code.trim().toUpperCase()
      : null;
    // let used_referral = req.body.used_referral ? req.body.used_referral : "";
    let device_type = req.body.device_type ? req.body.device_type.trim() : "";
    let device_key = req.body.device_key ? req.body.device_key : null;
    let social_key = req.body.social_key ? req.body.social_key : "";
    let social_type = req.body.social_type ? req.body.social_type : "";
    let notification_key = req.body.notification_key
      ? req.body.notification_key
      : null;
    let dd = req.body.dd ? req.body.dd : null;
    let dod = req.body.dod ? req.body.dod : null;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    first_name = UtilityHelper.ucwords(first_name);
    last_name = UtilityHelper.ucwords(last_name);
    let data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      age: age,
      password: password,
      mobile_number: mobile_number,
      user_type: user_type,
      kin_name: kin_name,
      kin_number: kin_number,
      social_key: social_key,
      social_type: social_type,
      device_type: device_type,
      device_key: device_key,
      notification_key: notification_key,
      dd: dd,
      dod: dod,
      group_code: group_code,
    };
    // check validation error
    let validator_result = await validators.registration(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      data.password = md5(password);
      let EncrytedEmail = UtilityHelper.encrypted(email);
      let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);
      let Encryted_kin_number = "";
      if (kin_number) {
        Encryted_kin_number = UtilityHelper.encrypted(kin_number);
      }
      let TokenExpiryTime = 60 * 60;
      // check email or mobile already exists
      let exist_data = {
        email: EncrytedEmail,
        mobile_number: Encryted_mobile_number,
      };
      let exist_result = await services.checkEmailMobileAlreadyExists(
        exist_data
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
      if (group_code) {
        let group_code_result = await services.checkExistGroupCode(group_code);
        if (group_code_result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        if (!group_code_result) {
          response.message = constants.GROUP_CODE_NOT_EXIST;
          response.statusCode = 400;
          res.statusCode = 400;
          return res.json(response);
        }
      }
      let code = Math.floor(1000 + Math.random() * 9000);
     // let code = 1111;
      let tokenInfo = await jwtHelper.JWTSighing(data, TokenExpiryTime);
      data.code = code;
      data.email = EncrytedEmail;
      data.mobile_number = Encryted_mobile_number;
      data.kin_number = Encryted_kin_number;
      // send SMS to customer
       let smsOption = {
         body: "Welcome to Syked your verification code is " + code,
         to: "+27" + mobile_number,
       };
       SmsHelper.sendSMS(smsOption, function (mailResutl) {});
      // check exist record
      let result = await services.checkIdExist(exist_data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result) {
        // update record
        data.id = result.id;
        let update_result = await services.updateVerification(data);
        if (update_result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
      } else {
        // insert record
        let insert_result = await services.insertVerification(data);
        if (insert_result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
      }
      response.message = constants.REGISTRATION_SUCCESS;
      response.statusCode = 200;
      res.statusCode = 200;
      response.token = tokenInfo.token;
      //response.code = code;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: signupController.registration failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * verification
   */
  verification: async (req, res) => {
    let code = req.body.code ? req.body.code : "";
    let used_referral_code = req.body.used_referral
      ? req.body.used_referral
      : null;
    let profile_image = req.body.profile_image ? req.body.profile_image : "";
    let id_proof = req.body.id_proof ? req.body.id_proof : "";
    let web_ip = req.body.web_ip ? req.body.web_ip : "";
    let web_browser = req.body.web_browser ? req.body.web_browser : "";
    let web_version = req.body.web_version ? req.body.web_version : "";
    let stripe_key = req.body.stripe_key ? req.body.stripe_key : "";
    let therapy_type = req.body.therapy_type ? req.body.therapy_type : "";

    let first_name = res.locals.userData.first_name
      ? res.locals.userData.first_name
      : "";
    let last_name = res.locals.userData.last_name
      ? res.locals.userData.last_name
      : "";
    let mobile_number = res.locals.userData.mobile_number;
    let email = res.locals.userData.email.toLowerCase();
    let password = res.locals.userData.password;
    let user_type = res.locals.userData.user_type;
    let device_type = res.locals.userData.device_type;
    let social_key = res.locals.userData.social_key
      ? res.locals.userData.social_key
      : null;
    let social_type = res.locals.userData.social_type
      ? res.locals.userData.social_type
      : null;
    let kin_name = res.locals.userData.kin_name
      ? res.locals.userData.kin_name
      : "";
    let kin_number = res.locals.userData.kin_number
      ? res.locals.userData.kin_number
      : "";
    let device_key = res.locals.userData.device_key
      ? res.locals.userData.device_key
      : null;
    let notification_key = res.locals.userData.notification_key
      ? res.locals.userData.notification_key
      : null;
    let dd = res.locals.userData.dd ? res.locals.userData.dd : null;
    let dod = res.locals.userData.dod ? res.locals.userData.dod : null;
    let group_code = res.locals.userData.group_code
      ? res.locals.userData.group_code
      : null;
    let age = res.locals.userData.age ? res.locals.userData.age : "";
    let Encryted_kin_number = "";
    if (kin_number) {
      Encryted_kin_number = UtilityHelper.encrypted(
        res.locals.userData.kin_number
      );
    }
    let EncrytedEmail = UtilityHelper.encrypted(email);
    let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);
    let reffralCode = "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    const validate_data = {
      code: code,
    };
    // check validation error
    let validator_result = await validators.verification(validate_data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // check exist record
      let exist_data = {
        mobile_number: Encryted_mobile_number,
      };
      let idExistResult = await services.checkExistId(exist_data);
      if (idExistResult === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!idExistResult) {
        response.message = constants.RECORD_NOT_FOUND;
        response.statusCode = 400;
        res.statusCode = 400;
        return res.json(response);
      }
      if (idExistResult.code != code) {
        response.message = constants.WRONG_CODE;
        response.statusCode = 400;
        res.statusCode = 400;
        return res.json(response);
      }
      let regNumber = shortid.generate();
      // check referral code
      let NewreffralCode = null;
      if (first_name) {
        reffralCode = first_name;
        var lenghtOfCode = reffralCode.length;
        if (lenghtOfCode < 6) {
          reffralCode =
            reffralCode + UtilityHelper.randomIntNumber(5 - lenghtOfCode);
        } else {
          reffralCode = reffralCode.slice(0, 5);
        }
        reffralCode = reffralCode.replace(/ /g, "");
        reffralCode = reffralCode.toUpperCase();
        // check exist in database
        referralResult = await services.userReferralExists(reffralCode);
        if (referralResult.length > 0) {
          var i = 0;
          while (i < referralResult.length) {
            let k1 = reffralCode + UtilityHelper.randomIntNumber(2);
            referralResult = await services.userReferralExists(k1);
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
      }
      // signup
      let data = {
        first_name: first_name,
        last_name: last_name,
        email: EncrytedEmail,
        mobile_number: Encryted_mobile_number,
        password: password,
        unic_id: regNumber,
        user_type: user_type,
        social_key: social_key,
        social_type: social_type,
        referral_code: NewreffralCode,
        used_referral_code: used_referral_code,
        kin_name: kin_name,
        kin_number: Encryted_kin_number,
        notification_key: notification_key,
        device_key: device_key,
        device_type: device_type,
        dd: dd,
        dod: dod,
        age: age,
        profile_image: profile_image,
        therapy_type: therapy_type,
        id_proof: id_proof,
        web_ip: web_ip,
        web_browser: web_browser,
        web_version: web_version,
        stripe_key: stripe_key,
        used_group_code: group_code,
      };
      let result = await services.signUp(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      result.email = UtilityHelper.decrypted(result.email);
      result.mobile_number = UtilityHelper.decrypted(result.mobile_number);
      if (result.kin_number) {
        result.kin_number = UtilityHelper.decrypted(result.kin_number);
      }
      // token
      let token_data = {
        id: result.id,
        email: result.email,
        mobile_number: result.mobile_number,
        user_type: result.user_type,
        kin_number: result.kin_number,
        kin_name: result.kin_name,
        referral_code: NewreffralCode,
        used_group_code: group_code,
      };
      let tokenInfo = await jwtHelper.JWTSighing(token_data);
      if (!tokenInfo.status) {
        console.log("--TOKEN ERROR-----------------");
        response.message = constants.SOMETHING_WENT_WRONG;
        response.statusCode = 400;
        res.statusCode = 400;
        return res.json(response);
      }
      // Send mail to customer
      if (process.env.MAIL_SEND.toString() === "true") {
        let templateResult = await services.getUserEmailTemplate(
          result.user_type
        );
        if (templateResult) {
          let CUSTOMERNAME = "Hello";
          if (result.first_name != "") {
            CUSTOMERNAME = "Hi " + result.first_name + " " + result.last_name;
          }
          let LOGO = constants.BASEURL + "public/images/email_logo.png";
          let htmlTemplate = templateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[CUSTOMERNAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO);
          //==========send mail tocustomer from library==============
          let mailOption = {
            subject: templateResult.subject,
            body: htmlTemplate,
            email: result.email,
          };
          EmailHelper.sendEmail(mailOption, function (mailResutl) {
            console.log("email sent");
          });
        }
      }
      //send to admin email
      if (process.env.MAIL_SEND.toString() === "true") {
        let adminTemplateResult = await services.getAdminEmailTemplate();
        if (adminTemplateResult) {
          let FIRST_NAME = result.first_name;
          let LAST_NAME = result.last_name;
          let EMAIL = result.email;
          let MOBILE_NUMBER = result.mobile_number;
          let TYPE = result.user_type;
          let LOGO = constants.BASEURL + "public/images/email_logo.png";
          let htmlTemplate = adminTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[FIRST_NAME]", FIRST_NAME)
            .replace("[LAST_NAME]", LAST_NAME)
            .replace("[LOGO]", LOGO)
            .replace("[EMAIL]", EMAIL)
            .replace("[MOBILE_NUMBER]", MOBILE_NUMBER)
            .replace("[TYPE]", TYPE);
          let adminMailOption = {
            subject: adminTemplateResult.subject,
            body: htmlTemplate,
            email: "info@syked.co.za",
          };
          EmailHelper.sendEmail(adminMailOption, function (mailResutl) {
            console.log("mail sent");
          });
        }
      }
      // Remove temp user
      let remove_temp_user = await services.removeTempUser(idExistResult.id);
      // add ramater to reponse
      data.id = result.id;
      data.last_seen = result.last_seen;
      data.therapy_profile_status = result.therapy_profile_status;
      data.avg_rating = result.avg_rating;
      data.total_rating = result.total_rating;
      data.hpcsa_no = result.hpcsa_no;
      data.country_code = result.country_code;
      data.address = result.address;
      data.city = result.city;
      data.lattitude = result.lattitude;
      data.longitude = result.longitude;
      data.qualification = result.qualification;
      data.years_experience = result.years_experience;
      data.about_me = result.about_me;
      data.token = tokenInfo.token;
      // remove ramater to reponse
      delete data.password;
      delete data.social_key;
      delete data.social_type;
      // send response with 200 statusCode
      response.message = constants.MOBILE_VERIFY_SUCCESS;
      response.result = data;
      response.statusCode = 200;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: signupController.verification failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * resend otp
   */
  resendOtp: async (req, res) => {
    let mobile_number = res.locals.userData.mobile_number;
    let email = res.locals.userData.email;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let EncrytedEmail = UtilityHelper.encrypted(email);
      let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);
      //let code = Math.floor(1000 + Math.random() * 9000);
      let code = 1111;
      let exist_data = {
        email: EncrytedEmail,
        mobile_number: Encryted_mobile_number,
      };
      // check exist record
      let result = await services.checkIdExist(exist_data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        response.statusCode = 400;
        res.statusCode = 400;
        return res.json(response);
      }
      let data = {
        id: result.id,
        code: code,
      };
      let update_result = await services.updateResendOtpCode(data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // send SMS to customer
       let smsOption = {
         body: "Welcome to Syked your verification code is " + code,
         to: "+27" + mobile_number,
       };
       SmsHelper.sendSMS(smsOption, function (mailResutl) {});
      response.message = constants.RESEND_OTP_SUCCESS;
      res.statusCode = 200;
      //response.code = code;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: signupController.resend otp failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * disclaimer
   */
  disclaimer: async (req, res) => {
    let agree = req.body.agree ? req.body.agree : "";
    let user_id = res.locals.userData.id;
    let user_type = res.locals.userData.user_type;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    const data = {
      agree,
      user_id,
    };
    // check validation error
    let validator_result = await validators.disclaimer(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // Remove temp user
      let result = await services.disclaimer(data);
      response.message = "";
      response.user_type = user_type;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: signupController.disclaimer failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * disclaimer content
   */
  disclaimerContent: async (req, res) => {
    let response = {
      result: {},
    };
    try {
      response.result.content =
        "<h2>Syked Disclaimer:</h2><p>Syked is an online counseling platform, conditions of use are stipulated below and need to be read by all users. All services that are rendered on the Syked platform are purely for counseling  support and do not include psycho-legal work.</p><br><br><h3>CONFIDENTIALITY OF INFORMATION:</h3><p>1. All information (video, call or text) that is shared on the Syked platform remains confidential unless there is a need of counseling value or if the limitations to confidentiality have been broken.<br>2. In an effort to preserve confidentiality on the platform, there is no recording feature of sessions on the Syked platform.<br>3. Syked text communication which is a secondary feature, is kept on the Syked platform and is only accessible to the therapist and the client linked to that particular session, both of whom would have such access by utilizing their login credentials.<br>4. Syked therapists are contracted to maintain client records in line with their specific scope of practice ethical guidelines.<br>5. Syked is hosted on AWS cloud platform which means that the security measures against hacking are of international standards.</p><br><h3>IDENTITY VERIFICATION:</h3><p>1. Syked is a video led platform and thus requires that potential clients have video enabled handsets or laptops.<br>2. All Syked therapists’ qualifications have been verified. On their profiles, they will have picture of themselves, profession and profession registration number so as to enable the user to know the identity of their therapist. The video facility also ensures that from the first session the therapist also knows the identity of the client.</p><br><h3>EMERGENCY SITUATION, DUTY TO WARN</h3><p>1. Upon registration all clients are expected to provide a contact number of a next of kin that will be used in case of an emergency that may arise during the course of the session, these emergency circumstances can include but are not limited to the following:<br> 1.1. if a client informs the therapist of their intention to cause harm to themselves, kill themselves or cause same to another person. <br> 1.2. if a client informs the therapist of their involvement or possible involvement in the commission of a crime.<br> 2. Patients are oriented to this emergency situation at the beginning of their first session wherein they will be advised that the circumstances contained in 1.1-1.2 of this section constitute limitations to confidentiality. If a patient is assessed to be a high risk for harm to self or to others/ things, the limitations to confidentiality can be observed. <br>1. If a client discloses any information that makes the therapist believe that they could cause harm to themselves or another person or commit a crime, the concerned therapist can exercise their discretion by informing a third party and facilitate the appropriate referral to another service provider or health facility. Therapists will make all reasonable efforts to intervene therapeutically in a client’s situation before breaking the confidentiality.<br>3. Clients are required to complete a short screening tool before booking their session. This screening tool is not a standardized psychological test but a Syked internal tool for purposes of streamlining referrals and aiding in the counseling intervention.</p><br><h3>TERMS OF USE:</h3><p>The information contained in this website is for private information purposes only. We will endeavor to keep all information provided by/to the client and the therapist private, up to-date, and correct but we make no representations or warranties of any kind , express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website, information, products, services, or related graphics contained on the website. Any reliance you make on the aforementioned is, therefore, strictly at your own risk In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website. <br> Every effort is made to keep the website up and functioning. We do not take, however, any responsibility for the website being unavailable due to technical issues.</p><br><h3>FEES:<h3><p>1. Costs of sessions differ according to the different professional categories and are reflected on each therapist’s details<br> 2. Payments are to be made via debit/ credit card on the system which uses the latest security technology to ensure the highest level of security.<br> 3. If the client is unable to participate in a booked session, a cancellation needs to be done 24 hours in advance on the platform.</p><br> <h3>INFORMED CONSENT:</h3><p>1. Acceptance of the disclaimer is interpreted as the user’s informed consent of the services and its conditions as stipulated above.<br> 2. Use of platform for online therapeutic support is voluntary.<br>3. Users have a right to withdraw their participation and should they do so, they are requested to inform their concerned therapist accordingly. If a user deems it necessary that they be referred to a different practitioner, they can request for a referral letter from the Syked therapist.<br>4. In the case of a referral to an external service provider becoming a necessity, the client’s permission will be sought and if refused the patient will be advised of the associated risks in this regard.<br>5. Therapists will maintain brief records of their sessions and contact in a secure place.</p><br> <p>I have read and am fully competent to understand the contents of this disclaimer and consent to receiving the necessary counseling support.</p>";
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: signupController.disclaimer failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = signUpController;
