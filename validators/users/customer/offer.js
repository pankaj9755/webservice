let Validator = require("validatorjs");

const validators = {
  /**
   * apply promocode
   */
  applyPromocode: async (data) => {
    let response = {
      validate: false,
    };
    let rules = {
      promo_code: "required",
      total_amount: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("promo_code")) {
        response.message = validator.errors.first("promo_code");
      } else if (validator.errors.first("total_amount")) {
        response.message = validator.errors.first("total_amount");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
