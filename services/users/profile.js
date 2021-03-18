const logger = require("./../../config/winstonConfig");
const userMasterModel = require("../../models/users_master");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const profile = {
  /**
   * check exist password
   */
  checkPasswordExist: async (data) => {
    return await userMasterModel
      .findOne({
        where: {
          password: data.old_password,
          id: data.user_id,
        },
        attributes: ["id"],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: check password exist query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * update password
   */
  updatePassword: async (data) => {
    let updateData = { password: data.new_password };
    return await userMasterModel
      .update(updateData, {
        where: { id: data.user_id },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: password update query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check id exist or not
   */
  checkExistId: async (data) => {
    return await userMasterModel
      .findOne({
        attributes: ["id", "referral_code", "profile_image"],
        where: {
          id: data.user_id,
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
   * check user referral code
   */
  checkRefferalCode: async (data) => {
    let where = {
      referral_code: data.reffralCode,
      id: {
        [Op.ne]: data.user_id,
      },
    };
    return await userMasterModel
      .findAll({
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
   * update password
   */
  updateProfile: async (data) => {
    let updateData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile_number: data.mobile_number,
      gender: data.gender,
      city: data.city,
      referral_code: data.referral_code,
      kin_name: data.kin_name,
      kin_number: data.kin_number,
      age: data.age,
      address: data.address,
    };
    if (data.profile_image) {
      updateData.profile_image = data.profile_image;
    }
    return await userMasterModel
      .update(updateData, {
        where: { id: data.user_id },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: password update query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = profile;
