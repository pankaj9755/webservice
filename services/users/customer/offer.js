const logger = require("./../../../config/winstonConfig");
const userMasterModel = require("../../../models/users_master");
const promocodeModel = require("../../../models/promocode");
const settingModel = require("../../../models/setting");
const requestModel = require("../../../models/request");
const groupCodeModel = require("../../../models/group_code");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require("moment");

const request = {
  /**
   * get referral info
   */
  getReferralInfo: async (data) => {
    let response = {};
    let promise = [];
    let referral_where = {
      id: data.user_id,
      benefit_i_referral_used: "no",
      used_referral_code: null,
    };
    let used_referral_where = {
      id: data.user_id,
      used_referral_code: data.referral_code,
      benefit_referral_used: "no",
      deleted_at: null,
    };
    promise.push(
      // get referral info
      userMasterModel
        .findOne({
          attributes: ["id", "used_referral_code", "first_name"],
          where: referral_where,
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          response.reffralInfo = result;
        }),
      // get used referral info
      userMasterModel
        .findOne({
          attributes: ["id", "used_referral_code", "first_name"],
          where: used_referral_where,
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          response.usedReffralInfo = result;
        }),
      // get setting info
      settingModel.findOne({}).then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        response.adminInfo = result;
      })
    );

    return Promise.all(promise)
      .then(async function (final_result) {
        return response;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: get referral query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get used referral info
   */
  getUsedReferralInfo: async (referral_code) => {
    return await userMasterModel
      .findOne({
        attributes: ["id", "used_referral_code", "first_name"],
        where: {
          referral_code: referral_code,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: used referral code query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get promocode info
   */
  getPromocodeInfo: async (data) => {
    let response = {};
    let promise = [];
    promise.push(
      promocodeModel
        .findOne({
          where: {
            code: data.promo_code,
          },
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          response.promocodeInfo = result;
        }),
      requestModel
        .count({
          where: {
            promo_code: data.promo_code,
          },
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          response.usedPromoInfo = result;
        }),
      requestModel
        .count({
          where: {
            promo_code: data.promo_code,
            customer_id: data.user_id,
          },
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          response.userUsedPromoInfo = result;
        })
    );
    return Promise.all(promise)
      .then(async function (final_result) {
        return response;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: get promocode query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get used group code info
   */
  getUsedGroupCodeinfo: async (data) => {
    let response = {};
    let promise = [];
    promise.push(
      // get how many used group code
      requestModel
        .count({
          where: {
            customer_id: data.user_id,
            status: ["pending", "wip"],
          },
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          response.total_request = result;
        }),
      // get fee session value
      groupCodeModel
        .findOne({
          attributes: ["free_session"],
          where: {
            code: data.used_group_code,
          },
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (!result) {
            response.free_session = 0;
          } else {
            response.free_session = result.free_session;
          }
        })
    );
    return Promise.all(promise)
      .then(async function (final_result) {
        return response;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: get group code query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = request;
