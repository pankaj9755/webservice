// Get single video plan record.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

GetVideoPlan = (req, res) => {
	var response = {};
	var plan_id = req.query.id ? req.query.id : "";

	if (plan_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var query = "SELECT * FROM video_plan WHERE id = :id";
	dbConnection.query(query, { replacements: { id: plan_id }, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = "Video plan details.";
		response.result = result[0];
		res.send(response);
	})
	.catch(err => {
		console.error("Error into get_video_plan_details.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = GetVideoPlan;