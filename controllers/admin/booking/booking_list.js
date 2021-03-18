// Booking list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var UtilityHelper = require("../../../libraries/UtilityHelper")();
var moment = require('moment');

BookingList = (req, res) => {
	var response = {}
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var status = req.query.status ? req.query.status : "";
	var therapy_type = req.query.therapy_type ? req.query.therapy_type : "";
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, status: status, therapy_type: therapy_type, search_value: "%"+search_value+"%" };
	var replacements_cnt = { status: status, therapy_type: therapy_type, search_value: "%"+search_value+"%" };

	var query = "SELECT req_tbl.*, CONCAT(UCASE(LEFT(user_tbl1.first_name, 1)), SUBSTRING(user_tbl1.first_name, 2), ' ', UCASE(LEFT(user_tbl1.last_name, 1)), SUBSTRING(user_tbl1.last_name, 2)) AS customer_name, CONCAT(UCASE(LEFT(user_tbl2.first_name, 1)), SUBSTRING(user_tbl2.first_name, 2), ' ', UCASE(LEFT(user_tbl2.last_name, 1)), SUBSTRING(user_tbl2.last_name, 2)) AS therapist_name FROM requests AS req_tbl LEFT JOIN users_master AS user_tbl1 ON req_tbl.customer_id = user_tbl1.id LEFT JOIN users_master AS user_tbl2 ON req_tbl.therapist_id = user_tbl2.id WHERE req_tbl.deleted_at IS NULL";
	var que_cnt = "SELECT req_tbl.*, CONCAT(UCASE(LEFT(user_tbl1.first_name, 1)), SUBSTRING(user_tbl1.first_name, 2), ' ', UCASE(LEFT(user_tbl1.last_name, 1)), SUBSTRING(user_tbl1.last_name, 2)) AS customer_name, CONCAT(UCASE(LEFT(user_tbl2.first_name, 1)), SUBSTRING(user_tbl2.first_name, 2), ' ', UCASE(LEFT(user_tbl2.last_name, 1)), SUBSTRING(user_tbl2.last_name, 2)) AS therapist_name FROM requests AS req_tbl LEFT JOIN users_master AS user_tbl1 ON req_tbl.customer_id = user_tbl1.id LEFT JOIN users_master AS user_tbl2 ON req_tbl.therapist_id = user_tbl2.id WHERE req_tbl.deleted_at IS NULL";

	if (status != "") {
		query += " AND req_tbl.status = :status";
		que_cnt += " AND req_tbl.status = :status";
	}
	if(therapy_type == "All"){
		therapy_type = "";
	}
	if (therapy_type != "") {
		query += " AND req_tbl.therapy_type = :therapy_type";
		que_cnt += " AND req_tbl.therapy_type = :therapy_type";
	}

	if (search_value != "") {
		query += " HAVING req_tbl.request_number LIKE :search_value OR customer_name LIKE :search_value OR therapist_name LIKE :search_value";
		que_cnt += " HAVING req_tbl.request_number LIKE :search_value OR customer_name LIKE :search_value OR therapist_name LIKE :search_value";
	}

	query += " ORDER BY req_tbl.apointment_date_time DESC LIMIT :offset, :limit";

	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT, replacements: replacements })
	.then(result => {
		if (result.length > 0) {
			dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
			.then(result_cnt => {
				var data = [];
				result.forEach(function (element) {
					var therapy_type = "";
					switch(element.therapy_type) {
						case "marriage_counseling":
							therapy_type = "Marriage Counseling";
							break;
						case "online_therapy":
							therapy_type = "Online Therapy";
							break;
						case "teen_counseling":
							therapy_type = "Teen Counseling";
							break;
						case "social_worker":
							therapy_type = "Social Worker";
							break;
						case "registered_councillor":
							therapy_type = "Registered Counsellor";
							break;
						case "counselling_psychologist":
							therapy_type = "Counselling Psychologist";
							break;
						case "clinical_psychologist":
							therapy_type = "Clinical Psychologist";
							break;
					}

					data.push({ id: element.id, request_number: element.request_number, therapist_id: element.therapist_id, therapist_name: element.therapist_name, customer_id: element.customer_id, customer_name: element.customer_name, therapy_type: therapy_type, status: element.status, apointment_date_time: element.apointment_date_time, promo_code: element.promo_code, group_code: element.group_code });
				});

				res.statusCode = constants.SUCCESS_STATUS_CODE;
				response.count = result_cnt.length;
				response.status = constants.SUCCESS_STATUS_CODE;
				response.message = "Request List";
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
		console.error("Error in booking_list.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = BookingList;
