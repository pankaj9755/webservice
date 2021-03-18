let Validator = require("validatorjs");

const validators = {
  /**
   * add comment
   */
  addComment: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      id: "required",
      comment: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      } else if (validator.errors.first("comment")) {
        response.message = validator.errors.first("comment");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
