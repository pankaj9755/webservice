// Delete question.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require("moment");

UserNotification = (req, res) => {
	var response = {};
	var notification_id = req.body.id ? req.body.id : "";

	if (notification_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	// Current date.
	var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
	var data = { deleted_at: datetime, id: notification_id };

	var query = "SELECT noti_tbl.*, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS name, user_tbl.user_type AS user_type FROM notifications AS noti_tbl LEFT JOIN users_master AS user_tbl ON noti_tbl.user_id = user_tbl.id WHERE noti_tbl.notification_id='"+req.body.id+"'";
	
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {

		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = "User Info";
		response.result = result;
		res.send(response);
	}).catch(err => {
		console.error("Error into delete_notification.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = UserNotification;