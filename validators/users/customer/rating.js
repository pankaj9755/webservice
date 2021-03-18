let Validator = require("validatorjs");

const validators = {
  /**
   * add review
   */
  addReview: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      request_id: "required",
      rating: "required",
      therapist_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("request_id")) {
        response.message = validator.errors.first("request_id");
      } else if (validator.errors.first("rating")) {
        response.message = validator.errors.first("rating");
      } else if (validator.errors.first("therapist_id")) {
        response.message = validator.errors.first("therapist_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
