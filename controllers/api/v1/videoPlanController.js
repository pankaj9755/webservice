const constants = require("./../../../config/constants");
const validators = require("./../../../validators/users/videoPlan");
const services = require("./../../../services/users/videoPlan");
const loginServices = require("./../../../services/users/login");
var jwtAuth = require("./../../../libraries/jwtHelper");
const logger = require("./../../../config/winstonConfig");
const jwtHelper = require("./../../../libraries/jwtHelper");
require("dotenv").config();
var EmailHelper = require("./../../../libraries/EmailHelper")();
var moment = require("moment");

const videoPlanController = {
  /**
   * get all plan
   */
  planList: async (req, res) => {
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let result = await services.getAllPlan();
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      response.result = result;
      response.message = constants.VIDEO_PLAN;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: video plan get failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * check plan
   */
  checkPlan: async (req, res) => {
    let id = req.body.id ? req.body.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
      id,
    };
    // check validation error
    let validator_result = await validators.checkPlan(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.checkPlan(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.PLAN_NOT_FOUND;
        response.result = [];
        res.statusCode = 400;
        return res.json(response);
      }
      if (parseInt(result.seconds) <= parseInt(result.used_seconds)) {
        response.message = constants.PLAN_EXPIRED;
        response.statusCode = 200;
        response.result = [];
        res.statusCode = 200;
        return res.json(response);
      } else {
        let token_data = {
          id: result.id,
          seconds: result.seconds,
          used_seconds: result.used_seconds,
          request_id: result.request_id,
          token_date: new Date(),
          roomId: result.request_id,
          roomUniqueId:
            moment().utc().format("YYYYMMDDHHMMSS") + "-" + result.id,
          email: "deepak@idealittechno.com",
        };
        let tokenInfo = await jwtHelper.JWTSighing(token_data);
        if (!tokenInfo.status) {
          response.statusCode = 400;
          response.message = constants.SOMETHING_WENT_WRONG;
          res.statusCode = 400;
          return res.json(response);
        }
        result.roomUniqueId =
          moment().utc().format("YYYYMMDDHHMMSS") + "-" + result.id;
        response.video_token = tokenInfo.token;
        response.message = "Plan found";
        response.result = result;
        res.statusCode = 200;
        return res.json(response);
      }
    } catch (err) {
      logger.log("error", "try-catch: check plan failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * update plan
   */
  updatePlan: async (req, res) => {
    let plan_id = req.body.plan_id ? req.body.plan_id : "";
    let used_seconds = req.body.used_seconds ? req.body.used_seconds : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      plan_id,
      used_seconds,
      user_id,
    };
    // check validation error
    let validator_result = await validators.updatePlan(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.checkExistPlan(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let after_used_sec =
        parseInt(result.used_seconds) + parseInt(used_seconds);
      data.used_seconds = after_used_sec;
      let update_result = await services.updatePlan(data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.PLAN_UPDATE_SUCCESSFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: video plan update failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * video call alert
   */
  videoCallAlert: async (req, res) => {
    let request_id = req.body.request_id ? req.body.request_id : "";
    let timezone = req.query.timezone ? req.query.timezone : "Africa/Lusaka"; // Asia/Kolkata
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var timeoffset = moment().tz(timezone);
    let data = {
      request_id,
      timeoffset,
      user_id,
    };
    // check validation error
    let validator_result = await validators.videoCallAlert(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    var adminEmail = [];
    try {
      let requestsData = await services.findOneRequest(data);
      if (requestsData === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!requestsData) {
        response.message = constants.ALERT_ADMIN_FAIL;
        res.statusCode = 400;
        return res.json(response);
      }
      if (user_id != requestsData.therapist_id) {
        response.message = constants.NOT_PERMISSION_TO_ACTION;
        res.statusCode = 400;
        return res.json(response);
      }
      // Send mail to therapist
      if (process.env.MAIL_SEND.toString() === "true") {
        let email_data = {
          id: 13,
        };
        let therapistTemplateResult = await loginServices.getEmailTemplate(
          email_data
        );
        if (therapistTemplateResult === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        if (therapistTemplateResult) {
          let THERAPISTNAME = requestsData.therapist_first_name;
          let CUSTOMERNAME = requestsData.customer_first_name;
          let REQUESTNUMBER = requestsData.request_number;
          let LOGO = constants.BASEURL + "public/images/email_logo.png";
          let APPOINTMENTDATE = moment(requestsData.apointment_date_time)
            .utcOffset(Number(timeoffset._offset))
            .format("DD MMM YYYY hh:mm A");
          let THARAPYTYPE = "";
          if (requestsData.therapy_type == "online_therapy") {
            THARAPYTYPE = "Online Therapy";
          } else if (requestsData.therapy_type == "teen_counseling") {
            THARAPYTYPE = "Teen Counseling";
          } else if (requestsData.therapy_type == "marriage_counseling") {
            THARAPYTYPE = "Marriage Counseling";
          } else if (requestsData.therapy_type == "social_worker") {
            THARAPYTYPE = "Social Worker";
          } else if (requestsData.therapy_type == "registered_councillor") {
            THARAPYTYPE = "Registered Counsellor";
          } else if (requestsData.therapy_type == "counselling_psychologist") {
            THARAPYTYPE = "Counseling Psychologist";
          } else if (requestsData.therapy_type == "clinical_psychologist") {
            THARAPYTYPE = "Clinical Psychologist";
          }
          let therapistHtmlTemplate = therapistTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[THERAPIST_NAME]", THERAPISTNAME)
            .replace("[CUSTOMER_NAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[REQUEST_NUMBER]", REQUESTNUMBER)
            .replace("[THARAPY_TYPE]", THARAPYTYPE)
            .replace("[APPOINTMENT_DATE]", APPOINTMENTDATE);
          adminEmail.push("wandile@syked.co.za");
          adminEmail.push("info@syked.co.za");
          //==========send mail to therapist from library==============
          therapistMailOption = {
            subject: therapistTemplateResult.subject,
            body: therapistHtmlTemplate,
            //email:"krishna@idealittechno.com",
            email: adminEmail,
          };
          EmailHelper.sendEmail(therapistMailOption, function (mailResutl) {});
        }
      }
      response.message = constants.ALERT_ADMIN_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: video plan update failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * video aggrement action
   */
  videoAgreementAction: async (req, res) => {
    let request_id = req.body.request_id ? req.body.request_id : "";
    let timezone = req.query.timezone ? req.query.timezone : "Africa/Lusaka";  // Asia/Kolkata
    let action = req.body.action ? req.body.action : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var timeoffset = moment().tz(timezone);
    let data = {
      request_id,
      timeoffset,
      action,
      user_id,
    };
    // check validation error
    let validator_result = await validators.videoAgreementAction(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let requestsData = await services.findOneRequest(data);
      if (requestsData === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!requestsData) {
        response.message = constants.ALERT_ADMIN_FAIL;
        res.statusCode = 400;
        return res.json(response);
      }
      console.log(requestsData.therapist_id);
      if (user_id != requestsData.therapist_id) {
        response.message = constants.NOT_PERMISSION_TO_ACTION;
        res.statusCode = 400;
        return res.json(response);
      }
      // Send mail to therapist
      if (process.env.MAIL_SEND.toString() === "true") {
        let email_data = {
          id: 14,
        };
        let therapistTemplateResult = await loginServices.getEmailTemplate(
          email_data
        );
        if (therapistTemplateResult === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        if (therapistTemplateResult) {
          let THERAPISTNAME = requestsData.therapist_first_name;
          let CUSTOMERNAME = requestsData.customer_first_name;
          let ACTION = action;
          let ACTIONED = "";
          if (ACTION == "accept") {
            ACTIONED = "accepted";
          } else {
            ACTIONED = "declined";
          }
          let REQUESTNUMBER = requestsData.request_number;
          let LOGO = constants.BASEURL + "public/images/email_logo.png";
          let APPOINTMENTDATE = moment(requestsData.apointment_date_time)
            .utcOffset(Number(timeoffset._offset))
            .format("DD MMM YYYY hh:mm A");
          let THARAPYTYPE = "";
          if (requestsData.therapy_type == "online_therapy") {
            THARAPYTYPE = "Online Therapy";
          } else if (requestsData.therapy_type == "teen_counseling") {
            THARAPYTYPE = "Teen Counseling";
          } else if (requestsData.therapy_type == "marriage_counseling") {
            THARAPYTYPE = "Marriage Counseling";
          } else if (requestsData.therapy_type == "social_worker") {
            THARAPYTYPE = "Social Worker";
          } else if (requestsData.therapy_type == "registered_councillor") {
            THARAPYTYPE = "Registered Counsellor";
          } else if (requestsData.therapy_type == "counselling_psychologist") {
            THARAPYTYPE = "Counseling Psychologist";
          } else if (requestsData.therapy_type == "clinical_psychologist") {
            THARAPYTYPE = "Clinical Psychologist";
          }
          var therapistHtmlTemplate = therapistTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[ACTIONED]", ACTIONED)
            .replace("[ACTION]", ACTION)
            .replace("[THERAPIST_NAME]", THERAPISTNAME)
            .replace("[CUSTOMER_NAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[REQUEST_NUMBER]", REQUESTNUMBER)
            .replace("[THARAPY_TYPE]", THARAPYTYPE)
            .replace("[APPOINTMENT_DATE]", APPOINTMENTDATE)
            .replace("[PATIENT_NAME]", CUSTOMERNAME);
          adminEmail.push("wandile@syked.co.za");
          adminEmail.push("info@syked.co.za");
          var subject = therapistTemplateResult.subject
            .replace(/[\s]/gi, " ")
            .replace("[ACTION]", ACTIONED);
          //==========send mail to therapist from library==============
          therapistMailOption = {
            subject: subject,
            body: therapistHtmlTemplate,
            //email:"krishna@idealittechno.com",
            email: adminEmail,
          };
          EmailHelper.sendEmail(therapistMailOption, function (mailResutl) {});
        }
      }
      response.message = constants.ALERT_ADMIN_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: video plan update failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * update lat lon to customer
   */
  updateLatLong: async (req, res) => {
    let lattitude = req.body.lattitude ? req.body.lattitude : "";
    let longitude = req.body.longitude ? req.body.longitude : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      lattitude,
      longitude,
      user_id,
    };
    // check validation error
    let validator_result = await validators.updateLatLong(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.updateLatLong(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.LAT_LAONG_UPDATE_SUCCESSFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: lat long update failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * vive video setting data
   */
  liveVideoSetting: async (req, res) => {
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let result = await services.getLiveVideoSettingData();
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      if(result.is_live==0){
		result.stream_id = "";
		result.url = "";
		result.id = 0;
	  }
      response.result = result;
      response.message = "Live video setting info.";
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: live video setting info failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * video token info
   */
  videoTokenInfo: async (req, res) => {
    let video_token = req.body.video_token ? req.body.video_token : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
      video_token,
    };
    // check validation error
    let validator_result = await validators.videoTokenInfo(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get token
      const jwtData = await jwtAuth.JWTVerify(video_token);
      if (jwtData.status === false) {
        res.statusCode = 400;
        response.message = "Invalid token";
        response.status = 401;
        return res.send(response);
      }
      console.log(jwtData.verify);
      response.message = "Video token info";
      //res.locals.userData = decoded;
      response.result = jwtData.verify;
      // response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: check plan failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
module.exports = videoPlanController;
