// List of Group-Code.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require('moment');

GroupCodeList = (req, res) => {
	var response = {};
	let data = {};
	let promises = [];
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var status = req.query.status ? req.query.status : "";
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, status: status, search_value: search_value };
	var replacements_cnt = { status: status, search_value: search_value };

	var query = "SELECT * FROM group_code WHERE deleted_at IS NULL";
	var que_cnt = "SELECT COUNT(*) AS total FROM group_code WHERE deleted_at IS NULL";
	
	if (status != "") {
		query += " AND status = :status";
		que_cnt += " AND status = :status";
	}

	if (search_value != "") {
		query += " AND code LIKE '%"+ search_value +"%'";
		que_cnt += " AND code LIKE '%"+ search_value +"%'";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";
	query1 = "SELECT group_code, COUNT(*) AS usage_count FROM requests WHERE status IN ('pending','wip','completed') GROUP BY group_code";

	promises.push(
		dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT, replacements: replacements })
        .then(result => {
            if (result.length > 0) {
                data.records = result;
            } else {
                data.records = [];
            }
        }),
        
        dbConnection.query(query1, { type: dbConnection.QueryTypes.SELECT })
        .then(result => {
			data.usage = result;
		}),

        dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
        .then(result => {
            data.count = result[0].total;
        })
	);

    Promise.all(promises)
    .then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		if (data.count > 0) {
			response.status = constants.SUCCESS_STATUS_CODE;
			response.message = "Group-Code List";
		} else {
			response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
			response.message = constants.RECORD_NOT_FOUND;
		}
		response.count = data.count;
		response.result = data.records;
		response.group_code_usage = data.usage;
		res.send(response);
	})
    .catch(err => {
		console.error("Error in group_code_list.js: ", err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = GroupCodeList;
