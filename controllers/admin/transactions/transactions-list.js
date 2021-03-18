// Transaction list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require('moment');

TransactionList = (req, res) => {
	var response = {};
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var type = req.query.type ? req.query.type : "";
	var status = req.query.status ? req.query.status : "";
	var search_value = req.query.value ? req.query.value : "";
	var start_date = req.query.start_date ? req.query.start_date : "";
	var end_date = req.query.end_date ? req.query.end_date : "";

	var replacements = { limit: limit, offset: offset, type: type, status: status, start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59", search_value: search_value };
	var replacements_cnt = { type: type, status: status, start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59", search_value: search_value };

	var query = "SELECT tra_tbl.*, req_tbl.request_number, req_tbl.customer_id, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS customer_name FROM transaction AS tra_tbl LEFT JOIN requests AS req_tbl ON tra_tbl.request_id = req_tbl.id LEFT JOIN users_master AS user_tbl ON req_tbl.customer_id = user_tbl.id WHERE 1";
	var que_cnt = "SELECT tra_tbl.*, req_tbl.request_number, req_tbl.customer_id, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS customer_name FROM transaction AS tra_tbl LEFT JOIN requests AS req_tbl ON tra_tbl.request_id = req_tbl.id LEFT JOIN users_master AS user_tbl ON req_tbl.customer_id = user_tbl.id WHERE 1";

	if (type != "") {
		query += " AND tra_tbl.type = :type";
		que_cnt += " AND tra_tbl.type = :type";
	}
	
	if (status != "") {
		query += " AND tra_tbl.status = :status";
		que_cnt += " AND tra_tbl.status = :status";
	}

	if (start_date != "") {
		query += " AND tra_tbl.created_at >= :start_date";
		que_cnt += " AND tra_tbl.created_at >= :start_date";
	}

	if (end_date != "") {
		query += " AND tra_tbl.created_at <= :end_date";
		que_cnt += " AND tra_tbl.created_at <= :end_date";
	}

	if (search_value != "") {
		query += " HAVING (tra_tbl.payment_id LIKE '%"+ search_value +"%' OR tra_tbl.amount LIKE '%"+ search_value +"%' OR tra_tbl.fees LIKE '%"+ search_value +"%' OR customer_name LIKE '%"+ search_value +"%')";
		que_cnt += " HAVING (tra_tbl.payment_id LIKE '%"+ search_value +"%' OR tra_tbl.amount LIKE '%"+ search_value +"%' OR tra_tbl.fees LIKE '%"+ search_value +"%' OR customer_name LIKE '%"+ search_value +"%')";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";

	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT, replacements: replacements })
	.then(result => {
		if (result.length > 0) {
			dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
			.then(result_cnt => {
				var data = [];
				result.forEach(function (element) {
					data.push({ id: element.id, payment_id: element.payment_id, request_id: element.request_id, type: element.type, amount: element.amount, fees: element.fees, status: element.status, created_at: moment(element.created_at).format('DD-MM-YYYY'), request_number: element.request_number, customer_id: element.customer_id, customer_name: element.customer_name });
				});
				res.statusCode = constants.SUCCESS_STATUS_CODE;
				response.count = result_cnt.length;
				response.status = constants.SUCCESS_STATUS_CODE;
				response.message = "Transaction List.";
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
		console.error("Error in transactions-list.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = TransactionList;