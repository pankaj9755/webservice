const constants = require("./../../../../config/constants");
const UtilityHelper = require("./../../../../libraries/UtilityHelper")();
const validators = require("./../../../../validators/users/therapist/schedule");
const services = require("./../../../../services/users/therapist/schedule");
const logger = require("./../../../../config/winstonConfig");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

const scheduleController = {
  /**
   * schedule list
   */
  list: async (req, res) => {
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
    };
    try {
      let result = await services.findSchedule(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        var schedule_result = [
          {
            day_number: 0,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
          {
            day_number: 1,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
          {
            day_number: 2,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
          {
            day_number: 3,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
          {
            day_number: 4,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
          {
            day_number: 5,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
          {
            day_number: 6,
            id: 0,
            is_open: 0,
            schedule: [{ from: "14:00:00", to: "09:00:00" }],
          },
        ];
        schedule_result = JSON.stringify(schedule_result);
        schedule_result = JSON.parse(schedule_result);
        data.input_data = schedule_result;
        let result = await services.updateSchedule(data);
        if (result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
        response.message = constants.SCHEDULE_SUCCESS;
        response.statusCode = 200;
        response.result = schedule_result;
        res.statusCode = 200;
        return res.json(response);
      } else {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            (function (i) {
              if (result[i].schedule) {
                result[i].schedule = JSON.parse(result[i].schedule);
              }
              result[i].is_open == 0;
              console.log('i',i);
              console.log('result[i].is_open',result[i].is_open);
              if (result[i].is_open == "yes" || result[i].is_open == 1) {
                result[i].is_open == 1;
              } else {
                result[i].schedule = [{ from: "14:00:00", to: "09:00:00" }];
              }
            })(i);
          }
        }
        response.message = constants.SCHEDULE_SUCCESS;
        response.statusCode = 200;
        response.result = result;
        res.statusCode = 200;
        return res.json(response);
      }
    } catch (err) {
      logger.log(
        "error",
        "try-catch: scheduleController.get schedule list failed failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * edit schedule
   */
  edit: async (req, res) => {
    let input_data = req.body.input_data ? JSON.parse(req.body.input_data) : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id: user_id,
      input_data: input_data,
    };
    //check validation
    let validator_data = await validators.updateSchedule(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await services.updateSchedule(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.statusCode = 200;
      res.statusCode = 200;
      response.message = constants.RECORD_UPDATED_SUCCESS;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: scheduleController.edit schedule failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = scheduleController;
