let Validator = require("validatorjs");
const constants = require("./../../config/constants");
const validators = {
  /**
   * login
   */
  signIn: async (data) => {
    let response = {
      validate: false,
    };
    // let rules = {
    //  user_name: "required|email",
    // password: "required"
    //   };
    // var validator = new Validator(data, rules);
    // if (validator.fails()) {
    //   if (validator.errors.first("user_name")) {
    //     response.message = validator.errors.first("user_name");
    //   } else if (validator.errors.first("password")) {
    //     response.message = validator.errors.first("password");
    //   }
    //   return response;
    // }

    if (data.user_name == "" && data.social_key1 == "") {
      if (data.email == "") {
        response.message = "User name is required";
        return response;
      } else if (data.password == "") {
        response.message = "Password is required";
        return response;
      }
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
  },
  /**
   * forgot password
   */
  forgotPassword: async (data) => {
    var response = {
      validate: false,
    };
    var rules = {
      email: "required|email",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("email")) {
        response.message = validator.errors.first("email");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * reset password
   */
  resetPassword: async (data) => {
    var response = {
      validate: false,
    };
    var rules = {
      token: "required",
      password: "required",
      user_id: "required",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("token")) {
        response.message = validator.errors.first("token");
      } else if (validator.errors.first("password")) {
        response.message = validator.errors.first("password");
      } else if (validator.errors.first("user_id")) {
        response.message = validator.errors.first("user_id");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
