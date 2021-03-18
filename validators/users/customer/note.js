let Validator = require("validatorjs");

const validators = {
  /**
   * create note
   */
  createNote: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      description: "required",
      note_date: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("description")) {
        response.message = validator.errors.first("description");
      } else if (validator.errors.first("note_date")) {
        response.message = validator.errors.first("note_date");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * updtae note
   */
  updateNote: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      id: "required",
      description: "required",
      note_date: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      } else if (validator.errors.first("description")) {
        response.message = validator.errors.first("description");
      } else if (validator.errors.first("note_date")) {
        response.message = validator.errors.first("note_date");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * detail, delete validation
   */
  idValidation: async (data) => {
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
