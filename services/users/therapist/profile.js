const logger = require("./../../../config/winstonConfig");
const userMasterModel = require("../../../models/users_master");
const bankInfoModel = require("../../../models/bank_info");
const ratingModel = require("../../../models/rating");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const profile = {
  /**
   * check id exist or not
   */
  checkExistId: async (data) => {
    return await userMasterModel
      .findOne({
        attributes: ["id", "referral_code", "profile_image", "id_proof"],
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
   * update password
   */
  updateProfile: async (data) => {
    let updateData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile_number: data.mobile_number,
      gender: data.gender,
      address: data.address,
      years_experience: data.years_experience,
      qualification: data.qualification,
      therapy_type: data.therapy_type,
      hpcsa_no: data.hpcsa_no,
      about_me: data.about_me,
    };
    if (data.profile_image) {
      updateData.profile_image = data.profile_image;
    }
    if (data.id_proof) {
      updateData.id_proof = data.id_proof;
    }
    if (data.lattitude) {
      updateData.lattitude = data.lattitude;
    }
    if (data.longitude) {
      updateData.longitude = data.longitude;
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

  /**
   * get bank info
   */
  getBankInfo: async (data) => {
    return await bankInfoModel
      .findOne({
        where: {
          user_id: data.user_id,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:get bank info query failed.", err);
        return "result_failed";
      });
  },

  /**
   * add bank info
   */
  addBankInfo: async (data) => {
    return await bankInfoModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:add bank info query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update bank info
   */
  updateBankInfo: async (data) => {
    let updateData = {
      bank_name: data.bank_name,
      account_holder_name: data.account_holder_name,
      account_number: data.account_number,
      routing_number: data.routing_number,
    };
    return await bankInfoModel
      .update(updateData, {
        where: {
          user_id: data.user_id,
        },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:update bank info query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get all my review
   */
  getMyReview: async (data) => {
    ratingModel.belongsTo(userMasterModel, {
      foreignKey: "customer_id",
    });
    return await ratingModel
      .findAll({
        attributes: [
          "id",
          "job_id",
          "customer_id",
          "therapist_id",
          "rating",
          "review",
          "type",
          "created_at",
          [Sequelize.literal("'Anonymous'"), "first_name"],
          [Sequelize.literal(" '' "), "last_name"],
        ],
        where: {
          therapist_id: data.user_id,
        },
        include: {
          attributes: ["id", "profile_image"],
          model: userMasterModel,
        },
        order: [["id", "DESC"]],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:my review query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = profile;
