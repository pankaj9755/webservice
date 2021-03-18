// Edit question.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

EditConfiguration = (req, res) => {
	var response = {};
	var id = req.body.id ? req.body.id : "";
	var commission = req.body.commission ? req.body.commission : "";
	var referral_discount = req.body.referral_discount ? req.body.referral_discount : "";

	if (id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}
	
	if (commission == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.COMMISSION_VALIDATION;
		res.send(response);
	}

	if (referral_discount == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.REFERRAL_DISCOUNT_VALIDATION;
		res.send(response);
	}

	var data = { commission: commission, referral_discount: referral_discount, id: id };

	var query = "UPDATE setting SET commission=:commission, referral_discount=:referral_discount WHERE id=:id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		// console.log(result);
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.EDIT_CONFIGURATION;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_configuration.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = EditConfiguration;