// Change status.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

TherapistProfileStatus = (req, res) => {
	var response = {};
	var id = req.query.id ? req.query.id : "" ;
	var profile_status = req.query.profile_status ? req.query.profile_status : "";

	if (id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (profile_status == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.STATUS_VALIDATION;
		res.send(response);
	}

	var query = "UPDATE users_master SET therapy_profile_status = :profile_status WHERE id = :id AND user_type = 'therapist'";
	dbConnection.query(query, { 
		replacements: { id: id, profile_status: profile_status },
		type: dbConnection.QueryTypes.UPDATE
	})
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.THERAPIST_PROFILE_STATUS.replace("STATUS", profile_status);
		response.result = profile_status;
		res.send(response);
	})
	.catch(err => {
		console.error("Error in change_status.js "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = TherapistProfileStatus;