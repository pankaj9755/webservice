let Validator = require("validatorjs");
const constants = require("./../../config/constants");
const validators = {
  /**
   * get content
   */
  getContent: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      type: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("type")) {
        response.message = validator.errors.first("type");
      }
      return response;
    }
    if (
      data.type != "terms_condition" &&
      data.type != "privacy_policy" &&
      data.type != "about_us"
    ) {
      response.message = constants.INVALID_TYPE;
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
