// Get all pages.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

GetPages = (req, res) => {
	var response = {};
	var query = "SELECT * FROM pages";
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.SUCCESS_STATUS_CODE;
			response.message = "All pages.";
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
		console.error("Error in get_pages.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = GetPages;