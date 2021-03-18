// Register therapist list.
const constants = require('./../../../config/adminConstants');
const dbConnection = require('./../../../config/connection');

TherapistList = (req, res) => {
	var response = {};

	var query = "SELECT id, CONCAT(first_name, ' ', last_name) AS fullname FROM users_master WHERE user_type = 'therapist' AND deleted_at IS NULL";
  	
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.SUCCESS_STATUS_CODE;
			response.message = "Therapist List";
			response.result = result;
			res.send(response);
		} else {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
			response.message = constants.RECORD_NOT_FOUND;
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in all_therapist.js "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = TherapistList;
