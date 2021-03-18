let Validator = require("validatorjs");

const validators = {
  /**
   * add survey question
   */
  addSurveyQuestion: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      question_answer: "required",
      request_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("question_answer")) {
        response.message = validator.errors.first("question_answer");
      } else if (validator.errors.first("request_id")) {
        response.message = validator.errors.first("request_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
