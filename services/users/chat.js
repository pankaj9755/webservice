const logger = require("./../../config/winstonConfig");
const chaHistoryModel = require("./../../models/chat_history");
const supportChaModel = require("./../../models/support_chat");
const userMasterModel = require("./../../models/users_master");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const chatHostory = {
  /**
   * find all chat
   */
  findAll: async (data) => {
    let where = {
      [Op.or]: [
        {
          sender_id: {
            [Op.eq]: data.sender_id,
          },
          receiver_id: {
            [Op.eq]: data.receiver_id,
          },
        },
        {
          sender_id: {
            [Op.eq]: data.receiver_id,
          },
          receiver_id: {
            [Op.eq]: data.sender_id,
          },
        },
      ],
    };
    return await chaHistoryModel
      .findAll({
        where: where,
        order: [["id", "ASC"]],
        // limit: data.limit,
        // offset: data.offset,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: chat history list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find all support chat
   */
  findAllSupportChat: async (data) => {
    supportChaModel.belongsTo(userMasterModel, {
      foreignKey: "user_id",
    });
    let where = {
      live_video_id: data.live_video_id,
    };
    return await supportChaModel
      .findAndCountAll({
        where: where,
        include: {
          attributes: [
            "id",
            "first_name",
            "last_name",
            "profile_image",
            "user_type",
          ],
          model: userMasterModel,
        },
        order: [[data.order, data.direction]],
        //limit: data.limit,
       // offset: data.offset,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: chat history list query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = chatHostory;
