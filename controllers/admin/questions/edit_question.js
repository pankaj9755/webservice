// Edit question.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

EditQuestion = (req, res) => {
	var response = {};
	var question_id = req.body.id ? req.body.id : "";
	var question = req.body.question ? req.body.question : "";
	var therapy_type = req.body.therapy_type ? req.body.therapy_type : "";
	var question_type = req.body.question_type ? req.body.question_type : "";
	var options = req.body.options ? req.body.options : "";

	if (question_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}
	
	if (question == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.QUESTION_VALIDATION;
		res.send(response);
	}

	if (therapy_type == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.THERAPY_TYPE_VALIDATION;
		res.send(response);
	}

	if (question_type == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.QUESTION_TYPE_VALIDATION;
		res.send(response);
	}

	if (options == "") {
		var opt = "";
	} else {
		var opt = JSON.stringify([options]);
	}

	var data = { question: question, therapy_type: therapy_type, question_type: question_type, options: opt, id: question_id };

	var query = "UPDATE questions SET question=:question, therapy_type=:therapy_type, question_type=:question_type, options=:options WHERE id=:id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		// console.log(result);
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.EDIT_QUESTION;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_question.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = EditQuestion;