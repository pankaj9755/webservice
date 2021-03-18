const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/therapist");
const services = require("./../../../../services/users/customer/therapist");
var UtilityHelper = require("./../../../../libraries/UtilityHelper")();
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");
const requestservices = require("./../../../../services/users/customer/request");
const therapistController = {
  /**
   * therapist list
   */
  list: async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let score = req.query.score ? parseInt(req.query.score) : "";
    let user_id = "";
    let used_group_code = "";
    if (res.locals.userData) {
      user_id = res.locals.userData.id;
      used_group_code = res.locals.userData.used_group_code;
    }
    console.log('used_group_code',used_group_code);
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let data = {
        limit,
        offset,
        user_id,
        used_group_code,
        score
      };
      // get all contents form database query
      let result = await services.findAll(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.rows.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (let i = 0; i < result.rows.length; i++) {
        (function (i) {
          if (result.rows[i].therapist_group_codes) {
            delete result.rows[i].therapist_group_codes;
          }
          result.rows[i].avg_rating = Number.parseFloat(
            result.rows[i].avg_rating
          ).toFixed(1);
          if (result.rows[i].therapy_type == "social_worker") {
            result.rows[i].therapy_type = constants.SOCIAL_WORKER_TYPE;
            result.rows[i].price = constants.SOCIAL_WORKER;
          } else if (result.rows[i].therapy_type == "registered_councillor") {
            result.rows[i].therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
            result.rows[i].price = constants.REGISTERED_COUNCILLOR;
          } else if (
            result.rows[i].therapy_type == "counselling_psychologist"
          ) {
            result.rows[i].therapy_type =
              constants.COUNSELLING_PSYCHOLOGIST_TYPE;
            result.rows[i].price = constants.COUNSELLING_PSYCHOLOGIST;
          } else if (result.rows[i].therapy_type == "clinical_psychologist") {
            result.rows[i].therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
            result.rows[i].price = constants.CLINICAL_PSYCHOLOGIST;
          } else {
            result.rows[i].therapy_type = constants.DEFAULT_TYPE;
            result.rows[i].price = constants.DEFAULT_PRICE;
          }
        })(i);
      }
      response.is_price_show = true;
      console.log('used_group_code================',used_group_code);
      if (used_group_code!="") {
		  var groupcodeinfo = {};
		  groupcodeinfo.user_id = user_id;
		  groupcodeinfo.customer_id = user_id;
		  groupcodeinfo.group_code = used_group_code;
        var groupres = await requestservices.checkGroupCode(groupcodeinfo);
        if (groupres.success == 1 && groupres.is_group_code_applied == true) {
          response.is_price_show = false;
        } 
      }
      
       
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: therapistController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * therapist detail
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let user_id = "";
    let used_group_code = "";
    if (res.locals.userData) {
      user_id = res.locals.userData.id;
      used_group_code = res.locals.userData.used_group_code;
    }
    try {
      const data = {
        id,
      };
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
      result.avg_rating = Number.parseFloat(result.avg_rating).toFixed(1);
      if (result.therapy_type == "social_worker") {
        result.therapy_type = constants.SOCIAL_WORKER_TYPE;
        result.price = constants.SOCIAL_WORKER;
      } else if (result.therapy_type == "registered_councillor") {
        result.therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
        result.price = constants.REGISTERED_COUNCILLOR;
      } else if (result.therapy_type == "counselling_psychologist") {
        result.therapy_type = constants.COUNSELLING_PSYCHOLOGIST_TYPE;
        result.price = constants.COUNSELLING_PSYCHOLOGIST;
      } else if (result.therapy_type == "clinical_psychologist") {
        result.therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
        result.price = constants.CLINICAL_PSYCHOLOGIST;
      } else {
        result.therapy_type = constants.DEFAULT_TYPE;
        result.price = constants.DEFAULT_PRICE;
      }
      if (result.qualification) {
        var validJson = UtilityHelper.IsJsonString(result.qualification);
        if (validJson) {
          result.qualification = JSON.parse(result.qualification);
        } else {
          result.qualification = [];
        }
      }
      if (result.mobile_number) {
        result.mobile_number = UtilityHelper.decrypted(result.mobile_number);
      }
      // add content data to response as result
      
      response.is_price_show = true;
      
      if (used_group_code!="") {
		  var groupcodeinfo = {};
		  groupcodeinfo.user_id = user_id;
		  groupcodeinfo.customer_id = user_id;
		  groupcodeinfo.group_code = used_group_code;
        var groupres = await requestservices.checkGroupCode(groupcodeinfo);
        if (groupres.success == 1 && groupres.is_group_code_applied == true) {
          response.is_price_show = false;
        } 
      }
      
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: therapistController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * therapist work schedule
   */
  weekSchedule: async (req, res) => {
    let id = req.query.id ? req.query.id : "";
    let year = req.query.year ? req.query.year : "";
    let week_number = req.query.week_number ? req.query.week_number : "";
    let timezone = req.body.timezone ? req.body.timezone : "Asia/Kolkata";
    let currentWeekDay = moment().weekday(); //current week number;
    let schedule = [];
    let requestArray = [];
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var timeoffset = moment().tz(timezone);
    let data = {
      week_number: week_number,
      id: id,
      timeoffset: timeoffset,
    };
    //check validation
    let validator_data = await validators.weekSchedule(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await services.findWeekchedule(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      var currentWeekNumber = moment().format("w");
      var dayArray = {
        "0": "sunday",
        "1": "monday",
        "2": "tuesday",
        "3": "wednesday",
        "4": "thrusday",
        "5": "friday",
        "6": "saturday",
      }; //day array
      var startRequestDate = moment()
        .day("sunday")
        .week(week_number)
        .format("YYYY-MM-DD 00:00:00");
      var endRequestDate = moment()
        .day("saturday")
        .week(week_number)
        .format("YYYY-MM-DD 23:59:59");
      let request_data = {
        startRequestDate: startRequestDate,
        endRequestDate: endRequestDate,
        id: result.id,
      };
      let requestResult = await services.findRequest(request_data);
      if (requestResult === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (requestResult.length > 0) {
        for (var r = 0; r < requestResult.length; r++) {
          var appointmentDate = moment(requestResult[r].apointment_date_time)
            .utcOffset(Number(timeoffset._offset))
            .format("YYYY-MM-DD HH:mm:ss");
          requestArray.push(appointmentDate); //request appointment date push
        }
      }
      for (let i = 0; i < result.therapist_schedules.length; i++) {
        var item = {};
        // console.log("currentWeekNumber-------", currentWeekNumber);
        if (
          result.therapist_schedules[i].schedule.length > 0 &&
          (currentWeekDay <= result.therapist_schedules[i].day_number ||
            week_number != currentWeekNumber)
        ) {
          var fridayDataVal = JSON.parse(
            result.therapist_schedules[i].schedule
          );
          for (let s = 0; s < fridayDataVal.length; s++) {
            var dayName = dayArray[result.therapist_schedules[i].day_number]; //---get day name
            var startDate = moment()
              .day(dayName)
              .week(week_number)
              .format("YYYY-MM-DD"); //---get start date
            //---get start and end date time
            var startDateTime = startDate + " " + fridayDataVal[s].to;
            var endDateTime = startDate + " " + fridayDataVal[s].from;
            // subtract 60 mintues means 6-7 Pm not avaliable at 7 pm
            var endDateTime = moment(endDateTime)
              .subtract("60", "minutes")
              .format("YYYY-MM-DD HH:mm:00");
            startDateTimeValue = moment(startDateTime).format(
              "YYYY-MM-DD HH:mm a"
            ); //formate change
            endDateTimeValue = moment(endDateTime).format("YYYY-MM-DD HH:mm a"); //formate change
            startHourCheck = moment(startDateTime).format("HH"); //get hour
            endHourCheck = moment(endDateTime).format("HH"); //get hour
            startMinuteCheck = moment(startDateTime).format("mm"); //get minute
            endMinuteCheck = moment(endDateTime).format("mm"); //get minute
            if (startHourCheck < 12) {
              getStartHour = moment(startDateTime).format("HH");
            } else {
              getStartHour = startHourCheck;
            }
            if (endHourCheck < 12 && startMinuteCheck > 0) {
              getEndHour = moment(endDateTime).format("HH");
              endBreakHour = moment(endDateTime).add(-1, "hour").format("HH");
            } else if (endHourCheck < 12) {
              getEndHour = moment(endDateTime).format("HH");
            } else if (
              endHourCheck > 12 &&
              startMinuteCheck > 0 &&
              endMinuteCheck > 0
            ) {
              getEndHour = endHourCheck;
              endBreakHour = moment(endDateTime).format("HH");
            } else if (endHourCheck > 12 && endMinuteCheck > 0) {
              getEndHour = endHourCheck;
              endBreakHour = moment(endDateTime).format("HH");
            } else if (endHourCheck > 12 && startMinuteCheck > 0) {
              getEndHour = endHourCheck;
              endBreakHour = moment(endDateTime).add(-1, "hour").format("HH");
            } else {
              getEndHour = endHourCheck;
            }
            //---get start hour and end hour
            for (let hour = getStartHour; hour <= getEndHour; hour++) {
              startHourTitle = moment({ hour }).format("hh:mm A"); //---final start hour
              endHourTitle = moment({ hour }).add(1, "hour").format("hh:mm A"); //---final
              startHourFirst = moment({ hour }).format("HH:mm:ss"); //---final start hour
              endHourFirst = moment({ hour }).add(1, "hour").format("HH:mm:ss"); //---final end hour
              var sValFirst = startDate + " " + startHourFirst;
              if (requestArray.length > 0 && requestArray.includes(sValFirst)) {
                //check this request appointment available or not in array
                availabilityFirst = false;
                classNameFirst = ["book-bg-cal"];
                backgroundColorFirst = "#d8d2d2";
                borderColorFirst = "#d8d2d2";
                textColorFirst = "#000";
              } else {
                availabilityFirst = true;
                classNameFirst = ["avl-bg-cal", "cal-text-cent"];
                backgroundColorFirst = "#bac866";
                borderColorFirst = "#bac866";
                textColorFirst = "#000";
              }
              var dateTimeJson = {
                available: availabilityFirst,
                title: startHourTitle,
                start: startDate + " " + startHourFirst,
                end: startDate + " " + endHourFirst,
                className: classNameFirst,
                backgroundColor: backgroundColorFirst,
                borderColor: borderColorFirst,
                textColor: textColorFirst,
              };
              let afterTwelveHours = moment().add(12, "h").valueOf();
              let dbDateTimeValue = moment(
                startDate + " " + startHourFirst
              ).valueOf();
              // console.log('dbDateTimeValue: ', dbDateTimeValue);
              var finalJson = JSON.stringify(dateTimeJson);
              finalJson = JSON.parse(finalJson);
              if (dbDateTimeValue > afterTwelveHours) {
                schedule.push(finalJson); //First json push
              }
            }
          }
        }
      }
      response.message = constants.WEEK_SCHEDULE;
      response.statusCode = 200;
      response.result = schedule;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: therapistController. find week schedule failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * question answer list
   */
  questionList: async (req, res) => {
    let therapy_type = req.query.therapy_type ? req.query.therapy_type : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      // therapy_type: therapy_type,
      therapy_type: "marriage_counseling",
    };
    //check validation
    let validator_data = await validators.questionList(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await services.findQuestion(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (let i = 0; i < result.length; i++) {
        (function (i) {
          result[i].options = JSON.parse(result[i].options);
        })(i);
      }
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: therapistController.question list failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * question answer list
   */
  questionAnswerList: async (req, res) => {
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
      is_exist: false,
    };
    try {
      if (res.locals.userData) {
        let user_id = res.locals.userData.id;
        // if (user_id != "329") {
        //   user_id = 0;
        // } else {
        //   user_id = ["329"];
        // }
       //user_id = 0; 
        let checkExist = await services.checkQuestionAnswer(user_id);
        if (checkExist === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        if (checkExist) {
          checkExist.question_answer = JSON.parse(checkExist.question_answer);
          response.is_exist = true;

          if (checkExist.question_answer.length > 0) {
            for (i = 0; i < checkExist.question_answer.length; i++) {
              (function (i) {
                checkExist.question_answer[i].options = null;
                if (checkExist.question_answer[i].answer === '') {
                  response.is_exist = false;
                }
              })(i);
            }
          }
          
          if (response.is_exist) {
            delete response.message;
            delete checkExist.id;
            response.result = checkExist;
            res.statusCode = 200;
            return res.json(response);
          } else {
            let result = await services.findQuestionAnswer();
            if (result === "result_failed") {
              res.statusCode = 500;
              return res.json(response);
            }
            delete response.message;
            response.result = result;
            res.statusCode = 200;
            return res.json(response);
          }
        } else {
          let result = await services.findQuestionAnswer();
          if (result === "result_failed") {
            res.statusCode = 500;
            return res.json(response);
          }
          delete response.message;
          response.result = result;
          res.statusCode = 200;
          return res.json(response);
        }
      } else {
        let result = await services.findQuestionAnswer();
        if (result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        delete response.message;
        response.result = result;
        res.statusCode = 200;
        return res.json(response);
      }
    } catch (err) {
      logger.log(
        "error",
        "try-catch: therapistController.all question anser list failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = therapistController;
