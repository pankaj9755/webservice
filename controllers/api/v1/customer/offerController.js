const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/offer");
const services = require("./../../../../services/users/customer/offer");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");

const offerController = {
  /**
   * referral code discount
   */
  referralCodeDiscount: async (req, res) => {
    let user_id = res.locals.userData.id;
    let referral_code = res.locals.userData.referral_code;
    let is_used_reffral = "yes";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
      referral_code,
    };
    try {
      // get info
      let referral_result = await services.getReferralInfo(data);
      if (referral_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (referral_result.reffralInfo) {
        let referral_code = referral_result.reffralInfo.used_referral_code;
        let userResult = await services.getUsedReferralInfo(referral_code);
        if (userResult) {
          is_used_reffral = "no";
          var result = {
            is_used: is_used_reffral,
            code: referral_result.reffralInfo.used_referral_code,
            discount: referral_result.adminInfo.referral_discount,
            is_my_code: "yes",
          };
          response.statusCode = 200;
          //You have referral bonus of 5% discount because you have used Krishna's referral code on signup. Do you want to use the discount?
          response.message =
            "You have referral bonus of " +
            referral_result.adminInfo.referral_discount +
            "% discount because you have used " +
            userResult.first_name +
            "'s referral code on signup. Do you want to use the discount? ";
          response.result = result;
          res.statusCode = 200;
          return res.json(response);
        } else {
          res.statusCode = 200;
          response.statusCode = 200;
          response.message = "";
          response.result = { is_used: is_used_reffral };
          return res.json(response);
        }
      } else {
        if (referral_result.usedReffralInfo) {
          is_used_reffral = "no";
          var result = {
            is_used: is_used_reffral,
            code: referral_result.usedReffralInfo.referral_code,
            discount: referral_result.adminInfo.referral_discount,
            is_my_code: "no",
          };
          response.statusCode = 200;
          //You have referral bonus of 5% discount because you have used Krishna's referral code on signup. Do you want to use the discount?
          response.message =
            "You have referral bonus of " +
            adminInfo.referral_discount +
            "% discount because " +
            usedReffralInfo.first_name +
            " used your referral code for signup. Do you want to use the discount? ";
          response.result = result;
          res.statusCode = 200;
          return res.send(response);
        } else {
          response.statusCode = 200;
          response.message = "";
          response.result = { is_used: is_used_reffral };
          res.statusCode = 200;
          return res.send(response);
        }
      }
    } catch (err) {
      logger.log("error", "try-catch: offerController.get detail failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * apply promocode
   */
  applyPromocode: async (req, res) => {
    let promo_code = req.body.promo_code ? req.body.promo_code.trim() : "";
    let total_amount = req.body.total_amount ? req.body.total_amount : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      promo_code,
      total_amount,
      user_id,
    };
    // check validation error
    let validator_result = await validators.applyPromocode(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.getPromocodeInfo(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result.promocodeInfo) {
        response.statusCode = 400;
        res.statusCode = 400;
        response.message = constants.INVALID_PROMOCODE;
        response.message1 = "";
        return res.json(response);
      }
      if (result.promocodeInfo.status == "inactive") {
        response.statusCode = 400;
        res.statusCode = 400;
        response.message = constants.PROMOCODE_INACTIVE;
        response.message1 = "";
        return res.json(response);
      }
      var currentDate = moment().format("YYYY-MM-DD 00:00:00");
      var valdiFromDate = moment(result.promocodeInfo.valid_from).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      if (valdiFromDate > currentDate) {
        response.statusCode = 400;
        res.statusCode = 400;
        response.message = constants.PROMOCODE_NOT_AVAILABLE;
        response.message1 = "";
        return res.json(response);
      }
      var valdiTillDate = moment(result.promocodeInfo.valid_till).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      if (valdiTillDate < currentDate) {
        response.statusCode = 400;
        res.statusCode = 400;
        response.message = constants.PROMOCODE_EXPIRE;
        response.message1 = "";
        return res.json(response);
      }
      if (result.promocodeInfo.max_uses <= result.usedPromoInfo) {
        response.statusCode = 400;
        res.statusCode = 400;
        response.message = constants.LIMIT_USED_PROMOCODE;
        response.message1 = "";
        return res.json(response);
      }
      if (
        result.promocodeInfo.max_uses_per_person <= result.userUsedPromoInfo
      ) {
        response.statusCode = 400;
        res.statusCode = 400;
        response.message = constants.LIMIT_USED_PROMOCODE;
        response.message1 = "";
        return res.json(response);
      }
      var message1 = constants.CLICK_PAYNOW;
      var message =
        "Congratulations! Your promocode '" +
        result.promocodeInfo.code +
        "' has been applied. Click Pay Now to complete booking.";
      var amount = result.promocodeInfo.discount_amount;
      if (result.promocodeInfo.discount_type == "percent") {
        amount = (total_amount * result.promocodeInfo.discount_amount) / 100;
      }
      var result2 = { amount: amount, message: message, message1: message1 };
      response.statusCode = 200;
      response.result = result2;
      response.message = constants.PROMOCODE_INFO;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: offerController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * check group code
   */
  checkGroupCode: async (req, res) => {
    let user_id = res.locals.userData.id;
    let used_group_code = res.locals.userData.used_group_code;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id,
      used_group_code,
    };
    try {
      // get info
      let result = await services.getUsedGroupCodeinfo(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      let results = {};
      if (parseInt(result.total_request) > parseInt(result.free_session)) {
        results.remaining_free_request = 0;
      } else {
        results.remaining_free_request =
          parseInt(result.free_session) - parseInt(result.total_request);
      }
      res.statusCode = 200;
      delete response.message;
      response.result = results;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: offerController.get group code detail failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};

// export module to use it on other files
module.exports = offerController;
