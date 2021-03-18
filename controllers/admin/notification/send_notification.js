// Send Notification to user.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var NotificationHelper = require("../../../libraries/NotificationHelper")();
var SocketHelper = require("../../../libraries/SocketHelper")();

var SendNotification = (req, res) => {
  var response = {};
  var receivers = req.body.id ? req.body.id : [];
  var title = req.body.title ? req.body.title : "";
  var message = req.body.message ? req.body.message : "";

  if (receivers.length == 0) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    res.send(response);
  }

  if (title == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TITLE_VALIDATION;
    res.send(response);
  }

  if (message == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.MESSAGE_VALIDATION;
    res.send(response);
  }

  //if(receivers.length == 1){

  var dataNew = { title: title, message: message };
  var querySql =
    "INSERT INTO admin_notifications(title, message) VALUES (:title, :message)";
  dbConnection
    .query(querySql, {
      replacements: dataNew,
      type: dbConnection.QueryTypes.INSERT,
    })
    .then(function (result) {
      var id_array = [];
      receivers.forEach(function (element) {
        id_array.push(element.id);

        var data = {
          user_id: element.id,
          title: title,
          message: message,
          notification_id: result[0],
        };
        var query1 =
          "INSERT INTO notifications(user_id, title, message,notification_id) VALUES (:user_id, :title, :message, :notification_id)";
        dbConnection.query(query1, {
          replacements: data,
          type: dbConnection.QueryTypes.INSERT,
        });
      });
      //}

      // Store notification data into database.
      /*var id_array = [];
	receivers.forEach(function (element) {
		id_array.push(element.id);*/
      //console.log("userType: ", element.userType);
      /*var uType = "";
		if (element.userType === "customer") {
			uType = "detail";
		}
		if (element.userType === "therapist") {
			uType = "therapist_detail";
		}

		if(req.body.userType == "therapist_detail"){
			uType = "therapist_detail";
		}

		if(req.body.userType == "customer"){
			uType = "detail";
		}

		var data = { user_id: element.id, title: title, message: message, notification_type: uType };
		var query1 = "INSERT INTO notifications(user_id, title, message, type) VALUES (:user_id, :title, :message, :notification_type)";*/

      /*var data = { user_id: element.id, title: title, message: message};
		var query1 = "INSERT INTO notifications(user_id, title, message) VALUES (:user_id, :title, :message)";
		dbConnection.query(query1, { replacements: data, type: dbConnection.QueryTypes.INSERT });
	});*/

      // Send notification to user.
      var query2 =
        "SELECT id, notification_key, device_type FROM users_master WHERE id IN (:id)";
      dbConnection
        .query(query2, {
          replacements: { id: id_array },
          type: dbConnection.QueryTypes.SELECT,
        })
        .then((result) => {
          var notificationData = {};
          notificationData.id = "";
          notificationData.title = title;
          notificationData.message = message;
          notificationData.type = "admin";

          var webIds = [];
          var androidIds = [];
          var iphoneIds = [];

          result.forEach(function (element) {
            console.log(element)
            if (element.device_type == "web") {
              webIds.push(element.notification_key);
            }
            if (element.device_type == "android") {
              androidIds.push(element.notification_key);
            }
            if (element.device_type == "iOS") {
              iphoneIds.push(element.notification_key);
            }
          });

          var socketOption = {
            type: "admin",
            show_message: message,
            title: title,
            is_success: "yes",
            is_admin_inform: "yes",
            sender_type: "admin",
          };

          iphoneIds;
          SocketHelper.multipleUserInform(socketOption, id_array, function (
            info
          ) {});

          if (webIds.length > 0) {
            notificationData.device_type = "web";
            console.log("webIds", webIds);
            console.log("notificationData", notificationData);
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
            console.log('55555555555555555555555555555555555555555555555555')
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
        })
        .catch((err) => {
          console.error("Error in send_notification.js " + err);
          res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
          response.message = constants.SOMETHING_WENT_WRONG;
          res.send(response);
        });

      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.NOTIFICATION_SUCCESS;
      res.send(response);
    });
};
module.exports = SendNotification;
