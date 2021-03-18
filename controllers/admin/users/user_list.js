// Register users list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var UtilityHelper = require("../../../libraries/UtilityHelper")();

UserList = (req, res) => {
	var response = {};
	var limit = req.body.limit ? parseInt(req.body.limit) : 10;
	var offset = req.body.offset ? parseInt(req.body.offset) : 0;
	var status = req.body.status ? req.body.status : "";
	var search_value = req.body.value ? req.body.value : "";
	var search_value_enc = req.body.value ? UtilityHelper.encrypted(req.body.value) : "";

	var replacements = { limit: limit, offset: offset, status: status, search_value: search_value, search_value_enc: search_value_enc };
	var replacements_cnt = { status: status, search_value: search_value, search_value_enc: search_value_enc };

	var query = "SELECT id,used_group_code, first_name, last_name, CONCAT(first_name, ' ', last_name) AS fullname, email, mobile_number, address, profile_image, status,lattitude,longitude FROM users_master WHERE user_type = 'customer' AND deleted_at IS NULL";

	var que_cnt = "SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS fullname, email, mobile_number, address, profile_image, status FROM users_master WHERE user_type = 'customer' AND deleted_at IS NULL";

	if (status != "") {
		query += " AND status = :status";
		que_cnt += " AND status = :status";
	}

	if (search_value != "") {
		query += " HAVING fullname LIKE '%"+search_value+"%'";
		que_cnt += " HAVING fullname LIKE '%"+search_value+"%'";
	}

	if (search_value_enc != "") {
		query += " OR email LIKE '%"+search_value_enc+"%' OR mobile_number LIKE '%"+search_value_enc+"%'";
		que_cnt += " OR email LIKE '%"+search_value_enc+"%' OR mobile_number LIKE '%"+search_value_enc+"%'";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";
	
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT, replacements: replacements })
	.then(result => {
		if (result.length > 0) {
			var total = "";
			dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
			.then(result_cnt => {
				total = result_cnt.length;
				var data = [];
				result.forEach(function (element) {
					data.push({ id: element.id,used_group_code: element.used_group_code, first_name: element.first_name, last_name: element.last_name, email: UtilityHelper.decrypted(element.email), mobile_number: UtilityHelper.decrypted(element.mobile_number), address: element.address, profile_image: element.profile_image, status: element.status,lattitude:element.lattitude,longitude:element.longitude });
				});	// End forEach loop.

				res.statusCode = constants.SUCCESS_STATUS_CODE;
				response.count = total;
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
		console.error("Error in user_list.js "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = UserList;
