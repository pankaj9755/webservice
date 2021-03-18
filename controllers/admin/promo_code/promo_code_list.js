// List of Promo-Code.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require('moment');

PromoCodeList = (req, res) => {
	var response = {};
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var status = req.query.status ? req.query.status : "";
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, status: status, search_value: search_value };
	var replacements_cnt = { status: status, search_value: search_value };

	var query = "SELECT id, title, code, uses_count, valid_till, status,max_uses,max_uses_per_person FROM promocode WHERE deleted_at IS NULL";
	var que_cnt = "SELECT COUNT(*) AS total FROM promocode WHERE deleted_at IS NULL";
	const promises = [];
	if (status != "") {
		query += " AND status = :status";
		que_cnt += " AND status = :status";
	}

	if (search_value != "") {
		query += " AND code LIKE '%"+ search_value +"%'";
		que_cnt += " AND code LIKE '%"+ search_value +"%'";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";

	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT, replacements: replacements })
	.then(result => {
		if (result.length > 0) {
			dbConnection.query(que_cnt, { type: dbConnection.QueryTypes.SELECT, replacements: replacements_cnt })
			.then(result_cnt => {
				var data = [];
				result.forEach(function (element) {
					var usedSql = "SELECT COUNT(*) AS total FROM requests WHERE promo_code=:promo_code AND deleted_at IS NULL";
					promises.push(
					dbConnection.query(usedSql, { 
						type: dbConnection.QueryTypes.SELECT,
						replacements: {promo_code:element.code}
					}).then(function(result1) {
						if(result1.length > 0){
							element.uses_count = result1[0].total;
						}
					}))
					//data.push({ id: element.id, title: element.title, code: element.code, uses_count: element.uses_count, valid_till: moment(element.valid_till).format('DD-MM-YYYY'), status: element.status });
				});
				 Promise.all(promises).then(function(result2) {
					 result.forEach(function (element) {
						data.push({ id: element.id, title: element.title, code: element.code, uses_count: element.uses_count,max_uses:element.max_uses,max_uses_per_person:element.max_uses_per_person, valid_till: moment(element.valid_till).format('DD-MM-YYYY'), status: element.status });
					});
					 
					res.statusCode = constants.SUCCESS_STATUS_CODE;
					response.count = result_cnt[0].total;
					response.status = constants.SUCCESS_STATUS_CODE;
					response.message = "Promo-Code List";
					response.result = data;
					res.send(response);
				})
				
			})
		} else {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
			response.message = constants.RECORD_NOT_FOUND;
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in promo_code_list.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.message = constants.SOMETHING_WENT_WRONG;
		res.send(response);
	});
}
module.exports = PromoCodeList;
