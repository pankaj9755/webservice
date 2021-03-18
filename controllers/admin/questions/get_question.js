// Get question.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

GetQuestion = (req, res) => {
	var response = {};
	var question_id = req.query.id ? req.query.id : "";

	if (question_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var query = "SELECT id, question, therapy_type, question_type, options FROM questions WHERE id=:id AND deleted_at IS NULL";
	dbConnection.query(query, { replacements: { id: question_id }, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.SUCCESS_STATUS_CODE;
			response.message = "Questions details.";
			response.result = result[0];
			res.send(response);
		} else {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
			response.message = constants.RECORD_NOT_FOUND;
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in get_question.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = GetQuestion;