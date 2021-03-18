let Validator = require("validatorjs");
const constants = require("./../../../config/constants");

const validators = {
  /**
   * detail
   */
  detail: async (data) => {
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
   * month list
   */
  monthList: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      month: "required",
      year: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("month")) {
        response.message = validator.errors.first("month");
      } else if (validator.errors.first("year")) {
        response.message = validator.errors.first("year");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

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

  /**
   * create
   */
  create: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      therapist_id: "required",
      schedule_date: "required",
      therapy_type: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("therapist_id")) {
        response.message = validator.errors.first("therapist_id");
      } else if (validator.errors.first("schedule_date")) {
        response.message = validator.errors.first("schedule_date");
      } else if (validator.errors.first("therapy_type")) {
        response.message = validator.errors.first("therapy_type");
      }
      return response;
    }
    if (
      data.category != "student" &&
      data.category != "medical_aid" &&
      data.category != "employee" &&
      data.category != "general_public"
    ) {
      response.message = constants.INVALID_CATEGORY;
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * edit
   */
  edit: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      id: "required",
      schedule_date: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      } else if (validator.errors.first("schedule_date")) {
        response.message = validator.errors.first("schedule_date");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * update status
   */
  updateStatus: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      id: "required",
      status: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      } else if (validator.errors.first("status")) {
        response.message = validator.errors.first("status");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /**
   * customer own detail
   */
  customerOwnDetail: async (data) => {
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
   * update status duplicate request
   */
  updateStatusDuplicateRequest: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      id: "required",
      status: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("id")) {
        response.message = validator.errors.first("id");
      } else if (validator.errors.first("status")) {
        response.message = validator.errors.first("status");
      }
      return response;
    }
    if (data.status != "confirm" && data.status != "cancel") {
      response.message = constants.INVALID_STATUS;
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
