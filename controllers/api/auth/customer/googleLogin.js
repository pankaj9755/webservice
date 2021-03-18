const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../../libraries/jwtHelper');
require("dotenv").config();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

googleLogin = (req, res) => {
  	var token = req.body.token ? req.body.token : "";
  	var response = {};
 
  	if (token == "") {
    	response.message = constants.GOOGLE_TOKEN_VALIDATION;
    	return res.status(constants.VALIDATION_STATUS_CODE).json(response);
  	}
	// verify token from google 
  	client.verifyIdToken({
      	idToken: token,
      	audience:  process.env.GOOGLE_CLIENT_ID,   // Specify the CLIENT_ID of the app that accesses the backend
      	// Or, if multiple clients access the backend:
      	//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  	}).then((ticket) => {
	  	const payload = ticket.getPayload();
	  	const social_key = payload['sub'];
	  	const user_email = UtilityHelper.encrypted(payload['email']).toLowerCase();
	  	const user_name = payload['name'];
	  	var user_first_name = payload['given_name'];
	  	var user_last_name = payload['family_name'];
	  	if(payload['aud']!=process.env.GOOGLE_CLIENT_ID){
		  	response.statusCode = 400;
    	  	response.msg = constants.GOOGLE_TOKEN_INVALID;
          	//res.statusCode = 400;
          	return res.send(response);
	  	}
	  
	  
	  	  
	  	response.sresult = {
							email : payload['email'],
							first_name : user_first_name,
							last_name : user_last_name,
							id : social_key
						};
		// check social key exist or not in system
		let selectSql = "SELECT * FROM users_master WHERE (social_key = :social_key) AND social_type='google' AND deleted_at is null ";
		  
		dbConnection.query(selectSql, { 
			type: dbConnection.QueryTypes.SELECT,
			replacements: {social_key: social_key}
		}).then(function(userInfo) {
			if(userInfo.length>0){
				// account was inactive mode
				if(userInfo[0].status!="active"){
					response.statusCode = 400;
					response.msg = constants.ACCOUNT_INACTIVE;
					//res.statusCode = 400;
					return res.send(response);
				}
				userInfo[0].email = UtilityHelper.decrypted(userInfo[0].email);
				userInfo[0].mobile_number = UtilityHelper.decrypted(userInfo[0].mobile_number);
				if(userInfo[0].kin_number != "" && userInfo[0].kin_number != null && userInfo[0].kin_number != 0){
					userInfo[0].kin_number = UtilityHelper.decrypted(userInfo[0].kin_number);
				}
				jwtHelper.JWTSighing({
					'id':userInfo[0].id,
					'first_name':userInfo[0].first_name,
					'last_name':userInfo[0].last_name,
					'email':userInfo[0].email,
					'mobile_number':userInfo[0].mobile_number,
					'user_type':userInfo[0].user_type,
					'kin_name':userInfo[0].kin_name,
					'kin_number':userInfo[0].kin_number,
					'referral_code':userInfo[0].referral_code,
					'group_code':userInfo[0].used_group_code,
					'used_group_code':userInfo[0].used_group_code,
					
				}).then(function(JWTresult){
					if(JWTresult.status){
						userInfo[0].token = JWTresult.token;
						
						if(req.body.notification_key != "" && req.body.notification_key != undefined){

                            let selectNotificationSql = "Select * From user_notification_keys where user_id = '"+userInfo[0].id+"'";

                            dbConnection.query(selectNotificationSql, { 
                                type: dbConnection.QueryTypes.SELECT,
                            }).then(function(notificationExist) {

                                if(notificationExist.length>0){

                                    let UpdateSql = "UPDATE user_notification_keys SET notification_key = :notification_key Where user_id = '"+userInfo[0].id+"'";

                                    dbConnection.query(UpdateSql, {
                                        type: dbConnection.QueryTypes.UPDATE,
                                        replacements: {
                                            notification_key:req.body.notification_key,
                                        }
                                    }).then(function(update_result) {
                                    });
                                     // deleted if notification id is assgin 
										let delteNotiSql=  "DELETE FROM user_notification_keys WHERE user_id !=:user_id AND notification_key = :notification_key ";
										dbConnection.query(delteNotiSql, {
											type: dbConnection.QueryTypes.DELETE,
											replacements: {
												notification_key:req.body.notification_key,
												user_id:userInfo[0].id
											}
									})
                                }else{

                                    let InsertNotificationeSql = "INSERT into user_notification_keys SET user_id = :user_id, device_type = :device_type, user_type = :user_type, notification_key = :notification_key";

                                    dbConnection.query(InsertNotificationeSql, {
                                        type: dbConnection.QueryTypes.UPDATE,
                                        replacements: {user_id: userInfo[0].id,
                                            device_type: 'web',
                                            user_type: userInfo[0].user_type,
                                            //device_key: req.body.device_key,
                                            notification_key:req.body.notification_key,
                                        }
                                    }).then(function(insert_result) {
                                    });
                                     // deleted if notification id is assgin 
										let delteNotiSql=  "DELETE FROM user_notification_keys WHERE user_id !=:user_id AND notification_key = :notification_key ";
										dbConnection.query(delteNotiSql, {
											type: dbConnection.QueryTypes.DELETE,
											replacements: {
												notification_key:req.body.notification_key,
												user_id:userInfo[0].id
											}
									})
                                }
                            });
                        }
						
						response.statusCode = 200;
						response.msg = constants.LOGIN_SUCCESSFULLY;
						response.result = userInfo[0];
						res.statusCode = 200;
						return res.send(response);
					}else{
						response.statusCode = 400;
						response.msg = constants.SOMETHING_WENT_WRONG;                        
						//res.statusCode = 400;
						return res.send(response);
					}
				})
			}else{
				// if social key not exit then check mail 	
				let selectSql = "SELECT * FROM users_master WHERE (email = :user_email) AND deleted_at is null ";
					 dbConnection.query(selectSql, { 
							type: dbConnection.QueryTypes.SELECT,
							replacements: {user_email: user_email}
						}).then(function(userInfo) {
							if(userInfo.length>0){
								// account was inactive mode
								if(userInfo[0].status!="active"){
									response.statusCode = 400;
									response.msg = constants.ACCOUNT_INACTIVE;
									//res.statusCode = 400;
									return res.send(response);
								}
								// assign social key if email is matced
								 var updateSql = "UPDATE users_master SET social_key='" + social_key + "',social_type='google' WHERE id = '" + userInfo[0].id + "'";
								dbConnection.query(updateSql, { type: dbConnection.QueryTypes.UPDATE });
								userInfo[0].email = UtilityHelper.decrypted(userInfo[0].email);
								userInfo[0].mobile_number = UtilityHelper.decrypted(userInfo[0].mobile_number);
								if(userInfo[0].kin_number != "" && userInfo[0].kin_number != null && userInfo[0].kin_number != 0){
									userInfo[0].kin_number = UtilityHelper.decrypted(userInfo[0].kin_number);
								}
								
								jwtHelper.JWTSighing({
									'id':userInfo[0].id,
									'first_name':userInfo[0].first_name,
									'last_name':userInfo[0].last_name,
									'email':userInfo[0].email,
									'mobile_number':userInfo[0].mobile_number,
									'user_type':userInfo[0].user_type,
									'kin_name':userInfo[0].kin_name,
									'kin_number':userInfo[0].kin_number,
									'referral_code':userInfo[0].referral_code,
									'group_code':userInfo[0].used_group_code,
									'used_group_code':userInfo[0].used_group_code,
								}).then(function(JWTresult){
									if(JWTresult.status){
										userInfo[0].token = JWTresult.token;
										//response.msg = constants.MOBILE_VERIFY_SUCCESS;
										response.statusCode = 200;
										response.msg = constants.LOGIN_SUCCESSFULLY;
										response.result = userInfo[0];
										res.statusCode = 200;
										return res.send(response);
									}else{
										response.statusCode = 400;
										response.msg = constants.SOMETHING_WENT_WRONG;    
										response.here = 1;                         
										//res.statusCode = 400;
										return res.send(response);
									}
								})
								
							}else{
								response.statusCode = 200;
								response.result = [];
								response.msg = constants.SOMETHING_WENT_WRONG;  
								//res.statusCode = 400;
								return res.send(response);
							}
							
					});
				
					
				}
				
			});



      });// end  got toekn
	    
	
  
}
module.exports = googleLogin;
