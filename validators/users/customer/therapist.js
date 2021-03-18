let Validator = require("validatorjs");

const validators = {
  /**
   * week schedule
   */
  weekSchedule: async data => {
    let response = {
      validate: false
    };
    let rules = {
      id: "required",
      week_number: "required"
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      } else if (validator.errors.first("week_number")) {
        response.message = validator.errors.first("week_number");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
  /**
   * question answer list
   */
  questionList: async data => {
    let response = {
      validate: false
    };
    let rules = {
      therapy_type: "required"
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("therapy_type")) {
        response.message = validator.errors.first("therapy_type");
      }
      return response;
    }
    response.validate = true;
    return response;
  }
};

// export module to use it on other files
module.exports = validators;
