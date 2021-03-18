let Validator = require("validatorjs");
const constants = require("./../../../config/constants");

const validators = {
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
      address: "required",
      qualification: "required",
      years_experience: "required",
      therapy_type: "required",
      hpcsa_no: "required",
      about_me: "required",
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
      } else if (validator.errors.first("address")) {
        response.message = validator.errors.first("address");
      } else if (validator.errors.first("qualification")) {
        response.message = validator.errors.first("qualification");
      } else if (validator.errors.first("years_experience")) {
        response.message = validator.errors.first("years_experience");
      } else if (validator.errors.first("therapy_type")) {
        response.message = validator.errors.first("therapy_type");
      } else if (validator.errors.first("hpcsa_no")) {
        response.message = validator.errors.first("hpcsa_no");
      } else if (validator.errors.first("about_me")) {
        response.message = validator.errors.first("about_me");
      }
      return response;
    }
    if (
      data.therapy_type != "social_worker" &&
      data.therapy_type != "registered_councillor" &&
      data.therapy_type != "counselling_psychologist" &&
      data.therapy_type != "clinical_psychologist"
    ) {
      response.message = constants.INVALID_THERAPY_TYPE;
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * add bank info
   */
  addBankInfo: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      bank_name: "required",
      account_holder_name: "required",
      routing_number: "required",
      account_number: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("bank_name")) {
        response.message = validator.errors.first("bank_name");
      } else if (validator.errors.first("account_holder_name")) {
        response.message = validator.errors.first("account_holder_name");
      } else if (validator.errors.first("routing_number")) {
        response.message = validator.errors.first("routing_number");
      } else if (validator.errors.first("account_number")) {
        response.message = validator.errors.first("account_number");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * update bank info
   */
  updateBankInfo: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      bank_name: "required",
      account_holder_name: "required",
      routing_number: "required",
      account_number: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("bank_name")) {
        response.message = validator.errors.first("bank_name");
      } else if (validator.errors.first("account_holder_name")) {
        response.message = validator.errors.first("account_holder_name");
      } else if (validator.errors.first("routing_number")) {
        response.message = validator.errors.first("routing_number");
      } else if (validator.errors.first("account_number")) {
        response.message = validator.errors.first("account_number");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
