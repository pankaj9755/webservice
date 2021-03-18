const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/request");
const services = require("./../../../../services/users/customer/request");
const loginServices = require("./../../../../services/users/login");
const notificationServices = require("./../../../../services/users/notification");
const logger = require("./../../../../config/winstonConfig");
var UtilityHelper = require("./../../../../libraries/UtilityHelper")();
var NotificationHelper = require("./../../../../libraries/NotificationHelper")();
var SocketHelper = require("./../../../../libraries/SocketHelper")();
var EmailHelper = require("./../../../../libraries/EmailHelper")();
require("dotenv").config();
var moment = require("moment");

const requestController = {
  /**
   * request create
   */
  create: async (req, res) => {
    let therapist_id = req.body.therapist_id ? req.body.therapist_id : "";
    let category = req.body.category ? req.body.category : "general_public";
    let schedule_date = req.body.schedule_date ? req.body.schedule_date : "";
    let therapy_type = req.body.therapy_type
      ? req.body.therapy_type.trim().toLowerCase()
      : "";
    let timeoffset = req.body.timeoffset ? req.body.timeoffset : 120;
    let timezone = req.body.timezone ? req.body.timezone : "Asia/Kolkata";
    let question_answer = req.body.question_answer
      ? req.body.question_answer
      : "";
    let price = req.body.price ? req.body.price.trim() : "";
    let promo_code = req.body.promo_code ? req.body.promo_code.trim() : "";
    let total_amount = req.body.total_amount
      ? req.body.total_amount.trim()
      : "";
    let discount_promo_code = req.body.discount_promo_code
      ? req.body.discount_promo_code.trim()
      : "";
    let group_code_applied = req.body.group_code_applied
      ? req.body.group_code_applied
      : "";
    let status = req.body.status ? req.body.status : "draft";
    let payment_status = req.body.payment_status
      ? req.body.payment_status.trim()
      : "pending";
    let referral_discount_amount = req.body.referral_discount_amount
      ? req.body.referral_discount_amount
      : 0;
    let referral_code = req.body.referral_code ? req.body.referral_code : "";
    let is_my_code = req.body.is_my_code ? req.body.is_my_code : "";
    let user_id = res.locals.userData.id;
    let user_group_code = res.locals.userData.used_group_code;
    let is_redirect = "yes";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var THARAPYTYPE = "";
    if (therapy_type === "social worker") {
      therapy_type = "social_worker";
      THARAPYTYPE = "Social Worker";
    } else if (therapy_type === "registered councillor") {
      therapy_type = "registered_councillor";
      THARAPYTYPE = "Registered Councillor";
    } else if (therapy_type === "counselling psychologist") {
      therapy_type = "counselling_psychologist";
      THARAPYTYPE = "Counselling Psychologist";
    } else if (therapy_type === "clinical psychologist") {
      therapy_type = "clinical_psychologist";
      THARAPYTYPE = "Clinical Psychologist";
    } else if (therapy_type === "marriage counseling") {
      therapy_type = "marriage_counseling";
      THARAPYTYPE = "Marriage Counseling";
    } else if (therapy_type === "online therapy") {
      therapy_type = "online_therapy";
      THARAPYTYPE = "Online Therapy";
    } else if (therapy_type === "teen counseling") {
      therapy_type = "teen_counseling";
      THARAPYTYPE = "Teen Counseling";
    } else {
      therapy_type = "social_worker";
      THARAPYTYPE = "Social Worker";
    }
    // question_answer = JSON.stringify(question_answer);
    schedule_date = moment(schedule_date).utc().format("YYYY-MM-DD HH:mm:00");
    let data = {
      therapist_id: therapist_id,
      customer_id: user_id,
      category: category,
      schedule_date: schedule_date,
      therapy_type: therapy_type,
      timeoffset: timeoffset,
      question_answer: question_answer,
      price: price,
      promo_code: promo_code,
      total_amount: total_amount,
      status: status,
      payment_status: payment_status,
      referral_discount_amount: referral_discount_amount,
      referral_code: referral_code,
      is_my_code: is_my_code,
      discount_promo_code: discount_promo_code,
      is_group_code_applied: group_code_applied,
      group_code: user_group_code,
    };
    // check validation error
    let validator_result = await validators.create(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let date = moment().format("YYYY-MM-DD");
      let lastOrderInfo = await services.checkLastOrderCount(date);
      let request_number = lastOrderInfo + 100;
      request_number = moment().format("YYYYMMDD") + "" + request_number + "";
      data.request_number = request_number;
      data.total_amount = total_amount - referral_discount_amount;
      data.apointment_date_time = schedule_date;
      // check promocode
      if (promo_code) {
        var promores = await services.checkPromocode(data);
        if (promores.success == 0) {
          res.statusCode = 500;
          response.message = promores.msg;
          return res.send(response);
        }
        data.discount_promo_code = promores.discount_amount;
        if (price < 0) {
          data.price = 0;
        }
        if (promores.discount_amount == data.total_amount) {
          data.status = "pending";
          data.payment_status = "done";
          is_redirect = "no";
        }
      }
      // check group code
      if (user_group_code) {
        var groupres = await services.checkGroupCode(data);
        if (groupres.success == 1 && groupres.is_group_code_applied == true) {
          data.status = "pending";
          data.payment_status = "done";
          data.group_code = user_group_code;
          is_redirect = "no";
        } else {
          data.group_code = null;
        }
      }
      data.status = "pending";
      // add request
      let insert_request_result = await services.insertRequest(data);
      if (insert_request_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      let plan_data = {
        plan_id: 1,
        amount: 250,
        user_id: user_id,
        seconds: 3600,
        invoice_id: request_number,
      };
      // add plan
      let insert_plan_result = await services.insertPlan(plan_data);
      if (insert_plan_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // check payment status
      var notificationData = {};
      var webIds = [];
      if (data.payment_status == "done") {
        let requestsData = await services.getRequestInfo(request_number);
        if (requestsData === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        var CUSTOMERNAME = res.locals.userData.first_name;
        var newTimeOffSet = moment().tz(timezone);
        var APPOINTMENTDATE = moment(schedule_date)
          .utcOffset(Number(newTimeOffSet._offset))
          .format("DD MMM YYYY hh:mm A");
        var LOGO = constants.BASEURL + "public/images/email_logo.png";
        // send emil to admin on create booking
        if (process.env.MAIL_SEND.toString() === "true") {
          var email_data = {
            id: 9,
          };
          let adminTemplateResult = await loginServices.getEmailTemplate(
            email_data
          );
          if (adminTemplateResult) {
            var CUSTOMERNAME = CUSTOMERNAME;
            var REQUEST_NUMBER = request_number;
            var THARAPY_TYPE = THARAPYTYPE;
            var APPOINTMENT_DATE = APPOINTMENTDATE;
            var htmlTemplate = adminTemplateResult.body
              .replace(/[\s]/gi, " ")
              .replace("[CUSTOMERNAME]", CUSTOMERNAME)
              .replace("[LOGO]", LOGO)
              .replace("[REQUEST_NUMBER]", REQUEST_NUMBER)
              .replace("[THARAPY_TYPE]", THARAPY_TYPE)
              .replace("[APPOINTMENT_DATE]", APPOINTMENT_DATE);
            //==========send mail tocustomer from library==============
            mailOption = {
              subject: adminTemplateResult.subject,
              body: htmlTemplate,
              //email:"krishna@idealittechno.com",
              email: "info@syked.co.za",
            };
            EmailHelper.sendEmail(mailOption, function (mailResutl) {});
          }
        }
        //Send email to therapist on create booking
        if (process.env.MAIL_SEND.toString() === "true") {
          email_data.id = 10;
          let therapistTemplateResult = await loginServices.getEmailTemplate(
            email_data
          );
          if (therapistTemplateResult) {
            var THERAPISTNAME =
              requestsData[0].therapist_first_name +
              " " +
              requestsData[0].therapist_last_name;
            var REQUESTNUMBER = request_number;
            var therapistEmail = UtilityHelper.decrypted(
              requestsData[0].therapist_email
            );
            var therapistHtmlTemplate = therapistTemplateResult.body
              .replace(/[\s]/gi, " ")
              .replace("[THERAPISTNAME]", THERAPISTNAME)
              .replace("[CUSTOMERNAME]", CUSTOMERNAME)
              .replace("[LOGO]", LOGO)
              .replace("[REQUESTNUMBER]", REQUESTNUMBER)
              .replace("[THARAPYTYPE]", THARAPYTYPE)
              .replace("[APPOINTMENTDATE]", APPOINTMENTDATE);
            //==========send mail to therapist from library==============
            let therapistMailOption = {
              subject: therapistTemplateResult.subject,
              body: therapistHtmlTemplate,
              //email:"krishna@idealittechno.com",
              email: therapistEmail,
            };
            EmailHelper.sendEmail(therapistMailOption, function (
              mailResutl
            ) {});
          }
        }
        var booking_title = constants.BOOKING_TITLE;
        var booking_message = constants.BOOKING_MESSAGE;
        // send notification
        if (requestsData[0].therapist_device_type != "web") {
          webIds.push(requestsData[0].therapist_notification_key);
          notificationData.id = requestsData[0].id;
          notificationData.title = booking_title;
          notificationData.message = booking_message;
          notificationData.type = "therapist_job_detail";
          notificationData.device_type = requestsData[0].therapist_device_type;
          notificationData.click_action =
            constants.BASE_PATH +
            "my-account/therapist-request-detail/" +
            requestsData[0].id;
          NotificationHelper.mutipleNotification(
            webIds,
            notificationData,
            function (notificationResponse) {
              console.log("Web Notification Response: ", notificationResponse);
            }
          );
        }
        // send socket
        if (requestsData[0].therapist_device_type == "web") {
          var socketOption = {
            type: "therapist_job_detail",
            show_message: booking_message,
            id: requestsData[0].id,
            is_success: "yes",
            is_admin_inform: "yes",
            user_id: requestsData[0].therapist_id,
            sender_type: "customer",
          };
          SocketHelper.userInform(socketOption, function (info) {});
        }
        // insert notifiction
        let notification_data = {
          user_id: therapist_id,
          request_id: requestsData[0].id,
          type: "therapist_job_detail",
          title: booking_title,
          message: booking_message,
        };
        let insertNotification = await notificationServices.insertNotification(
          notification_data
        );
      }
      let reponse_data = {
        id: insert_request_result.id,
        request_number: request_number,
        cancel_url: constants.PAYFAST_CANCEL_URL + "?id=" + request_number,
        return_url: constants.PAYFAST_RETURN_URL + "?id=" + request_number,
        notify_url: constants.PAYFAST_NOTIFY_URL,
        is_redirect: is_redirect,
      };
      response.statusCode = 200;
      response.result = reponse_data;
      response.message = constants.ORDER_CREATED_SUCESSFULL;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: requestController.create failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * request edit
   */
  edit: async (req, res) => {
    let id = req.body.id ? req.body.id : "";
    let schedule_date = req.body.schedule_date ? req.body.schedule_date : "";
    let timeoffset = req.body.timeoffset ? req.body.timeoffset : 120;
    let timezone = req.body.timezone ? req.body.timezone : "Asia/Kolkata";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var notificationData = {};
    var webIds = [];
    let data = {
      id: id,
      schedule_date: schedule_date,
      timeoffset: timeoffset,
      user_id: user_id,
    };
    // check validation error
    let validator_result = await validators.edit(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let orderInfo = await services.checkExistRecord(data);
      if (orderInfo === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!orderInfo) {
        res.statusCode = 400;
        response.message = constants.NOT_PERMISSION_MESSAGE;
        return res.json(response);
      }
      data.schedule_date = moment(schedule_date)
        .utc()
        .format("YYYY-MM-DD HH:mm:00");
      if (orderInfo.status != "pending") {
        res.statusCode = 200;
        response.message = constants.NOT_UPDATE_MESSAGE;
        return res.json(response);
      }
      let updateResult = await services.updateRequest(data);
      if (updateResult === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // get request info
      var requestsData = await services.findOneRequest(data);
      if (requestsData === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!requestsData) {
        res.statusCode = 400;
        response.message = constants.RECORD_NOT_FOUND;
        return res.json(response);
      }
      //Send email to admin on create booking
      var CUSTOMERNAME = requestsData.customer_first_name;
      var newTimeOffSet = moment().tz(timezone);
      var APPOINTMENTDATE = moment(schedule_date)
        .utcOffset(Number(newTimeOffSet._offset))
        .format("DD MMM YYYY hh:mm A");
      if (orderInfo.therapy_type == "online_therapy") {
        var THARAPYTYPE = "Online Therapy";
      } else if (orderInfo.therapy_type == "teen_counseling") {
        var THARAPYTYPE = "Teen Counseling";
      } else if (orderInfo.therapy_type == "marriage_counseling") {
        var THARAPYTYPE = "Marriage Counseling";
      } else if (orderInfo.therapy_type == "social_worker") {
        var THARAPYTYPE = "Social Worker";
      } else if (orderInfo.therapy_type == "registered_councillor") {
        var THARAPYTYPE = "Registered Counsellor";
      } else if (orderInfo.therapy_type == "counselling_psychologist") {
        var THARAPYTYPE = "Counseling Psychologist";
      } else if (orderInfo.therapy_type == "clinical_psychologist") {
        var THARAPYTYPE = "Clinical Psychologist";
      }
      // send emil to admin
      if (process.env.MAIL_SEND.toString() === "true") {
        var email_data = {
          id: 9,
        };
        let adminTemplateResult = await loginServices.getEmailTemplate(
          email_data
        );
        if (adminTemplateResult) {
          var REQUEST_NUMBER = orderInfo.request_number;
          var THARAPY_TYPE = THARAPYTYPE;
          var APPOINTMENT_DATE = APPOINTMENTDATE;
          var LOGO = constants.BASEURL + "public/images/email_logo.png";
          var htmlTemplate = adminTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[CUSTOMERNAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[REQUEST_NUMBER]", REQUEST_NUMBER)
            .replace("[THARAPY_TYPE]", THARAPY_TYPE)
            .replace("[APPOINTMENT_DATE]", APPOINTMENT_DATE);
          //==========send mail tocustomer from library==============
          mailOption = {
            subject: adminTemplateResult.subject,
            body: htmlTemplate,
            //email:"krishna@idealittechno.com",
            email: "info@syked.co.za",
          };
          EmailHelper.sendEmail(mailOption, function (mailResutl) {});
        }
      }
      // Send email to therapist
      if (process.env.MAIL_SEND.toString() === "true") {
        email_data.id = 11;
        let therapistTemplateResult = await loginServices.getEmailTemplate(
          email_data
        );
        if (therapistTemplateResult) {
          var THERAPISTNAME =
            requestsData.therapist_first_name +
            " " +
            requestsData.therapist_last_name;
          var REQUESTNUMBER = orderInfo.request_number;
          var LOGO = constants.BASEURL + "public/images/email_logo.png";
          var therapistEmail = UtilityHelper.decrypted(
            requestsData.therapist_email
          );
          var therapistHtmlTemplate = therapistTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[THERAPISTNAME]", THERAPISTNAME)
            .replace("[CUSTOMERNAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[REQUESTNUMBER]", REQUESTNUMBER)
            .replace("[THARAPYTYPE]", THARAPYTYPE)
            .replace("[APPOINTMENTDATE]", APPOINTMENTDATE);
          //==========send mail to therapist from library==============
          therapistMailOption = {
            subject: therapistTemplateResult.subject,
            body: therapistHtmlTemplate,
            //email:"krishna@idealittechno.com",
            email: therapistEmail,
          };
          EmailHelper.sendEmail(therapistMailOption, function (mailResutl) {});
        }
      }
      // send notification
      var title = constants.UPDATE_BOOKING_TITLE;
      var message = constants.UPDATE_BOOKING_MESSAGE;
      if (requestsData.therapist_device_type != "web") {
        webIds.push(requestsData.therapist_notification_key);
        notificationData.id = requestsData.id;
        notificationData.title = title;
        notificationData.message = message;
        notificationData.type = "therapist_job_detail";
        notificationData.device_type = requestsData.therapist_device_type;
        notificationData.click_action =
          constants.BASE_PATH +
          "my-account/therapist-request-detail/" +
          requestsData.id;
        NotificationHelper.mutipleNotification(
          webIds,
          notificationData,
          function (notificationResponse) {
            console.log("Web Notification Response: ", notificationResponse);
          }
        );
      }
      if (requestsData.therapist_device_type == "web") {
        var socketOption = {
          type: "therapist_job_detail",
          show_message: message,
          id: requestsData.id,
          is_success: "yes",
          is_admin_inform: "yes",
          user_id: requestsData.therapist_id,
          sender_type: "customer",
        };
        SocketHelper.userInform(socketOption, function (info) {});
      }
      // insert notification
      var notification_data = {
        user_id: requestsData.therapist_id,
        request_id: requestsData.id,
        type: "therapist_job_detail",
        title: title,
        message: message,
      };
      let insertNotification = await notificationServices.insertNotification(
        notification_data
      );
      // send response
      response.statusCode = 200;
      res.statusCode = 200;
      response.result = {
        request_number: orderInfo.request_number,
        id: data.id,
      };
      response.message = constants.ORDER_UPDATED_SUCESSFULL;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.update booking failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

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
      if (result.therapy_type == "social_worker") {
        result.therapy_type = constants.SOCIAL_WORKER_TYPE;
      } else if (result.therapy_type == "registered_councillor") {
        result.therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
      } else if (result.therapy_type == "counselling_psychologist") {
        result.therapy_type = constants.COUNSELLING_PSYCHOLOGIST_TYPE;
      } else if (result.therapy_type == "clinical_psychologist") {
        result.therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
      } else {
        result.therapy_type = constants.DEFAULT_TYPE;
      }
      var validJson = UtilityHelper.IsJsonString(result.question_answer);
      if (validJson) {
        result.question_answer = JSON.parse(result.question_answer);
      } else {
        result.question_answer = [];
      }
      var validJson = UtilityHelper.IsJsonString(
        result.users_master.qualification
      );
      if (validJson) {
        result.users_master.qualification = JSON.parse(
          result.users_master.qualification
        );
      } else {
        result.users_master.qualification = [];
      }
      if (result.users_master) {
        if (result.users_master.mobile_number) {
          result.users_master.mobile_number = UtilityHelper.decrypted(
            result.users_master.mobile_number
          );
        }
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
    let timezone = req.query.timezone ? req.query.timezone : "Asia/Kolkata";
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
          delete result[j].question_answer;
          //result[j].question_answer = JSON.parse(result[j].question_answer);
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
          var userName = "";
          if (result[j].users_master) {
            if (result[j].users_master.first_name != "") {
              var firstName =
                result[j].users_master.first_name.charAt(0).toUpperCase() +
                result[j].users_master.first_name.slice(1);
              // var lastName =
              //   result[j].last_name.charAt(0).toUpperCase() +
              //   result[j].last_name.slice(1);
              //var userName = firstName + " " + lastName;
              userName = firstName;
            } else {
              userName = "";
            }
          }
          title =
            userName +
            " " +
            moment(result[j].apointment_date_time).format("hh:mm A");
          if (timezone != "") {
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
        })(j);
      }
      // add content data to response as result
      delete response.message;
      response.result = monthRequest;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.month request query failed.",
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
   * cancel request
   */
  cancel: async (req, res) => {
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
      let result = await services.findOne(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result && result.status != "pending") {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let delete_result = await services.cancelRequest(data);
      if (delete_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.payment_status == "done") {
        var webIds = [];
        var notificationData = {};
        var type = "therapist_job_detail";
        var title = constants.BOOKING_CANCEL_TITLE;
        var message = constants.BOOKING_CANCEL_MESSAGE;
        message = message.replace(
          "[CUSTOMER_NAME]",
          result.users_master.first_name
        );
        // send notification
        if (result.users_master.device_type != "web") {
          webIds.push(result.users_master.notification_key);
          notificationData.id = result.id;
          notificationData.title = title;
          notificationData.message = message;
          notificationData.type = type;
          notificationData.device_type = result.users_master.device_type;
          notificationData.click_action =
            constants.BASE_PATH + "my-account/therapist-request-detail/" + id;
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
            user_id: result.therapist_id,
            sender_type: "customer",
          };
          SocketHelper.userInform(socketOption, function (info) {});
        }
        // insert notification
        var notification_data = {
          user_id: result.therapist_id,
          request_id: id,
          type: type,
          title: title,
          message: message,
        };
        let insert_notification = await notificationServices.insertNotification(
          notification_data
        );
      }
      response.message = constants.CANCEL_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.cancel request query failed.",
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
    let id = req.body.id ? req.body.id : "";
    let status = req.body.status ? req.body.status : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      status,
      user_id,
    };
    // check validation error
    let validator_result = await validators.updateStatus(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let result = await services.updateStatus(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.ORDER_UPDATED_SUCCESSFUL;
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
   * customer won detail
   */
  customerOwnDetail: async (req, res) => {
    let id = req.query.id ? req.query.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    // check validation error
    let validator_result = await validators.customerOwnDetail(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let result = await services.customerOwnDetail(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: requestController.request own detail failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * accept/reject duplicate request
   */
  acceptRejectDuplicateRequest: async (req, res) => {
    let id = req.body.id ? req.body.id : "";
    let status = req.body.status ? req.body.status : "";
    let timezone = req.body.timezone ? req.body.timezone : "Asia/Kolkata";
    let user_id = res.locals.userData.id;
    let user_group_code = res.locals.userData.used_group_code;
    let is_redirect = "yes";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let webIds = [];
    let notificationData = {};
    let data = {
      id,
      user_id,
      status,
      user_group_code,
    };
    // check validation error
    let validator_result = await validators.updateStatusDuplicateRequest(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // check record exist or not
      let result = await services.findOne(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result && result.status != "pending") {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      if (status === "confirm") {
        // check group code
        if (user_group_code) {
          var groupres = await services.checkGroupCode(data);
          if (groupres.success == 1 && groupres.is_group_code_applied == true) {
            data.payment_status = "done";
            data.group_code = user_group_code;
            is_redirect = "no";
          } else {
            data.group_code = null;
          }
        }
      }
      let update_result = await services.updateStatusDuplicateRequest(data);
      if (update_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      var THARAPYTYPE = "";
      if (result.therapy_type == "social_worker") {
        THARAPYTYPE = constants.SOCIAL_WORKER_TYPE;
      } else if (result.therapy_type == "registered_councillor") {
        THARAPYTYPE = constants.REGISTERED_COUNCILLOR_TYPE;
      } else if (result.therapy_type == "counselling_psychologist") {
        THARAPYTYPE = constants.COUNSELLING_PSYCHOLOGIST_TYPE;
      } else if (result.therapy_type == "clinical_psychologist") {
        THARAPYTYPE = constants.CLINICAL_PSYCHOLOGIST_TYPE;
      } else {
        THARAPYTYPE = constants.DEFAULT_TYPE;
      }
      var CUSTOMERNAME = res.locals.userData.first_name;
      var newTimeOffSet = moment().tz(timezone);
      var APPOINTMENTDATE = moment(result.apointment_date_time)
        .utcOffset(Number(newTimeOffSet._offset))
        .format("DD MMM YYYY hh:mm A");
      var LOGO = constants.BASEURL + "public/images/email_logo.png";
      var title = constants.CANCEL_BOOKING_TITLE;
      var message = constants.CANCEL_BOOKING_MESSAGE;
      if (status === "confirm") {
        title = constants.CONFIRM_BOOKING_TITLE;
        message = constants.CONFIRM_BOOKING_MESSAGE;
        let reponse_data = {
          id: result.id,
          request_number: result.request_number,
          cancel_url:
            constants.PAYFAST_CANCEL_URL + "?id=" + result.request_number,
          return_url:
            constants.PAYFAST_RETURN_URL + "?id=" + result.request_number,
          notify_url: constants.PAYFAST_NOTIFY_URL,
          is_redirect: is_redirect,
        };
        response.result = reponse_data;
      }
      // send emil to admin on confirm booking
      if (process.env.MAIL_SEND.toString() === "true") {
        var admin_email_data = {
          id: 16,
        };
        let adminTemplateResult = await loginServices.getEmailTemplate(
          admin_email_data
        );
        if (adminTemplateResult) {
          var CUSTOMERNAME = CUSTOMERNAME;
          var REQUEST_NUMBER = result.request_number;
          var THARAPY_TYPE = THARAPYTYPE;
          var APPOINTMENT_DATE = APPOINTMENTDATE;
          var htmlTemplate = adminTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[CUSTOMERNAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[REQUEST_NUMBER]", REQUEST_NUMBER)
            .replace("[THARAPY_TYPE]", THARAPY_TYPE)
            .replace("[APPOINTMENT_DATE]", APPOINTMENT_DATE);
          //==========send mail tocustomer from library==============
          mailOption = {
            subject: adminTemplateResult.subject,
            body: htmlTemplate,
            email: "info@syked.co.za",
          };
          EmailHelper.sendEmail(mailOption, function (mailResutl) {});
        }
      }
      //Send email to therapist on confirm booking
      if (process.env.MAIL_SEND.toString() === "true") {
        var user_email_data = {
          id: 17,
        };
        let therapistTemplateResult = await loginServices.getEmailTemplate(
          user_email_data
        );
        if (therapistTemplateResult) {
          var THERAPISTNAME =
            result.users_master.first_name +
            " " +
            result.users_master.last_name;
          var REQUESTNUMBER = result.users_master.request_number;
          var therapistEmail = UtilityHelper.decrypted(
            result.users_master.email
          );
          var therapistHtmlTemplate = therapistTemplateResult.body
            .replace(/[\s]/gi, " ")
            .replace("[THERAPISTNAME]", THERAPISTNAME)
            .replace("[CUSTOMERNAME]", CUSTOMERNAME)
            .replace("[LOGO]", LOGO)
            .replace("[REQUESTNUMBER]", REQUESTNUMBER)
            .replace("[THARAPYTYPE]", THARAPYTYPE)
            .replace("[APPOINTMENTDATE]", APPOINTMENTDATE);
          //==========send mail to therapist from library==============
          let therapistMailOption = {
            subject: therapistTemplateResult.subject,
            body: therapistHtmlTemplate,
            email: therapistEmail,
          };
          EmailHelper.sendEmail(therapistMailOption, function (mailResutl) {});
        }
      }
      // send notification
      if (result.users_master.device_type != "web") {
        webIds.push(result.users_master.notification_key);
        notificationData.id = result.id;
        notificationData.title = title;
        notificationData.message = message;
        notificationData.type = "therapist_job_detail";
        notificationData.device_type = result.users_master.device_type;
        notificationData.click_action = constants.BASE_PATH + "my-account/therapist-request-detail/" + requestsData[0].id;
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
          id: result.id,
          is_success: "yes",
          is_admin_inform: "yes",
          user_id: result.therapist_id,
          sender_type: "customer",
        };
        SocketHelper.userInform(socketOption, function (info) {});
      }
      // insert notifiction
      let notification_data = {
        user_id: result.therapist_id,
        request_id: result.id,
        type: "therapist_job_detail",
        title: title,
        message: message,
      };
      let insertNotification = await notificationServices.insertNotification(
        notification_data
      );
      response.statusCode = 200;
      response.message = constants.ORDER_UPDATED_SUCCESSFUL;
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
};

// export module to use it on other files
module.exports = requestController;
