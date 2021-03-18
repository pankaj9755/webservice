const logger = require("./../../config/winstonConfig");
const dbConnection = require("../../config/connection");
const userTempModel = require("../../models/users_temp");
const userMasterModel = require("../../models/users_master");
const userNotificationKeyModel = require("../../models/user_notification_keys");
const emailTemplateModel = require("../../models/email_template");
const groupCodeModel = require("../../models/group_code");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const signUp = {
  /**
   * check email or mobile already exists
   */
  checkEmailMobileAlreadyExists: async (data) => {
    let response = {
      emailExist: false,
      mobileExist: false,
    };
    let promise = [];
    let email_where = { email: data.email, deleted_at: null };
    let mobile_where = { mobile_number: data.mobile_number, deleted_at: null };
    if (data.user_id) {
      email_where.id = {
        [Op.ne]: data.user_id,
      };
      mobile_where.id = {
        [Op.ne]: data.user_id,
      };
    }
    promise.push(
      userMasterModel
        .findOne({
          where: email_where,
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result != null && Object.keys(result).length > 0) {
            response.emailExist = true;
          }
        }),
      userMasterModel
        .findOne({
          where: mobile_where,
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result != null && Object.keys(result).length > 0) {
            response.mobileExist = true;
          }
        })
    );
    return Promise.all(promise)
      .then(async function (final_result) {
        console.log(response);
        return response;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: verification check query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check group code
   */
  checkExistGroupCode: async (code) => {
    return await groupCodeModel
      .findOne({
        where: {
          code: code,
          status: "active",
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check group code query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check user referral code
   */
  checkRefferalCode: async (referral_code) => {
    let where = { referral_code: referral_code, deleted_at: null };
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
        logger.log("error", "DB error:check refferal code query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check id exist or not
   */
  checkIdExist: async (data) => {
    let where = {
      [Op.or]: [
        {
          email: {
            [Op.eq]: data.email,
          },
        },
        {
          mobile_number: {
            [Op.eq]: data.mobile_number,
          },
        },
      ],
    };
    return await userTempModel
      .findOne({
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check id query failed.", err);
        return "result_failed";
      });
  },

  /**
   * insert verification
   */
  insertVerification: async (data) => {
    let insertData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile_number: data.mobile_number,
      password: data.password,
      social_key: data.social_key,
      social_type: data.social_type,
      code: data.code,
      count: 1,
    };
    if (data.kin_name != "") {
      insertData.kin_name = data.kin_name;
    }
    if (data.kin_number != "") {
      insertData.kin_number = data.kin_number;
    }
    return await userTempModel
      .create(insertData)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: insert verification query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update verification
   */
  updateVerification: async (data) => {
    let updateData = {
      first_name: data.first_name,
      last_name: data.last_name,
      code: data.code,
      email: data.email,
      mobile_number: data.mobile_number,
      password: data.password,
      social_key: data.social_key,
      social_type: data.social_type,
    };
    if (data.kin_name != "") {
      updateData.kin_name = data.kin_name;
    }
    if (data.kin_number != "") {
      updateData.kin_number = data.kin_number;
    }
    return await userTempModel
      .update(updateData, {
        where: { id: data.id },
      })
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: update verification query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update verification code
   */
  updateResendOtpCode: async (data) => {
    let updateData = {
      code: data.code,
    };
    return await userTempModel
      .update(updateData, {
        where: { id: data.id },
      })
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: update resend otp code query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * disclaimer
   */
  disclaimer: async (data) => {
    let updateData = {
      is_agree: data.agree,
    };
    return await userMasterModel
      .update(updateData, {
        where: { id: data.user_id },
      })
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: update disclaimer query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update verification code
   */
  userReferralExists: async (referralCode) => {
    return await userMasterModel
      .findAll({
        attributes: ["id"],
        where: {
          referral_code: referralCode,
        },
        offset: 0,
        limit: 1,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check referral code query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check id exist or not
   */
  checkExistId: async (data) => {
    return await userTempModel
      .findOne({
        attributes: ["id", "code"],
        where: {
          mobile_number: data.mobile_number,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check id query failed.", err);
        return "result_failed";
      });
  },

  /**
   * sign up
   */
  signUp: async (data) => {
    return await userMasterModel
      .create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: sign up query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get data
   */
  getUserData: async (data) => {
    let where = {
      id: data.id,
      mobile_number: data.mobile_number,
    };
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
        logger.log("error", "DB error: sign up query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get user notification key data
   */
  getUserNotificationKey: async (user_id) => {
    return await userNotificationKeyModel
      .findOne({
        attributes: ["id"],
        where: {
          user_id: user_id,
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
          "DB error: get user notification key data query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * insert user notification key data
   */
  insertNotificationKey: async (data) => {
    return await userNotificationKeyModel
      .create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: insert notification query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update user notification key data
   */
  updateNotificationKey: async (data) => {
    let updateData = { notification_key: data.notification_key };
    return await userNotificationKeyModel
      .update(updateData, {
        where: { id: data.user_id },
      })
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: update notification query failed.", err);
        return "result_failed";
      });
  },

  /**
   * delete user notification key data
   */
  deleteNotificationKey: async (data) => {
    let where = {
      notification_key: data.notification_key,
      user_id: {
        [Op.ne]: data.user_id,
      },
    };
    // where.user_id = {
    //   [Op.ne]: data.user_id
    // };
    return await userNotificationKeyModel
      .destroy({
        where: where,
      })
      .then(async (delete_result) => {
        return delete_result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: delete notification user query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * get customer email template
   */
  getUserEmailTemplate: async (user_type) => {
    let where = {};
    if (user_type == "customer") {
      where.id = 1;
    } else {
      where.id = 8;
    }
    return await emailTemplateModel
      .findOne({
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
          "DB error: get user email template query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * get admin email template
   */
  getAdminEmailTemplate: async (user_type) => {
    return await emailTemplateModel
      .findOne({
        where: {
          id: 7,
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
   * remove temp user
   */
  removeTempUser: async (id) => {
    return await userTempModel
      .destroy({
        where: {
          id: id,
        },
      })
      .then(async (delete_result) => {
        return delete_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: delete temp user query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = signUp;
