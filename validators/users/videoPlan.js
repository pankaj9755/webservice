let Validator = require("validatorjs");
const validators = {
  /**
   * update plan
   */
  updatePlan: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      plan_id: "required",
      used_seconds: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("plan_id")) {
        response.message = validator.errors.first("plan_id");
      } else if (validator.errors.first("used_seconds")) {
        response.message = validator.errors.first("used_seconds");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * check plan
   */
  checkPlan: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * Video Call Alert
   */
  videoCallAlert: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      request_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("request_id")) {
        response.message = validator.errors.first("request_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * Video Agreement Action
   */
  videoAgreementAction: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      request_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("request_id")) {
        response.message = validator.errors.first("request_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * update lat long
   */
  updateLatLong: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      lattitude: "required",
      longitude: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("lattitude")) {
        response.message = validator.errors.first("lattitude");
      } else if (validator.errors.first("longitude")) {
        response.message = validator.errors.first("longitude");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * video token info
   */
  videoTokenInfo: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      video_token: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("video_token")) {
        response.message = validator.errors.first("video_token");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
