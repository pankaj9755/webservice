let Validator = require("validatorjs");

const validators = {
  /**
   * add mood
   */
  addMood: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      mood_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("mood_id")) {
        response.message = validator.errors.first("mood_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
