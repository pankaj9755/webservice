const constants = require("./../../../../config/constants");
const services = require("./../../../../services/users/customer/survey_question");
const requestservices = require("./../../../../services/users/customer/request");
const validators = require("./../../../../validators/users/customer/survey_question");
const logger = require("./../../../../config/winstonConfig");
var UtilityHelper = require("./../../../../libraries/UtilityHelper")();
var moment = require("moment");

const surveyQuestionController = {
  /**
   * survey question list
   */
  list: async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let request_id = req.query.request_id ? req.query.request_id : 0;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      var group_code_id = "";
      if (request_id) {
        group_code_id = await requestservices.getGroupCodeIdByRequestId(request_id);
        
      }
      let data = {
        order,
        direction,
        group_code_id,
      };
      // get all contents form database query
      let result = await services.therapistSuerveuQuestion(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.rows.length <= 0) {
        response.message = 'Survey Question not found';
        res.statusCode = 400;
        response.result = [];
        return res.json(response);
      }
      for (let i = 0; i < result.rows.length; i++) {
        (function (i) {
          var validJson = UtilityHelper.IsJsonString(result.rows[i].options);
          if (validJson) {
            result.rows[i].options = JSON.parse(result.rows[i].options);
          } else {
            result.rows[i].options = [];
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
        "try-catch: assessmentController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * add survey question
   */
  add: async (req, res) => {
    let question_answer = req.body.question_answer
      ? req.body.question_answer
      : "";
    let request_id = req.body.request_id ? req.body.request_id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      question_answer,
      user_id,
      request_id,
    };
    // check validation error
    let validator_result = await validators.addSurveyQuestion(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.addSurveyQuestion(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // response.message = constants.SURVEY_QUESTION_ADDED_SUCESSFULL;
      response.message = constants.SURVEY_ADDED_SUCCSESFUL;
      // response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: assessmentController.add failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * survey question detail
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      var group_code_id = "";
      if (res.locals.userData.used_group_code) {
        let group_code = res.locals.userData.used_group_code;
        let group_code_result = await services.getGroupCodeId(group_code);
        if (group_code_result) {
          group_code_id = group_code_result.id;
        }
      }
      let data = {
        id,
        group_code_id,
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
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: assessmentController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = surveyQuestionController;
