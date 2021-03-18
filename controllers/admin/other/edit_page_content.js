// Save edit content.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

EditPageContent = (req, res) => {
	var response = {};
	var page_id = req.body.id ? req.body.id : "";
	var title = req.body.title ? req.body.title : "";
	var content = req.body.content ? req.body.content : "";

	if (page_id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (title == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.TITLE_VALIDATION;
		res.send(response);
	}

	if (content == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.CONTENT_VALIDATION;
		res.send(response);
	}

	var query = "UPDATE pages SET title= :title, content= :content WHERE id = :id";
	dbConnection.query(query, { replacements: { id: page_id, title: title, content: content }, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.EDIT_CONTENT_SUCCESS;
		response.result = result[0];
		res.send(response);
	})
	.catch(err => {
		console.error("Error in edit_page_content.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = EditPageContent;