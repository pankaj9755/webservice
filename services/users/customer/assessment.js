const logger = require("./../../../config/winstonConfig");
const assessmentModel = require("../../../models/assessment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const assessment = {
  /**
   * find all assessment
   */
  findAll: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
    };
    return await assessmentModel
      .findAndCountAll({
        where: where,
        attributes: ["id", "title", "description", "image", "created_at"],
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
        logger.log("error", "DB error: assessment list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find one assessment
   */
  findOne: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
      id: data.id,
    };
    return await assessmentModel
      .findOne({
        where: where,
        attributes: ["id", "title", "description", "image", "created_at"],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: assessment query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = assessment;
