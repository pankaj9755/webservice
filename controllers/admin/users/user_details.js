// User details.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var UtilityHelper = require("../../../libraries/UtilityHelper")();
// var moment = require('moment-timezone');
var moment = require('moment');
// require('mongodb-moment')(moment);

UserDetails = (req, res) => {
	var response = {};
	var data = {};
	var promises = [];
	var user_id = req.body.id ? req.body.id : "";

	if (user_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var query1 = "SELECT id, first_name, last_name, email, mobile_number, address, profile_image, status, about_me, qualification, years_experience,therapy_type, hpcsa_no, created_at, kin_name, kin_number FROM users_master WHERE id = :id";
	var query2 = "SELECT rat_tbl.*, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS customer_name, user_tbl.profile_image FROM ratings AS rat_tbl LEFT JOIN users_master AS user_tbl ON rat_tbl.customer_id = user_tbl.id WHERE rat_tbl.therapist_id = :id AND rat_tbl.deleted_at IS NULL"
	var query3 = "SELECT AVG(rating) AS avreage_rating FROM ratings WHERE therapist_id= :id";
	var query4 = "SELECT name FROM specialties WHERE therapist_id= :id";

	var query5 = "SELECT * FROM therapist_schedule WHERE therapist_id= :id ORDER BY day_number ASC;";
	var query6 = "SELECT * FROM bank_info WHERE user_id= :id";

	promises.push(
		// Basic information of user.
		dbConnection.query(query1, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			info = {};
			result.forEach(function (element) {
				info.id = element.id;
				info.first_name = element.first_name;
				info.last_name = element.last_name;
				info.email = UtilityHelper.decrypted(element.email);
				info.mobile_number = UtilityHelper.decrypted(element.mobile_number);
				info.address = element.address;
				info.image = element.profile_image;
				info.status = element.status;
				info.therapy_type = element.therapy_type;
				info.created_at = moment(element.created_at).format('DD-MM-YYYY');
				info.about_me = element.about_me;
				if(element.hpcsa_no != null && element.hpcsa_no != ""){
					info.hpcsa_no = element.hpcsa_no;
				}else{
					info.hpcsa_no = "";
				}				
				info.qualification = JSON.parse(element.qualification);
				info.years_experience = element.years_experience;
				info.kin_name = element.kin_name ? element.kin_name : '';
				info.kin_number = element.kin_number ? UtilityHelper.decrypted(element.kin_number) : '';
			});
			data.details = info;
		}).catch(err => {
			console.error("Error into query1 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		// Reviews and ratings of therapist.
		dbConnection.query(query2, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			var reviewsData = [];
			if (result.length > 0) {
				result.forEach(function (element) {
					reviewsData.push({ customer_id: element.customer_id, customer_name: element.customer_name, profile_image: element.profile_image, rating: parseFloat(element.rating), ratingWidth: parseFloat(element.rating)/5*100, review: element.review, created_at: moment(element.created_at).format('DD-MM-YYYY') });
				});
				data.review = reviewsData;
			} else {
				data.review = reviewsData;
			}
		}).catch(err => {
			console.error("Error into query2 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		// Avrage rating of therapist.
		dbConnection.query(query3, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.avg_rating = result[0].avreage_rating ? result[0].avreage_rating : "";
			data.avg_rating_stars = result[0].avreage_rating ? parseFloat(result[0].avreage_rating)/5*100 : "";
		}).catch(err => {
			console.error("Error into query3 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		// Specialties of therapist.
		dbConnection.query(query4, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.specialties = result;
		}).catch(err => {
			console.error("Error into query4 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		// Schedule of therapist.
		dbConnection.query(query5, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			//data.schedule = result;
			
			var scheduleData = [];
			if (result.length > 0) {
				result.forEach(function (element) {					
					scheduleData.push({ id: element.id, therapist_id: element.therapist_id, day_number: element.day_number, open_time: parseFloat(element.open_time), close_time: parseFloat(element.close_time), schedule: JSON.parse(element.schedule), is_open: element.is_open, created_at: moment(element.created_at).format('DD-MM-YYYY') });
				});
				data.schedule = scheduleData;
			} else {
				data.schedule = scheduleData;
			}
			
		}).catch(err => {
			console.error("Error into query5 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),
		// Bank information of therapist.
		dbConnection.query(query6, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			//data.schedule = result;
			
			if (result.length > 0) {
				data.bankInformation = result[0];
			} else {
				data.bankInformation = [];
			}
			
		}).catch(err => {
			console.error("Error into query6 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		})
	);

	Promise.all(promises).then(function (result) {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = "User data.";
		response.result = data;
		res.send(response);
	}).catch(err => {
			console.error("Error into query6 in user_details.js"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		})
}
module.exports = UserDetails;
