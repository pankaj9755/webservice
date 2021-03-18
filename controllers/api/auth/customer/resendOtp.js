const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
var SmsHelper =  require('./../../../../libraries/SmsHelper')();

resend = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	mobile_number:req.body.mobile_number,
    	email:req.body.email,
    	password:req.body.password,
    };
    /*const rules = {
        mobile_number: 'required',
        email: 'required',
        password: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        res.send(response);
    }else{*/
        var mobile_number = res.locals.userData.mobile_number;
        var password1 = res.locals.userData.password;
        var email = res.locals.userData.email;

    	let password = md5(password1);
    	let EncrytedEmail = UtilityHelper.encrypted(email);
    	let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);

    	let code = Math.floor(1000 + Math.random() * 9000);
		let checkAlreadyExistEntry = "Select * From users_temp where email = :email or mobile_number = :mobile_number";

		dbConnection.query(checkAlreadyExistEntry, { 
			type: dbConnection.QueryTypes.SELECT,
			replacements: {email: EncrytedEmail,mobile_number: Encryted_mobile_number,}
    	}).then(function(isExist) {
			
			// send SMS to customer
			var smsOption = {
							body: 'Welcome to Skyed your verification code is '+code,
							to: "+27"+mobile_number,
							
						};
			SmsHelper.sendSMS(smsOption, function(mailResutl) {	
			});
			
			
    		let updateSql = "Update users_temp set code = :code ,password = :password, email = :email, mobile_number = :mobile_number where id = '"+isExist[0].id+"'"
			dbConnection.query(updateSql, {type: dbConnection.QueryTypes.UPDATE,
				replacements: {
					email: EncrytedEmail,
					mobile_number: Encryted_mobile_number,
					password: password,
					code:code
				}
			}).then(function(result1) {
				response.msg = constants.REGISTRATION_SUCCESS;
	            res.statusCode = 200;
                response.code = code;
	            res.send(response);
				
			}).catch(function(err) {
                res.statusCode = 500;
                res.msg = err;
                console.log(err);
                res.send(response);
            });
    	})
    //}
}
module.exports = resend;
