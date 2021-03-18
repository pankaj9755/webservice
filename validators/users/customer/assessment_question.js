let Validator = require("validatorjs");

const validators = {
  /**
   * add assessment question
   */
  addAssessmentQuestion: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      question_answer: "required",
      email: "required|email",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("question_answer")) {
        response.message = validator.errors.first("question_answer");
      } else if (validator.errors.first("email")) {
        response.message = validator.errors.first("email");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
