let Validator = require("validatorjs");
const constants = require("./../../config/constants");

const validators = {
  /**
   * Registration
   */
  registration: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      email: "required|email",
      mobile_number: "required",
      user_type: "required",
      device_type: "required",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("email")) {
        response.message = validator.errors.first("email");
      } else if (validator.errors.first("mobile_number")) {
        response.message = validator.errors.first("mobile_number");
      } else if (validator.errors.first("user_type")) {
        response.message = validator.errors.first("user_type");
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
    if (data.user_type != "customer" && data.user_type != "therapist") {
      response.message = constants.INVALID_USER_TYPE;
      return response;
    }
    if (data.password === "" && data.social_key === "") {
      response.message = "Password is required.";
      return response;
    }
    if (data.user_type === "customer" && data.age === "") {
      response.message = "The age is required.";
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * Verification
   */
  verification: async (data) => {
    var response = {
      validate: false,
    };
    var rules = {
      code: "required",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("code")) {
        response.message = validator.errors.first("code");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * disclaimer
   */
  disclaimer: async (data) => {
    var response = {
      validate: false,
    };
    var rules = {
      agree: "required",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("agree")) {
        response.message = validator.errors.first("agree");
      }
      return response;
    }
    if (data.agree != "yes" && data.agree != "no") {
      response.message = constants.INACTIVE_VALUE;
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
