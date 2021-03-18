const logger = require("./../../../config/winstonConfig");
const userMoodModel = require("../../../models/user_moods");
const moodModel = require("../../../models/moods");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const mood = {
  /**
   * find all mood
   */
  findAll: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
    };
    return await moodModel
      .findAll({
        where: where,
        attributes: ["id", "title", "code", "image"],
        order: [[data.order, data.direction]],
        // limit: data.limit,
        // offset: data.offset,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: mood list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * add mood
   */
  addMood: async (data) => {
    return await userMoodModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: mood query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = mood;
