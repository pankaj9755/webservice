// Add new question.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

AddQuestion = (req, res) => {
	var response = {};
	var question = req.body.question ? req.body.question : "";
	var therapy_type = req.body.therapy_type ? req.body.therapy_type : "";
	var question_type = req.body.question_type ? req.body.question_type : "";
	var options = req.body.options ? req.body.options : "";
	
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

	var data = { question: question, therapy_type: therapy_type, question_type: question_type, options: opt };

	var query = "INSERT INTO questions(question, therapy_type, question_type, options) VALUES (:question, :therapy_type, :question_type, :options)";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.ADD_QUESTION;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into add_question.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = AddQuestion;