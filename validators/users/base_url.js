let Validator = require("validatorjs");
const constants = require("./../../config/constants");
const validators = {
  /**
   * base url
   */
  baseUrl: async data => {
    var response = {
      validate: false
    };
    var rules = {
      app_version: "required",
      device_type: "required"
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("app_version")) {
        response.message = validator.errors.first("app_version");
      } else if (validator.errors.first("device_type")) {
        response.message = validator.errors.first("device_type");
      }
      return response;
    }
    if (
      data.device_type != "android" &&
      data.device_type != "iOS" &&
      data.device_type != "web"
    ) {
      response.message = constants.INVALID_DEVICE_TYPE;
      return response;
    }
    response.validate = true;
    return response;
  }
};

// export module to use it on other files
module.exports = validators;
