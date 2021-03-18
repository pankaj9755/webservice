// Get all notification.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require("moment");

NotificationList = (req, res) => {
	var response = {};
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var status = req.query.status ? req.query.status : "";
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, status: status, search_value: search_value };
	var replacements_cnt = { status: status, search_value: search_value };

	
	/*var query = "SELECT noti_tbl.*, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS name, user_tbl.user_type AS user_type FROM notifications AS noti_tbl LEFT JOIN users_master AS user_tbl ON noti_tbl.user_id = user_tbl.id WHERE noti_tbl.deleted_at IS NULL";

	var que_cnt = "SELECT noti_tbl.*, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS name, user_tbl.user_type AS user_type FROM notifications AS noti_tbl LEFT JOIN users_master AS user_tbl ON noti_tbl.user_id = user_tbl.id WHERE noti_tbl.deleted_at IS NULL";
	*/	

	var query = "SELECT * FROM admin_notifications WHERE deleted_at IS NULL";
	var que_cnt = "SELECT * FROM admin_notifications WHERE deleted_at IS NULL";

	if (status != "") {
		query += " AND noti_tbl.status = :status";
		que_cnt += " AND noti_tbl.status = :status";
	}

	if (search_value != "") {
		query += " HAVING title LIKE '%"+ search_value +"%' OR message LIKE '%"+ search_value +"%'";
		que_cnt += " HAVING title LIKE '%"+ search_value +"%' OR message LIKE '%"+ search_value +"%'";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";

	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT, replacements: replacements })
	.then(result => {
		if (result.length > 0) {
			dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
			.then(result_cnt => {
				var data = [];
				result.forEach(function (element) {
					//data.push({ id: element.id, user_id: element.user_id, name: element.name, user_type: element.user_type, title: element.title, message: element.message, status: element.status, created_at: moment(element.created_at).format("DD-MM-YYYY") });

					data.push({ id: element.id, title: element.title, message: element.message, created_at: moment(element.created_at).format("DD-MM-YYYY") });
				});

				res.statusCode = constants.SUCCESS_STATUS_CODE;
				response.count = result_cnt.length;
				response.status = constants.SUCCESS_STATUS_CODE;
				response.message = "Notification List";
				response.result = data;
				res.send(response);
			})
		} else {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
			response.message = constants.RECORD_NOT_FOUND;
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in notification_list.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = NotificationList;