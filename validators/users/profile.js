let Validator = require("validatorjs");

const validators = {
  /**
   * change password
   */
  changePassword: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      old_password: "required",
      new_password: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("old_password")) {
        response.message = validator.errors.first("old_password");
      } else if (validator.errors.first("new_password")) {
        response.message = validator.errors.first("new_password");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * update profile
   */
  updateProfile: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      first_name: "required",
      last_name: "required",
      email: "required|email",
      mobile_number: "required",
      gender: "required",
      city: "required",
      //kin_name: "required",
      //kin_number: "required",
      age: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("first_name")) {
        response.message = validator.errors.first("first_name");
      } else if (validator.errors.first("last_name")) {
        response.message = validator.errors.first("last_name");
      } else if (validator.errors.first("email")) {
        response.message = validator.errors.first("email");
      } else if (validator.errors.first("mobile_number")) {
        response.message = validator.errors.first("mobile_number");
      } else if (validator.errors.first("gender")) {
        response.message = validator.errors.first("gender");
      } else if (validator.errors.first("city")) {
        response.message = validator.errors.first("city");
      } else if (validator.errors.first("kin_name")) {
        response.message = validator.errors.first("kin_name");
      } else if (validator.errors.first("kin_number")) {
        response.message = validator.errors.first("kin_number");
      } else if (validator.errors.first("age")) {
        response.message = validator.errors.first("age");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
