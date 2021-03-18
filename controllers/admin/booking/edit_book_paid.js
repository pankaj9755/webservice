// Edit video plans list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

EditBookPaid = (req, res) => {
	var response = {};
	var id = req.body.id ? req.body.id : "";
	// var title = req.body.title ? req.body.title : "";
	// var description = req.body.description ? req.body.description : "";
	// var numberOfMinutes = req.body.numberOfMinutes ? parseFloat(req.body.numberOfMinutes) : "";
	// var price = req.body.price ? parseInt(req.body.price) : "";

	if (id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	// if (title == "") {
	// 	res.statusCode = constants.VALIDATION_STATUS_CODE;
	// 	response.status = constants.VALIDATION_STATUS_CODE;
	// 	response.message = constants.TITLE_VALIDATION;
	// 	res.send(response);
	// }

	// if (description == "") {
	// 	res.statusCode = constants.VALIDATION_STATUS_CODE;
	// 	response.status = constants.VALIDATION_STATUS_CODE;
	// 	response.message = constants.DESCRIPTION_VALIDATION;
	// 	res.send(response);
	// }

	// if (price == "") {
	// 	res.statusCode = constants.VALIDATION_STATUS_CODE;
	// 	response.status = constants.VALIDATION_STATUS_CODE;
	// 	response.message = constants.PRICE_VALIDATION;
	// 	res.send(response);
	// }

	// if (numberOfMinutes == "") {
	// 	res.statusCode = constants.VALIDATION_STATUS_CODE;
	// 	response.status = constants.VALIDATION_STATUS_CODE;
	// 	response.message = constants.MINUTES_VALIDATION;
	// 	res.send(response);
	// }

	//var data = { id: plan_id, title: title, price: price, description: description, number_of_minutes: numberOfMinutes };
    var data ={id:id,therapist_paid:'done'};
    var query = "UPDATE requests SET therapist_paid = :therapist_paid WHERE id = :id";

	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.EDIT_BOOK_PAID;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_book_paid.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = EditBookPaid;