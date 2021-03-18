// Booking details.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var UtilityHelper = require("../../../libraries/UtilityHelper")();
var SmsHelper = require("../../../libraries/SmsHelper")();
var moment = require('moment');

callDetail = (req, res) => {
	var response = {};
	var callOption = {};
	var request_id = req.query.request_id ? req.query.request_id : "";
	callOption.room_id = request_id;
	console.log('api callDetail');
	SmsHelper.callDetail(callOption, function(result) {	
		console.log('result',result);
	if (result.length > 0) {
			
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.SUCCESS_STATUS_CODE;
			response.message = "called detail";
			response.result = result;
			res.send(response);
			
		} else {
			res.statusCode = constants.SUCCESS_STATUS_CODE;
			response.status = constants.SUCCESS_STATUS_CODE;
			response.result = {};
			response.message = "no called called detail";
			res.send(response);
		}
	});
	
}
module.exports = callDetail;
