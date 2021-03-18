// Delete question.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require("moment");

DeleteNotification = (req, res) => {
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
	
	var query = "UPDATE notifications SET deleted_at= :deleted_at WHERE id=:id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.DELETE_NOTIFICATION;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into delete_notification.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = DeleteNotification;