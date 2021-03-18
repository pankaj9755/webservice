// Booking details.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var UtilityHelper = require("../../../libraries/UtilityHelper")();
var moment = require('moment');

BookingDetail = (req, res) => {
	var response = {};
	var res_data = {};
	var request_id = req.query.id ? req.query.id : "";
	var promises = [];

	if (request_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var query1 = "SELECT req_tbl.*, CONCAT(UCASE(LEFT(user_tbl1.first_name, 1)), SUBSTRING(user_tbl1.first_name, 2), ' ', UCASE(LEFT(user_tbl1.last_name, 1)), SUBSTRING(user_tbl1.last_name, 2)) AS customer_name, user_tbl1.email AS customer_email, user_tbl1.mobile_number AS customer_mob_no, user_tbl1.address AS customer_address, user_tbl1.profile_image AS customer_image, CONCAT(UCASE(LEFT(user_tbl2.first_name, 1)), SUBSTRING(user_tbl2.first_name, 2), ' ', UCASE(LEFT(user_tbl2.last_name, 1)), SUBSTRING(user_tbl2.last_name, 2)) AS therapist_name, user_tbl2.email AS therapist_email, user_tbl2.mobile_number AS therapist_mob_no, user_tbl2.address AS therapist_address, user_tbl2.profile_image AS therapist_image,therapist_paid, uvp_tbl.used_seconds AS video_calling_duration FROM requests AS req_tbl LEFT JOIN users_master AS user_tbl1 ON req_tbl.customer_id = user_tbl1.id LEFT JOIN users_master AS user_tbl2 ON req_tbl.therapist_id = user_tbl2.id LEFT JOIN user_video_plan AS uvp_tbl ON req_tbl.request_number = uvp_tbl.invoice_id WHERE req_tbl.id= :id AND req_tbl.deleted_at IS NULL";

	var query2 = "SELECT * FROM transaction WHERE request_id= :id";

	promises.push(
		dbConnection.query(query1, { replacements: { id: request_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			var data = {};
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

				// var question_answer_info = JSON.parse(element.question_answer);

				data.id = element.id,
				data.request_number = element.request_number,
				data.therapist_id = element.therapist_id,
				data.therapist_name = element.therapist_name,
				data.therapist_email = UtilityHelper.decrypted(element.therapist_email),
				data.therapist_mob_no = UtilityHelper.decrypted(element.therapist_mob_no),
				data.therapist_address = element.therapist_address,
				data.therapist_image = element.therapist_image,
				data.customer_id = element.customer_id,
				data.customer_name = element.customer_name,
				data.customer_email = UtilityHelper.decrypted(element.customer_email),
				data.customer_mob_no = UtilityHelper.decrypted(element.customer_mob_no),
				data.customer_address = element.customer_address,
				data.customer_image = element.customer_image,
				data.therapy_type = therapy_type,
				//data.status = UtilityHelper.ucfirst(element.status, true),
				data.status = element.status,
				data.payment_status = UtilityHelper.ucfirst(element.payment_status, true),
				data.apointment_date = element.apointment_date_time,
				data.question_answer = (element.question_answer != '') ? JSON.parse(element.question_answer) : [],
				data.survey_question = (element.survey_question != '') ? JSON.parse(element.survey_question) : [],
				data.price = element.price,
				data.promo_code = element.promo_code,
				data.group_code = element.group_code,
				data.discount_promo_code = element.discount_promo_code,
				data.therapist_paid = element.therapist_paid,
				data.created_at = moment(element.apointment_date_time).format("DD-MM-YYYY"),
				data.video_calling_duration = secondsToMinutes(parseInt(element.video_calling_duration));
				data.created_by = element.created_by;
			});
			res_data.booking_details = data;
		})
		.catch(err => {
			console.error("Error in booking_details.js query1"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		dbConnection.query(query2, { replacements: { id: request_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			var payment_data = {};
			result.forEach(function (element) {
				payment_data.id = element.id,
				payment_data.payment_id = element.payment_id,
				payment_data.type = element.type,
				payment_data.amount = element.amount,
				payment_data.fees = element.fees,
				payment_data.status = element.status,
				payment_data.created_at = moment(element.created_at).format("DD-MM-YYYY")
			});
			res_data.paymet_details = payment_data;
		})
		.catch(err => {
			console.error("Error in booking_details.js query2"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		})
	);

	Promise.all(promises).then(function (result) {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = "Booking details.";
		response.result = res_data;
		res.send(response);
	});
}
module.exports = BookingDetail;

/** 
 * Convert seconds to hh-mm-ss format.
 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
**/
/*function SecondsTohhmmss(totalSeconds) {
	var hours   = Math.floor(totalSeconds / 3600);
	var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
	var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

	// round seconds
	seconds = Math.round(seconds * 100) / 100

	var result = (hours < 10 ? "0" + hours : hours);
	result += "-" + (minutes < 10 ? "0" + minutes : minutes);
	result += "-" + (seconds  < 10 ? "0" + seconds : seconds);
	return result;
}*/

function secondsToMinutes(totalSeconds) {
	var minutes = Math.floor(totalSeconds / 60);
	var seconds = totalSeconds - minutes * 60;
	if (totalSeconds == 0) {
		var result = "N/A";
	} else {
		var result = (minutes > 0 ? minutes + " minutes " : "");
		result += (seconds > 0 ? seconds + " seconds" : "");
	}
	return result;
}
