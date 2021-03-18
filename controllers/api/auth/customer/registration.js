const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
var SmsHelper =  require('./../../../../libraries/SmsHelper')();
const jwtHelper = require('./../../../../libraries/jwtHelper');
registration = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
        //'statusCode':400
    };

    if(req.body.first_name != "" && req.body.first_name != undefined){
    	const first_name = req.body.first_name;
    }else{
    	const first_name = "";
    }
    if(req.body.last_name != "" && req.body.last_name != undefined){
    	const last_name = req.body.last_name;
    }else{
    	const last_name = "";
    }
    
   
	const password = req.body.password?md5(req.body.password):"";
	const group_code = req.body.group_code?req.body.group_code.toUpperCase():"";
    const data = {
    	mobile_number:req.body.mobile_number,
    	email:req.body.email.toLowerCase(),
    	user_type:req.body.user_type,
    	first_name:req.body.first_name,
    	last_name:req.body.last_name,
    	social_key:req.body.social_key,
    	social_type:req.body.social_type,
    	kin_name:req.body.kin_name,
    	kin_number:req.body.kin_number,
    	used_referral:req.body.used_referral,
    	group_code:req.body.group_code,
    };
	var kin_name = "";
	var Encryted_kin_number = "";
    var kin_number = "";
    if(req.body.kin_name != "" && req.body.kin_name != undefined){
    	 kin_name = req.body.kin_name;
    }
    if(req.body.kin_number != "" && req.body.kin_number != undefined){
      	var kin_number = req.body.kin_number;
    	var Encryted_kin_number = UtilityHelper.encrypted(req.body.kin_number);
    }
    
	        
    const rules = {
        mobile_number: 'required',
        email: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    	
    let TokenExpiryTime = 60*5;
	let EncrytedEmail = UtilityHelper.encrypted(data.email);
	let Encryted_mobile_number = UtilityHelper.encrypted(req.body.mobile_number);
	let checkExistphone = "Select * From users_master where mobile_number = :mobile_number And deleted_at is null";
	let checkExistEmail = "Select * From users_master where email = :email And deleted_at is null";
	
    userReferralExist(data.used_referral,function(reffralExist){	
    			
	if(reffralExist==0){
		response.msg = 'Sorry! Referral code does not exist.';
		response.statusCode = 409;
        res.statusCode = 409;
        return res.send(response);
	}
	userGroupExist(data.group_code,function(groupCodeExist){
		console.log('groupCodeExist==============='+groupCodeExist);
		if(groupCodeExist==0){
		response.msg = 'Sorry! Group code does not exist.';
		response.statusCode = 409;
        res.statusCode = 409;
        return res.send(response);
	}
	if(reffralExist==1 && groupCodeExist==1){
		
		dbConnection.query(checkExistphone, { 
			type: dbConnection.QueryTypes.SELECT,
			replacements: {mobile_number: Encryted_mobile_number}
		}).then(function(result0) {
			if(result0.length > 0){
				res.statusCode = 409;
				response.msg = constants.PHONE_EXIST;
				response.statusCode = 409;
				return res.send(response);
			}
			else{
			dbConnection.query(checkExistEmail, { 
				type: dbConnection.QueryTypes.SELECT,
				replacements: {email: EncrytedEmail}
			}).then(function(result01) {
				if(result01.length > 0){
					response.msg = constants.EMAIL_EXIST;
					response.statusCode = 409;
					res.statusCode = 409;
					return res.send(response);
				}else{
					
					let code = Math.floor(1000 + Math.random() * 9000);
					let checkAlreadyExistEntry = "Select * From users_temp where email = :email or mobile_number = :mobile_number";
					
						jwtHelper.JWTSighing({
							'mobile_number':data.mobile_number,
							'email':data.email,
							'password':password,
							'user_type':data.user_type,
							'first_name':data.first_name,
							'last_name':data.last_name,
							'social_key':data.social_key,
							'social_type':data.social_type,
							'kin_name':kin_name,
							'kin_number':kin_number,
							'group_code':group_code,
							
						},TokenExpiryTime).then(function(tokenInfo){
						dbConnection.query(checkAlreadyExistEntry, { 
							type: dbConnection.QueryTypes.SELECT,
							replacements: {email: EncrytedEmail,mobile_number: Encryted_mobile_number,}
						}).then(function(isExist) {
							
							// send SMS to customer
							var smsOption = {
											body: 'Welcome to Skyed your verification code is '+code,
											to: "+27"+req.body.mobile_number,
										};
							SmsHelper.sendSMS(smsOption, function(mailResutl) {	});
							
							if(isExist.length > 0){
								let updateSql = "Update users_temp set code = :code ,password = :password, email = :email, mobile_number = :mobile_number, kin_name = :kin_name, kin_number= :kin_number where id = '"+isExist[0].id+"'"
								dbConnection.query(updateSql, {type: dbConnection.QueryTypes.UPDATE,
									replacements: {
										//first_name: req.body.first_name,
										//last_name: req.body.last_name,
										email: EncrytedEmail,
										mobile_number: Encryted_mobile_number,
										password: password,
										code:code,
										kin_name:kin_name,
										kin_number:Encryted_kin_number,
									}
								}).then(function(result1) {
									response.msg = constants.REGISTRATION_SUCCESS;
									response.statusCode = 200;
									res.statusCode = 200;
									response.token = tokenInfo.token;
									//response.code = code;				           
									return res.send(response);
									
								}).catch(function(err) {
									res.statusCode = 500;
									res.msg = err;
									console.log(err);
									response.message = err;
									response.statusCode = 500;
									return res.send(response);
								});
							}else{

								let inserSql = "Insert Into users_temp Set "
								inserSql += " email = :email, mobile_number = :mobile_number, password = :password, code = :code, count = 1";

								if(req.body.kin_name != ""){
									inserSql += " ,kin_name = :kin_name "			    				
								}

								if(kin_number != ""){
									inserSql += " ,kin_number = :kin_number "			    				
								}
								
								dbConnection.query(inserSql, { 
									type: dbConnection.QueryTypes.INSERT,
									replacements: {
										//first_name: req.body.first_name,
										//last_name: req.body.last_name,
										email: EncrytedEmail,
										mobile_number: Encryted_mobile_number,
										password: password,
										code:code,
										kin_name:kin_name,
										kin_number:Encryted_kin_number,
									}
								}).then(function(result1) {
									if(result1){
										response.msg = constants.REGISTRATION_SUCCESS;
										response.statusCode = 200;
										res.statusCode = 200;
										response.token = tokenInfo.token;
										//response.code = code;
										return res.send(response);
									}
								}).catch(function(err) {
									res.statusCode = 500;
									response.statusCode = 500;
									response.message = err;
									res.msg = err;
									console.log(err);
									return res.send(response);
								});
							}
						}).catch(function(err) {
							res.statusCode = 500;
							res.msg = err;
							response.message = err;
							response.statusCode = 500;
							console.log(err);
							return res.send(response);
						});
					}) 
				}    
			   //end token	    				    		
			})    		
		}
		}) 
	}  
  })  
  }) 	    
}
module.exports = registration;
// check to referral_code exist
var userReferralExist = function(referralCode,callBack){
	if(referralCode=="" || referralCode==undefined){
		callBack(1);
	}else{
	
		let query = "SELECT id,referral_code FROM users_master WHERE referral_code = '"+referralCode+"' AND deleted_at is null";
		dbConnection.query(query, { 
			type: dbConnection.QueryTypes.SELECT,
		}).then(function(exresult) {
			
			if(exresult.length==0) {
			   callBack(0);                   // use the continuation
			} else {
			  callBack(1);
			}
		});
	}
}
// Check Group Code
var userGroupExist = function(groupCode,callBack){
	console.log('groupCode============'+groupCode);
	if(groupCode=="" || groupCode==undefined){
		callBack(1);
	}else{
	
		let query = "SELECT id FROM group_code WHERE code = '"+groupCode+"' AND status='active' AND deleted_at is null";
		dbConnection.query(query, { 
			type: dbConnection.QueryTypes.SELECT,
		}).then(function(exresult) {
			
			if(exresult.length==0) {
			   callBack(0);                   // use the continuation
			} else {
			  callBack(1);
			}
		});
	}
}
