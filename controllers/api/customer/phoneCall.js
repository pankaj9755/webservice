var SmsHelper =  require('./../../../libraries/SmsHelper')();

phoneCall = (req,res) => {
	const response = {
        'msg': 'adadsad'
    };
	var smsOption = {};
			SmsHelper.phoneCall(smsOption, function(call) {	
				console.log('phone call===================');
				res.statusCode = 200;
				response.result = call.result;
				response.msg = 'called';
				res.send(response);
			});
	
	
}
module.exports = phoneCall;

