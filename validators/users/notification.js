let Validator = require("validatorjs");

const validators = {
  /**
   * delete
   */
  delete: async (data) => {
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
};

// export module to use it on other files
module.exports = validators;
