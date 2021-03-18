const logger = require("./../../../config/winstonConfig");
const userMasterModel = require("../../../models/users_master");
const requestModel = require("../../../models/request");
const groupCodeModel = require("../../../models/group_code");
const therapistGroupCodeModel = require("../../../models/therapist_group_code");
const Sequelize = require("sequelize");

const review = {
  /**
   * get top rated therapist
   */
  getTopRatedTherapist: async (data) => {
    userMasterModel.hasMany(therapistGroupCodeModel, {
      foreignKey: "therapist_id",
    });
    therapistGroupCodeModel.belongsTo(groupCodeModel, {
      foreignKey: "group_code_id",
    });
    let where = {
      user_type: "therapist",
      deleted_at: null,
      therapy_profile_status: "verify",
      status: "active",
    };
    if (data.used_group_code) {
      return await userMasterModel
        .findAll({
          attributes: [
            "id",
            "first_name",
            "last_name",
            "user_type",
            "avg_rating",
            "total_rating",
            "profile_image",
            "therapy_type",
          ],
          where: where,
          include: [
            {
              attributes: ["group_code_id"],
              model: therapistGroupCodeModel,
              include: {
                attributes: ["code"],
                model: groupCodeModel,
                where: {
                  code: [data.used_group_code],
                },
              },
            },
          ],
          order: [[data.order, data.direction]],
          limit: data.limit,
          offset: data.offset,
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          return result;
        })
        .catch(async (err) => {
          logger.log(
            "error",
            "DB error:top rated therapist query failed.",
            err
          );
          return "result_failed";
        });
    } else {
      return await userMasterModel
        .findAll({
          attributes: [
            "id",
            "first_name",
            "last_name",
            "user_type",
            "avg_rating",
            "total_rating",
            "profile_image",
            "therapy_type",
          ],
          where: where,
          order: [[data.order, data.direction]],
          limit: data.limit,
          offset: data.offset,
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          return result;
        })
        .catch(async (err) => {
          logger.log(
            "error",
            "DB error:top rated therapist query failed.",
            err
          );
          return "result_failed";
        });
    }
  },

  /**
   * get upcoming booking
   */
  getUpcommingBooking: async (data) => {
    var id = "";
    var where = {};
    if (data.user_type == "customer") {
      id = "therapist_id";
      where.customer_id = data.user_id;
    } else {
      id = "customer_id";
      where.therapist_id = data.user_id;
    }
    where.status = "wip";
    requestModel.belongsTo(userMasterModel, {
      foreignKey: id,
    });
    return await requestModel
      .findAll({
        attributes: ["id", "apointment_date_time", "price", "therapy_type"],
        where: where,
        include: [
          {
            attributes: [
              "id",
              "first_name",
              "last_name",
              "user_type",
              "avg_rating",
              "total_rating",
              "profile_image",
              "therapy_type",
            ],
            model: userMasterModel,
          },
        ],
        order: [["id", "DESC"]],
        limit: 1,
        offset: 0,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result[0];
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error:one therapist therapist query failed.",
          err
        );
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = review;
