let Validator = require("validatorjs");

const validators = {
  /**
   * chat list
   */
  list: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      sender_id: "required",
      receiver_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("sender_id")) {
        response.message = validator.errors.first("sender_id");
      } else if (validator.errors.first("receiver_id")) {
        response.message = validator.errors.first("receiver_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * support chat list
   */
  supportChatList: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      live_video_id: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("live_video_id")) {
        response.message = validator.errors.first("live_video_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
