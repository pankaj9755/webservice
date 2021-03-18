const logger = require("./../../config/winstonConfig");
const userMasterModel = require("../../models/users_master");
const bankInfoModel = require("../../models/bank_info");
const emailTemplateModel = require("../../models/email_template");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const login = {
  /**
   * login
   */
  login: async (data) => {
    if (data.social_key1 != "" && data.social_type1 != "") {
      var where = {
        social_key: data.social_key1,
        social_type: data.social_type1,
      };
    } else {
      var where = {
        [Op.or]: [
          {
            email: {
              [Op.eq]: data.credentials,
            },
          },
          {
            mobile_number: {
              [Op.eq]: data.credentials,
            },
          },
        ],
        password: data.password,
      };
    }
    where.deleted_at = null;
    return await userMasterModel
      .findOne({
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: login query failed.", err);
        return "result_failed";
      });
  },

  /**
   * Update User Info
   */
  updateUserInfo: async (data) => {
    let updateData = {
      device_type: data.device_type,
      device_key: data.device_key,
      notification_key: data.notification_key,
      dod: data.dod,
      dd: data.dd,
      last_seen: data.last_seen,
    };
    return await userMasterModel
      .update(updateData, {
        where: { id: data.id },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:user info update query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check email exist or not in table
   */
  checkEmailExist: async (data) => {
    var where = {
      email: data.email,
      deleted_at: null,
    };
    return await userMasterModel
      .findOne({
        attributes: ["id", "email", "first_name", "last_name"],
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: email service.check email exist or not query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * Update verification  code
   */
  updateOtpCode: async (data) => {
    let updateData = {
      remember_token: data.otp_code,
    };
    return await userMasterModel
      .update(updateData, {
        where: { id: data.user_id },
      })
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: verification code update query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * get email template
   */
  getEmailTemplate: async (data) => {
    return await emailTemplateModel
      .findOne({
        where: {
          id: data.id,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: get admin email template query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * check code exist or not
   */
  checkToken: async (data) => {
    return await userMasterModel
      .findOne({
        where: { id: data.user_id, remember_token: data.token },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: email service.check email exist or not query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * reset password
   */
  updatePassword: async (data) => {
    var updateData = {
      password: data.password,
      remember_token: "",
    };
    return await userMasterModel
      .update(updateData, {
        where: { id: data.user_id },
      })
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: admin reset password query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * check bank info
   */
  checkBankInfo: async (user_id) => {
    return await bankInfoModel
      .findOne({
        where: { user_id: user_id },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check bank info query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = login;
