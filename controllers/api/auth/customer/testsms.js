const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
var SmsHelper =  require('./../../../../libraries/SmsHelper')();

testsms = (req,res) => {
	
	var response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
	
	
	var smsOption = {
				body: '0000 is verification code of Syked account.',
				to: "+270748591383",
							
		};
		SmsHelper.sendSMS(smsOption, function(mailResutl) {	
	});
			
    response.msg = constants.REGISTRATION_SUCCESS;
	res.statusCode = 200;
	response.code = 0000;
	res.send(response);
    //}
}
module.exports = testsms;
