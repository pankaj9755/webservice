const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../../libraries/jwtHelper');

login = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	user_name:req.body.user_name.toLowerCase(),
    	password:req.body.password,
    };
    const rules = {user_name: 'required',password: 'required'};
     var mob = UtilityHelper.encrypted('0722652087');
   console.log('asada',mob);
    const validation = new Validator(data,rules);
    if(validation.fails()){
        response.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        res.send(response);
    }else{
        //let selectSql = "Select users_master.*,user_video_plan.seconds,user_video_plan.used_seconds,user_video_plan.id as video_plan_id From users_master LEFT JOIN user_video_plan ON users_master.id = user_video_plan.user_id AND user_video_plan.status = 'active' ";
       // selectSql += " where (users_master.email = :credentials or users_master.mobile_number = :credentials) And users_master.password = :password AND users_master.deleted_at is null";
    	let selectSql = "Select * FROM users_master WHERE (email = :credentials or mobile_number = :credentials) AND password = :password AND users_master.deleted_at is null ";
    	let credentials = UtilityHelper.encrypted(data.user_name);
    	let password = md5(req.body.password);
    	dbConnection.query(selectSql, { 
			type: dbConnection.QueryTypes.SELECT,
			replacements: {credentials: credentials,password:password}
    	}).then(function(result0) {
    		if(result0.length > 0){

                if(result0[0].status == "inactive"){
                    response.statusCode = 400;
                    response.msg = constants.INACTIVE_USER;
                    res.send(response);
                }

    			result0[0].email = UtilityHelper.decrypted(result0[0].email);
                result0[0].mobile_number = UtilityHelper.decrypted(result0[0].mobile_number);

                if(result0[0].kin_number != "" && result0[0].kin_number != null && result0[0].kin_number != 0){
                    result0[0].kin_number=UtilityHelper.decrypted(result0[0].kin_number);
                }else{
                    result0[0].kin_number="";
                }

                jwtHelper.JWTSighing({
                    'id':result0[0].id,
                    'first_name':result0[0].first_name,
                    'last_name':result0[0].last_name,
                    'email':result0[0].email,
                    'mobile_number':result0[0].mobile_number,
                    'user_type':result0[0].user_type,
                    'kin_number':result0[0].kin_number,
                    'kin_name':result0[0].kin_name,
                    'referral_code':result0[0].referral_code,
                    'group_code':result0[0].used_group_code,
                    'used_group_code':result0[0].used_group_code,
                }).then(function(result){
                    if(result.status){
                        
                        if(req.body.notification_key != "" && req.body.notification_key != undefined){

                            let selectNotificationSql = "Select * From user_notification_keys where user_id = '"+result0[0].id+"'";

                            dbConnection.query(selectNotificationSql, { 
                                type: dbConnection.QueryTypes.SELECT,
                            }).then(function(notificationExist) {

                                if(notificationExist.length>0){

                                    let UpdateSql = "UPDATE user_notification_keys SET notification_key = :notification_key WHERE user_id = '"+result0[0].id+"'";

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
												user_id:result0[0].id,
											}
										})
                                }else{

                                    let InsertNotificationeSql = "INSERT into user_notification_keys SET user_id = :user_id, device_type = :device_type, user_type = :user_type, notification_key = :notification_key";

                                    dbConnection.query(InsertNotificationeSql, {
                                        type: dbConnection.QueryTypes.UPDATE,
                                        replacements: {user_id: result0[0].id,
                                            device_type: 'web',
                                            user_type: result0[0].user_type,
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
												user_id:result0[0].id,
											}
										})
                                    
                                }
                            });
                        }
						delete(result0[0].password);
						delete(result0[0].updated_at);
						delete(result0[0].created_at);
						delete(result0[0].deleted_at);
						delete(result0[0].is_mobile_verify);
						delete(result0[0].is_email_verify);
                        result0[0].token = result.token;
                        response.statusCode = 200;
                        response.msg = constants.LOGIN_SUCCESSFULLY;
                        response.result = result0[0];
                        res.statusCode = 200;
                        res.send(response);
                    }else{
                        response.statusCode = 400;
                        response.msg = constants.SOMETHING_WENT_WRONG;                        
                        //res.statusCode = 400;
                        res.send(response);
                    }
                })
    		}else{
                response.statusCode = 400;
    			response.msg = constants.WRONG_CREDENTIALS;
                //res.statusCode = 400;
                res.send(response);
    		}
    	}).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            res.send(response);
        });
    }
}
module.exports = login;
