// Create new promo code.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require('moment');

AddPromoCode = (req, res) => {
	var response = {};
	var title = req.body.title ? req.body.title : "";
	var code = req.body.code ? req.body.code : "";
	var minimum_price = req.body.minimum_price ? req.body.minimum_price : "";
	var maximum_discount = req.body.maximum_discount ? req.body.maximum_discount : "";
	var discount_type = req.body.discount_type ? req.body.discount_type : "";
	var discount_amount = req.body.discount_amount ? req.body.discount_amount : "";
	var valid_from = req.body.valid_from ? req.body.valid_from : "";
	var valid_till = req.body.valid_till ? req.body.valid_till : "";
	var max_uses = req.body.max_uses ? req.body.max_uses : "";
	var max_uses_per_person = req.body.max_uses_per_person ? req.body.max_uses_per_person : "";

	if (title == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.TITLE_VALIDATION;
		res.send(response);
	}

	if (code == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.CODE_VALIDATION;
		res.send(response);
	}

	/*if (minimum_price == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.MIN_PRICE_VALIDATION;
		res.send(response);
	}

	if (maximum_discount == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.MAX_DISCOUNT_VALIDATION;
		res.send(response);
	}*/

	if (discount_type == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.DISCOUNT_TYPE_VALIDATION;
		res.send(response);
	}

	if (discount_amount == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.DISCOUNT_AMT_VALIDATION;
		res.send(response);
	}

	if (valid_from == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.VALID_FROM_VALIDATION;
		res.send(response);
	}

	if (valid_till == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.VALID_TILL_VALIDATION;
		res.send(response);
	}

	if (max_uses == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.MAX_USES_VALIDATION;
		res.send(response);
	}

	if (max_uses_per_person == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.MAX_USES_PER_PERSON_VALIDATION;
		res.send(response);
	}

	valid_from = valid_from.concat(" 00:00:00");
	valid_till = valid_till.concat(" 11:59:00");

	var data = { title: title, code: code, minimum_amount: minimum_price, discount_type: discount_type, discount_amount: discount_amount, valid_from: moment(new Date(valid_from)).format('YYYY-MM-DD HH:mm:ss'), valid_till: moment(new Date(valid_till)).format('YYYY-MM-DD HH:mm:ss'), max_uses: max_uses, max_uses_per_person: max_uses_per_person, uses_count: 0 };

	//var query = "INSERT INTO promocode(title, code, minimum_amount, discount_type, discount_amount, valid_from, valid_till, max_uses, max_uses_per_person, uses_count) VALUES (:title, :code, :minimum_amount, :discount_type, :discount_amount, :valid_from, :valid_till, :max_uses, :max_uses_per_person, :uses_count)";

	var query = "INSERT INTO promocode(title, code, discount_type, discount_amount, valid_from, valid_till, max_uses, max_uses_per_person, uses_count) VALUES (:title, :code, :discount_type, :discount_amount, :valid_from, :valid_till, :max_uses, :max_uses_per_person, :uses_count)";

	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = constants.ADD_PROMO_CODE;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into add_promo_code.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = AddPromoCode;