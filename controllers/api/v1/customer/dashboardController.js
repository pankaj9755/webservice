const constants = require("./../../../../config/constants");
//const validators = require("./../../../../validators/users/customer/rating");
const services = require("./../../../../services/users/customer/dashboard");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");

const dashboard = {
  /**
   * top rated therapist list
   */
  topRatedList: async (req, res) => {
    let user_id = "";
    let used_group_code = "";
    if (res.locals.userData) {
      user_id = res.locals.userData.id;
      used_group_code = res.locals.userData.used_group_code;
    }
    let order = "total_rating";
    let direction = "DESC";
    let limit = 10;
    let offset = 0;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      order,
      direction,
      limit,
      offset,
      user_id,
      used_group_code,
    };
    try {
      let result = await services.getTopRatedTherapist(data);
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
          if (result[i].therapist_group_codes) {
            delete result[i].therapist_group_codes;
          }
          result[i].avg_rating = Number.parseFloat(
            result[i].avg_rating
          ).toFixed(1);
          if (result[i].therapy_type == "social_worker") {
            result[i].therapy_type = constants.SOCIAL_WORKER_TYPE;
          } else if (result[i].therapy_type == "registered_councillor") {
            result[i].therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
          } else if (result[i].therapy_type == "counselling_psychologist") {
            result[i].therapy_type = constants.COUNSELLING_PSYCHOLOGIST_TYPE;
          } else if (result[i].therapy_type == "clinical_psychologist") {
            result[i].therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
          } else {
            result[i].therapy_type = constants.DEFAULT_TYPE;
          }
        })(i);
      }
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: dashboardController.dashboard failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * upcomming booking
   */
  upcommingBooking: async (req, res) => {
    let user_id = res.locals.userData.id;
    let user_type = res.locals.userData.user_type;
    let order = "id";
    let direction = "DESC";
    let limit = 1;
    let offset = 0;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
      user_type,
      order,
      direction,
      limit,
      offset,
    };
    try {
      let result = await services.getUpcommingBooking(data);
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
      //result.apointment_date_time = moment(result.apointment_date_time,).utcOffset(120).format("YYYY-MM-DDTHH:mm:00.000[Z]");
      result.users_master.avg_rating = Number.parseFloat(
        result.users_master.avg_rating
      ).toFixed(1);
      if (result.users_master.therapy_type == "social_worker") {
        result.users_master.therapy_type = constants.SOCIAL_WORKER_TYPE;
      } else if (result.users_master.therapy_type == "registered_councillor") {
        result.users_master.therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
      } else if (
        result.users_master.therapy_type == "counselling_psychologist"
      ) {
        result.users_master.therapy_type =
          constants.COUNSELLING_PSYCHOLOGIST_TYPE;
      } else if (result.users_master.therapy_type == "clinical_psychologist") {
        result.users_master.therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
      } else {
        result.users_master.therapy_type = constants.DEFAULT_TYPE;
      }
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: dashboardController.upcomming booking failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = dashboard;
