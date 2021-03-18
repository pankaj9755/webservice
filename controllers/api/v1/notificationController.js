const constants = require("./../../../config/constants");
const validators = require("./../../../validators/users/notification");
const services = require("./../../../services/users/notification");
const logger = require("./../../../config/winstonConfig");
var SocketHelper = require("./../../../libraries/SocketHelper")();
var NotificationHelper = require("./../../../libraries/NotificationHelper")();
var moment = require("moment");

const notificationController = {
  /**
   * notification list
   */
  list: async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let user_id = res.locals.userData.id;
    let user_type = res.locals.userData.user_type;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      let data = {
        limit,
        offset,
        user_id,
        user_type,
        order,
        direction,
      };
      // get all contents form database query
      let result = await services.findAll(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.rows.length <= 0) {
        response.message = constants.NOTIFICATION_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: notificationController.list failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * notification delete
   */
  delete: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    // check validation error
    let validator_result = await validators.delete(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let exist_result = await services.checkExistId(data);
      if (exist_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!exist_result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let result = await services.deleteNotification(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.NOTIFICATION_DELETE_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: notificationController.delete failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * notification read
   */
  read: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    // check validation error
    let validator_result = await validators.delete(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let exist_result = await services.checkExistId(data);
      if (exist_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!exist_result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      let result = await services.readNotification(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.RECORD_UPDATED_SUCCESS;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: notificationController.read failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * auto send notification in evey three days
   */
  autoSendNotification: async (req, res) => {
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let webIds = [];
    let androidIds = [];
    let iphoneIds = [];
    let notificationData = {};
    let user_ids = [];
    let bulkNotification = [];
    try {
      // get all contents form database query
      let result = await services.findAllUsersMoodsNotification();

      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }

      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }

      let title = constants.MOOD_TITLE;
      let message = constants.MOOD_MESSAGE;

      notificationData.title = title;
      notificationData.message = message;
      notificationData.type = "moods";
      notificationData.click_action = "";
      notificationData.sender_type = "admin";

      result.forEach(element => {
        notificationData.id = element.id;

        bulkNotification.push({
          user_id: element.id,
          title: title,
          message: message,
          type: "moods"
        });

        if (element.device_type == "web") {
          webIds.push(element.notification_key);
        }

        if (element.device_type == "android") {
          androidIds.push(element.notification_key);
        }

        if (element.device_type == "iOS") {
          iphoneIds.push(element.notification_key);
        }
      }); // End forEach loop.

      if (webIds.length > 0) {
        notificationData.device_type = "web";
        NotificationHelper.mutipleNotification(
          webIds,
          notificationData,
          function (notificationResponse) {
            console.log(
              "Web Notification Response: ",
              notificationResponse
            );
          }
        );
      }

      if (androidIds.length > 0) {
        notificationData.device_type = "android";
        NotificationHelper.mutipleNotification(
          androidIds,
          notificationData,
          function (notificationResponse) {
            console.log(
              "Android Notification Response: ",
              notificationResponse
            );
          }
        );
      }

      if (iphoneIds.length > 0) {
        notificationData.device_type = "iOS";
        NotificationHelper.mutipleNotification(
          iphoneIds,
          notificationData,
          function (notificationResponse) {
            console.log(
              "Iphone Notification Response: ",
              notificationResponse
            );
          }
        );
      }

      // bulk insert notification
      let insertNotification = await services.insertBulkNotification(
        bulkNotification
      );

      // add content data to response as result
      response.message = constants.NOTIFICATION_SENT_SUCCSESFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: notificationController.send auto notification failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = notificationController;
