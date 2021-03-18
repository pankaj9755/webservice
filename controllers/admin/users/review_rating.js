// Therapist reviews and rating given by customers.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require('moment');

ReviewsRatings = (req, res) => {
	var response = {};
	var therapist_id = req.query.therapist_id ? req.query.therapist_id : "";
	var data = {};
	var promises = [];

	if (therapist_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var query1 = "SELECT rat_tbl.*, CONCAT(UCASE(LEFT(user_tbl.first_name, 1)), SUBSTRING(user_tbl.first_name, 2), ' ', UCASE(LEFT(user_tbl.last_name, 1)), SUBSTRING(user_tbl.last_name, 2)) AS customer_name, user_tbl.profile_image FROM ratings AS rat_tbl LEFT JOIN users_master AS user_tbl ON rat_tbl.customer_id = user_tbl.id WHERE rat_tbl.therapist_id = :id AND rat_tbl.deleted_at IS NULL";

	var query2 = "SELECT AVG(rating) AS avreage_rating FROM ratings WHERE therapist_id= :id";

	promises.push(
		dbConnection.query(query1, { replacements: { id: therapist_id }, type: dbConnection.QueryTypes.SELECT })
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
		})
		.catch(err => {
			console.error("Error in review_rating.js into query1"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		dbConnection.query(query2, { replacements: { id: therapist_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.avg_rating = result[0].avreage_rating;
			data.avg_rating_stars = parseFloat(result[0].avreage_rating)/5*100;
		})
		.catch(err => {
			console.error("Error in review_rating.js into query2"+ err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		})
	);

	Promise.all(promises).then(function (result) {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = "Reviews data.";
		response.result = data;
		res.send(response);
	});
}
module.exports = ReviewsRatings;