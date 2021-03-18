const logger = require("./../../config/winstonConfig");
const notificationModel = require("./../../models/notification");
const userMasterModel = require("../../models/users_master");
const Sequelize = require("sequelize");
var moment = require("moment");
const Op = Sequelize.Op;

const notification = {
  /**
   * find all notifications
   */
  findAll: async (data) => {
    let where = {
      user_id: data.user_id,
    };
    if (data.user_type == "therapist") {
      where.type = ["therapist_job_detail", "detail"];
    } else {
      where.type = ["customer_job_detail", "detail"];
    }
    return await notificationModel
      .findAndCountAll({
        where: where,
        attributes: [
          "id",
          "user_id",
          "request_id",
          "notification_id",
          "type",
          "title",
          "message",
          "status",
          "created_at",
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
        logger.log("error", "DB error: notification list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check exist id
   */
  checkExistId: async (data) => {
    let where = {
      id: data.id,
      user_id: data.user_id,
    };
    return await notificationModel
      .findOne({
        where: where,
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
          "DB error: notification check exist id query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * delete notification
   */
  deleteNotification: async (data) => {
    let where = {
      user_id: data.user_id,
      id: data.id,
    };
    return await notificationModel
      .destroy({
        where: where,
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: notification delete query failed.", err);
        return "result_failed";
      });
  },

  /**
   * read notification
   */
  readNotification: async (data) => {
    let where = {
      user_id: data.user_id,
      id: data.id,
    };
    return await notificationModel
      .update(
        { status: "read" },
        {
          where: where,
        }
      )
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: notification read query failed.", err);
        return "result_failed";
      });
  },

  /**
   * insert notification
   */
  insertNotification: async (data) => {
    return await notificationModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: notification insert query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get user notification key
   */
  getNotificationKey: async (data) => {
    return await userMasterModel
      .findOne({
        attributes: [
          "id",
          "user_type",
          "device_key",
          "device_type",
          "notification_key",
        ],
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
        logger.log("error", "DB error: get user info query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find all users for moods notification
   */
  findAllUsersMoodsNotification: async (data) => {
    let dayNumber = moment().subtract(3, "days").day();
    if (dayNumber == 7) {
      dayNumber = 1; 
    } else {
      dayNumber = dayNumber+1;
    }
    let where = {
       [Op.and]: [
         Sequelize.literal("DAYOFWEEK(users_master.created_at) = '" + dayNumber + "'"),
       ],
      //~ id: {
        //~ [Op.in]: [1],
      //~ },
      user_type:"customer",
      notification_key: {
        [Op.ne]: null
      }
    };
    console.log('dayNumber',dayNumber);
    return await userMasterModel
      .findAll({
        where: where,
        attributes: ["id", "device_type", "user_type", "notification_key"],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: notification get user query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * insert notification
   */
  insertBulkNotification: async (data) => {
    console.log(data);
    return await notificationModel
      .bulkCreate(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: notification insert query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = notification;
