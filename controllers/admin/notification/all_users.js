// Register users list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var UtilityHelper = require("../../../libraries/UtilityHelper")();

UserList = (req, res) => {
	var response = {};
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var user_type = req.query.user_type ? req.query.user_type : "";
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, user_type: user_type, search_value: search_value };
	var replacements_cnt = { user_type: user_type, search_value: search_value };

	var query = "SELECT id, first_name, last_name, mobile_number, user_type, CONCAT(UCASE(LEFT(first_name, 1)), SUBSTRING(first_name, 2), ' ', UCASE(LEFT(last_name, 1)), SUBSTRING(last_name, 2)) AS fullname FROM users_master WHERE deleted_at IS NULL";

	var que_cnt = "SELECT id, first_name, last_name, mobile_number, user_type, CONCAT(UCASE(LEFT(first_name, 1)), SUBSTRING(first_name, 2), ' ', UCASE(LEFT(last_name, 1)), SUBSTRING(last_name, 2)) AS fullname FROM users_master WHERE deleted_at IS NULL";

	if (user_type != "") {
		query += " AND user_type = :user_type";
		que_cnt += " AND user_type = :user_type";
	}

	if (search_value != "") {
		query += " HAVING (first_name LIKE '%"+ search_value +"%' OR last_name LIKE '%"+ search_value +"%' OR fullname LIKE '%"+ search_value +"%')";
		que_cnt += " HAVING (first_name LIKE '%"+ search_value +"%' OR last_name LIKE '%"+ search_value +"%' OR fullname LIKE '%"+ search_value +"%')";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";
	
	dbConnection.query(query, { replacements: replacements, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
			.then(result_cnt => {
				var data = [];
				var all_data = []
				result.forEach(function (element) {
					data.push({ id: element.id, fullname: element.fullname, mobile_number: UtilityHelper.decrypted(element.mobile_number),user_type:element.user_type });
				});

				result_cnt.forEach(function (element) {
					all_data.push({ id: element.id, fullname: element.fullname, mobile_number: UtilityHelper.decrypted(element.mobile_number),user_type:element.user_type });
				});

				res.statusCode = constants.SUCCESS_STATUS_CODE;
				response.count = result_cnt.length;
				response.all_data = all_data;
				response.status = constants.SUCCESS_STATUS_CODE;
				response.message = "Users List";
				response.result = data;
				res.send(response);
			});
		} else {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
			response.message = constants.RECORD_NOT_FOUND;
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in all_users.js "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = UserList;