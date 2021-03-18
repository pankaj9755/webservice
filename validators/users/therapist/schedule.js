let Validator = require("validatorjs");

const validators = {
  /**
   * update schedule
   */
  updateSchedule: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      input_data: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("input_data")) {
        response.message = validator.errors.first("input_data");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
