const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/therapist/request");
const services = require("./../../../../services/users/therapist/request");
const customerRequestServices = require("./../../../../services/users/customer/request");
const loginServices = require("./../../../../services/users/login");
const notificationServices = require("./../../../../services/users/notification");
const logger = require("./../../../../config/winstonConfig");
var UtilityHelper = require("./../../../../libraries/UtilityHelper")();
var NotificationHelper = require("./../../../../libraries/NotificationHelper")();
var SocketHelper = require("./../../../../libraries/SocketHelper")();
var EmailHelper = require("./../../../../libraries/EmailHelper")();
var moment = require("moment");
require("dotenv").config();

const requestController = {
  /**
   * request list
   */
  list: async (req, res) => {
    let user_id = res.locals.userData.id;
    let order = "apointment_date_time";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      const data = {
        user_id,
        order,
        direction,
      };
      // get all contents form database query
      let result = await services.findAll(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * request detail
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    // check validation error
    let validator_result = await validators.detail(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let result = await services.findOne(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      var validJson = UtilityHelper.IsJsonString(result.question_answer);
      if (validJson) {
        result.question_answer = JSON.parse(result.question_answer);
      } else {
        result.question_answer = [];
      }
      //result.apointment_date_time = moment(result.apointment_date_time,).utcOffset(120).format("YYYY-MM-DDTHH:mm:00.000[Z]");
      if (result.users_master.mobile_number) {
        result.users_master.mobile_number = UtilityHelper.decrypted(
          result.users_master.mobile_number
        );
        result.users_master.mobile_number =
          "+" +
          result.users_master.country_code +
          result.users_master.mobile_number;
      }
      if (result.users_master.kin_number) {
        result.users_master.kin_number = UtilityHelper.decrypted(
          result.users_master.kin_number
        );
      }
      // check user video plan
      var plan_data = {
        user_id: user_id,
        request_number: result.request_number,
      };
      let user_video_plan_result = await services.getUserVideoPlan(plan_data);
      if (user_video_plan_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      result.user_video_plan = user_video_plan_result;
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * request month list
   */
  monthList: async (req, res) => {
    let month = req.query.month ? req.query.month : "";
    let year = req.query.year ? req.query.year : "";
    let timezone = req.query.timezone ? req.query.timezone : "";
    let user_id = res.locals.userData.id;
    let monthRequest = [];
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      month,
      year,
      timezone,
      user_id,
    };
    // check validation error
    let validator_result = await validators.monthList(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let result = await services.findMonthRequest(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (var j = 0; j < result.length; j++) {
        (function (j) {
          bgcolor = "#bac866";
          textColor = "#fff";
          if (result[j].status == "cancel") {
            bgcolor = "#FF0000";
          }
          if (result[j].status == "pending" || result[j].status == "draft") {
            bgcolor = "#ffbf25";
          }
          if (result[j].status == "wip") {
            bgcolor = "#2c3db7";
          }
          if (result[j].users_master) {
            if (result[j].users_master.first_name != "") {
              var firstName =
                result[j].users_master.first_name.charAt(0).toUpperCase() +
                result[j].users_master.first_name.slice(1);
              // var lastName =
              //   result[j].last_name.charAt(0).toUpperCase() +
              //   result[j].last_name.slice(1);
              //var userName = firstName + " " + lastName;
              var userName = firstName;
            } else {
              var userName = "";
            }
            title =
              userName +
              " " +
              moment(result[j].apointment_date_time).format("hh:mm A");
            if (data.timezone != "") {
              title =
                userName +
                " " +
                moment(result[j].apointment_date_time)
                  .tz(data.timezone)
                  .format("hh:mm A");
            }
            var dateTimeJson = {
              available: "",
              title: title,
              start: moment(result[j].apointment_date_time).format(
                "YYYY-MM-DD hh:mm"
              ),
              end: moment(result[j].apointment_date_time).format(
                "YYYY-MM-DD hh:mm:59"
              ),
              className: ["my-book-bg-", "cursor-pointer"],
              backgroundColor: bgcolor,
              borderColor: bgcolor,
              textColor: textColor,
              name: userName,
              request_number: result[j].request_number,
              about_me: result[j].users_master.about_me,
              therapy_type: result[j].therapy_type,
              price: result[j].price,
              discount_promo_code: result[j].discount_promo_code,
              request_id: result[j].id,
              apointment_date: result[j].apointment_date_time,
              profile_image: result[j].users_master.profile_image,
              status: result[j].status,
            };
            var finalJson = JSON.stringify(dateTimeJson);
            finalJson = JSON.parse(finalJson);
            monthRequest.push(finalJson); //First json push
          }
        })(j);
      }
      delete response.message;
      response.result = monthRequest;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.request month list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * delete request
   */
  delete: async (req, res) => {
    let id = "";
    if (req.params.id) {
      id = req.params.id;
    }
    if (req.body.id) {
      id = req.body.id;
    }
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    //check validation
    let validator_data = await validators.delete(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await services.checkExistId(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let delete_result = await services.deleteRequest(data);
      if (delete_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.REQUEST_DELETE_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.delete request query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * update status
   */
  updateStatus: async (req, res) => {
    let id = req.body.request_id ? req.body.request_id : "";
    let status = req.body.status ? req.body.status : "";
    let timezone = req.body.timezone ? req.body.timezone : "Africa/Lusaka";
    let user_id = res.locals.userData.id;
    let therapist_name =
      res.locals.userData.first_name + " " + res.locals.userData.last_name;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var notificationData = {};
    var webIds = [];
    var timeoffset = moment().tz(timezone);
    if (status == "confirm") {
      status = "wip";
    }
    let data = {
      id,
      status,
      user_id,
      timeoffset,
    };
    // check validation error
    let validator_result = await validators.updateStatus(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.findOne(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let therapistInfo = await services.getTherapistInfo(user_id);
      if (therapistInfo === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!therapistInfo) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      var type = "customer_job_detail";
      var title = "";
      var message = "";
      var template_id = "";
      if (status == "cancel") {
        title = constants.REQUEST_CANCEL_TITLE;
        message = constants.REQUEST_CANCEL_MESSAGE;
        response.message = constants.CANCEL_SUCCESS;
        template_id = "6";
      }
      if (status == "wip") {
        title = constants.REQUEST_CONFIRM_TITLE;
        message = constants.REQUEST_CONFIRM_MESSAGE;
        response.message = constants.ACCEPTED_SUCCESS;
        template_id = "4";
      }
      if (status == "completed") {
        type = "customer_complete_job_detail";
        title = constants.REQUEST_COMPLETE_TITLE;
        message = constants.REQUEST_COMPLETE_MESSAGE;
        response.message = constants.COMPLETED_SUCCESS;
        template_id = "5";
      }
      message = message.replace(
        "[THERAPIST_NAME]",
        therapistInfo.first_name + " " + therapistInfo.last_name
      );
      let update_result = await services.updateStatus(data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // send notificatioion
      if (result.users_master.device_type != "web") {
        webIds.push(result.users_master.notification_key);
        notificationData.id = result.id;
        notificationData.title = title;
        notificationData.message = message;
        notificationData.status = result.status;
        notificationData.type = type;
        notificationData.device_type = result.users_master.device_type;
        notificationData.user_id = therapistInfo.id;
        notificationData.first_name = therapistInfo.first_name;
        notificationData.last_name = therapistInfo.last_name;
        notificationData.profile_image = therapistInfo.profile_image;
        notificationData.click_action =
          constants.BASE_PATH + "my-account/request-detail/:" + id;
        NotificationHelper.mutipleNotification(
          webIds,
          notificationData,
          function (notificationResponse) {}
        );
      }
      // send socket
      if (result.users_master.device_type == "web") {
        var socketOption = {
          type: type,
          show_message: message,
          id: id,
          is_success: "yes",
          is_admin_inform: "yes",
          user_id: result.customer_id,
          sender_type: "therapist",
        };
        SocketHelper.userInform(socketOption, function (info) {});
      }
      // insert notification
      let notification_data = {
        user_id: result.customer_id,
        request_id: id,
        type: type,
        title: title,
        message: message,
      };
      let notification_result = await notificationServices.insertNotification(
        notification_data
      );
      // send mail
      if (status == "wip") {
        if (process.env.MAIL_SEND.toString() === "true") {
          let email_data = {
            id: 15,
          };
          let therapistTemplateResult = await loginServices.getEmailTemplate(
            email_data
          );
          if (therapistTemplateResult) {
            var CUSTOMERNAME = result.users_master.first_name;
            var THERAPISTNAME =
              therapistInfo.first_name + " " + therapistInfo.last_name;
            var APPOINTMENTDATE = moment(result.apointment_date_time)
              .utcOffset(Number(timeoffset._offset))
              .format("DD MMM YYYY");
            var APPOINTMENTTIME = moment(result.apointment_date_time)
              .utcOffset(Number(timeoffset._offset)).format("hh:mm A");
            var REQUESTNUMBER = result.request_number;
            var LOGO = constants.BASEURL + "public/images/email_logo.png";
            var customerEmail = UtilityHelper.decrypted(
              result.users_master.email
            );
            if (result.therapy_type == "online_therapy") {
              var THARAPYTYPE = "Online Therapy";
            } else if (result.therapy_type == "teen_counseling") {
              var THARAPYTYPE = "Teen Counseling";
            } else if (result.therapy_type == "marriage_counseling") {
              var THARAPYTYPE = "Marriage Counseling";
            } else if (result.therapy_type == "social_worker") {
              var THARAPYTYPE = "Social Worker";
            } else if (result.therapy_type == "registered_councillor") {
              var THARAPYTYPE = "Registered Counsellor";
            } else if (result.therapy_type == "counselling_psychologist") {
              var THARAPYTYPE = "Counseling Psychologist";
            } else if (result.therapy_type == "clinical_psychologist") {
              var THARAPYTYPE = "Clinical Psychologist";
            }
            var therapistHtmlTemplate = therapistTemplateResult.body
              .replace(/[\s]/gi, " ")
              .replace("[THERAPISTNAME]", THERAPISTNAME)
              .replace("[CUSTOMERNAME]", CUSTOMERNAME)
              .replace("[LOGO]", LOGO)
              .replace("[REQUESTNUMBER]", REQUESTNUMBER)
              .replace("[THARAPYTYPE]", THARAPYTYPE)
              .replace("[APPOINTMENTDATE]", APPOINTMENTDATE)
              .replace("[APPOINTMENTTIME]", APPOINTMENTTIME)
              .replace("[APPOINTMENTDATE]", APPOINTMENTDATE)
              .replace("[APPOINTMENTTIME]", APPOINTMENTTIME);
            //==========send mail to therapist from library==============
            therapistMailOption = {
              subject: therapistTemplateResult.subject,
              body: therapistHtmlTemplate,
              //email:"ajay@idealittechno.com",
              email: customerEmail,
            };
            EmailHelper.sendEmail(therapistMailOption, function (
              mailResutl
            ) {});
          }
        }
      }
      // response.message = constants.ORDER_UPDATED_SUCCESSFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.update status request query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * dublicate booking request
   */
  duplicateBooking: async (req, res) => {
    let id = req.body.id ? req.body.id : "";
    let schedule_date = req.body.schedule_date ? req.body.schedule_date : "";
    let timezone = req.body.timezone ? req.body.timezone : "Africa/Lusaka";
    
    let user_id = res.locals.userData.id;
    var notificationData = {};
    var webIds = [];
    var timeoffset = moment().tz(timezone);
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let request_type = "completed";
    let data = {
      id,
      user_id,
      schedule_date,
      request_type,
    };
    //check validation
    let validator_data = await validators.duplicateRequest(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await services.findOne(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let date = moment().format("YYYY-MM-DD");
      let lastOrderInfo = await customerRequestServices.checkLastOrderCount(
        date
      );
      console.log('timezone==============',timezone);
      console.log('schedule_date==============',schedule_date);
      let request_number = lastOrderInfo + 100;
      request_number = moment().format("YYYYMMDD") + "" + request_number + "";
      var schedule_date_UTC = moment.tz(schedule_date,timezone).utc().format("YYYY-MM-DD HH:mm:00");
      // make create data
      var therapyprice = constants.DEFAULT_PRICE;
      if (result.therapy_type == "social_worker") {
            
           therapyprice = constants.SOCIAL_WORKER;
          } else if (result.therapy_type == "registered_councillor") {
            
            therapyprice = constants.REGISTERED_COUNCILLOR;
          } else if (result.therapy_type == "counselling_psychologist") {
            
            therapyprice = constants.COUNSELLING_PSYCHOLOGIST;
          } else if (result.therapy_type == "clinical_psychologist") {
            
            therapyprice = constants.CLINICAL_PSYCHOLOGIST;
          } else {
           
            therapyprice = constants.DEFAULT_PRICE;
          }
      
      
      let request_data = {
        request_number: request_number,
        therapist_id: result.therapist_id,
        customer_id: result.customer_id,
        therapy_type: result.therapy_type,
        status: "pending",
        payment_status: "pending",
        apointment_date_time: schedule_date_UTC,
        question_answer: result.question_answer,
        price: therapyprice,
       // promo_code: result.promo_code,
        //discount_promo_code: result.discount_promo_code,
        //referral_code: result.referral_code,
        //referral_code_amount: result.referral_code_amount,
        therapist_paid: "pending",
        request_delete: "no",
        request_therapist_delete: "no",
        score: result.score,
        created_by: "therapist",
      };
      // create duplicate request
      let insert_result = await customerRequestServices.insertRequest(
        request_data
      );
      if (insert_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      let plan_data = {
        plan_id: 1,
        amount: 250,
        user_id: result.customer_id,
        seconds: 3600,
        invoice_id: request_number,
      };
      // add plan
      let insert_plan_result = await customerRequestServices.insertPlan(plan_data);
      if (insert_plan_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      var title = constants.BOOKING_TITLE;
      var message = constants.BOOKING_MESSAGE;
      // send notification
      if (result.users_master.device_type != "web") {
        webIds.push(result.users_master.notification_key);
        notificationData.id = insert_result.id;
        notificationData.title = title;
        notificationData.message = message;
        notificationData.status = "pending";
        notificationData.type = "therapist_job_detail";
        notificationData.device_type = result.users_master.device_type;
        notificationData.click_action =
          constants.BASE_PATH +
          "my-account/therapist-request-detail/" +
          insert_result.id;
        NotificationHelper.mutipleNotification(
          webIds,
          notificationData,
          function (notificationResponse) {
            console.log("Web Notification Response: ", notificationResponse);
          }
        );
      }
      // send socket
      if (result.users_master.device_type == "web") {
        var socketOption = {
          type: "therapist_job_detail",
          show_message: message,
          id: insert_result.id,
          is_success: "yes",
          is_admin_inform: "yes",
          user_id: result.customer_id,
          sender_type: "therpapist",
        };
        SocketHelper.userInform(socketOption, function (info) {});
      }
      // insert notifiction
      let notification_data = {
        user_id: result.customer_id,
        request_id: insert_result.id,
        type: "therapist_job_detail",
        title: title,
        message: message,
      };
      let insertNotification = await notificationServices.insertNotification(
        notification_data
      );
      // send reposne
      response.statusCode = 200;
      response.result = { order_number: request_number,request_id: insert_result.id };
      response.message = constants.ORDER_CREATED_SUCESSFULL;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.duplicate request query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};

// export module to use it on other files
module.exports = requestController;
