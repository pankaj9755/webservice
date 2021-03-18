const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../../libraries/jwtHelper');
var EmailHelper =  require('./../../../../libraries/EmailHelper')();
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

mobile_verify = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	code:req.body.code,
        //first_name:req.body.first_name,
        //last_name:req.body.last_name,
        //mobile_number:req.body.mobile_number,
        //email:req.body.email,
       // password:req.body.password,
    };
    const rules = {
        code: 'required',
        //first_name:'required',
        //last_name:'required',
        //mobile_number:'required',
        //email:'required',
        //password:'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }

    var mobile_number = res.locals.userData.mobile_number;
    var password1 = res.locals.userData.password;
    var email = res.locals.userData.email.toLowerCase();
    var user_type = res.locals.userData.user_type;

    var first_name = res.locals.userData.first_name ?res.locals.userData.first_name:"";
    var last_name = res.locals.userData.last_name ?res.locals.userData.last_name:"";
    var social_key = res.locals.userData.social_key ?res.locals.userData.social_key:null;
    var social_type = res.locals.userData.social_type ?res.locals.userData.social_type:null;

    let password = res.locals.userData.password;
    let EncrytedEmail = UtilityHelper.encrypted(email);
	let Encryted_mobile_number = UtilityHelper.encrypted(mobile_number);

    var kin_name = res.locals.userData.kin_name ?res.locals.userData.kin_name:"";
    var kin_number = res.locals.userData.kin_number ?res.locals.userData.kin_number:"";
    var group_code = res.locals.userData.group_code ?res.locals.userData.group_code:"";
    if(kin_number != "" && kin_number != undefined){
        var Encryted_kin_number = UtilityHelper.encrypted(res.locals.userData.kin_number);
    }else{
        var Encryted_kin_number = "";
    }    
	if(user_type=='' || user_type=='undefined'|| user_type==undefined || user_type==null ) {
		user_type = 'customer';
	}
	let SelectSql = "Select * From users_temp where mobile_number = :mobile_number";
	dbConnection.query(SelectSql, { 
		type: dbConnection.QueryTypes.SELECT,
		replacements: {mobile_number: Encryted_mobile_number,}
	}).then(function(isExist) {
		if(isExist.length == 0){
			response.msg = constants.RECORD_NOT_FOUND;
            response.statusCode = 400;
            res.statusCode = 400;
            return res.send(response);
		}
            
		if(isExist[0].code !== req.body.code){
            response.msg = constants.WRONG_CODE;
            response.statusCode = 409;
            res.statusCode = 409;
            res.send(response);
        }else{
        	let regNumber = shortid.generate();
        	let reffralCode = '';
			if(first_name !=null && first_name!="" && first_name!=undefined){
				reffralCode = first_name;
			}
			if(reffralCode!=""){
				if(last_name !=null){
					reffralCode += last_name;
				}
				var lenghtOfCode = reffralCode.length;
				if(lenghtOfCode<6){
					reffralCode = reffralCode+UtilityHelper.randomIntNumber(5-lenghtOfCode); 
				}else{
					reffralCode = reffralCode.slice(0,5);
				}
				reffralCode = reffralCode.replace(/ /g,'');
				reffralCode = reffralCode.toUpperCase();
			}
			// group code check
			userGroupExist(group_code,function(groupCodeExist){
				if(groupCodeExist==0){
					response.msg = 'Sorry! Group code does not exist.';
					response.statusCode = 409;
					res.statusCode = 409;
					return res.send(response);
				}	

            userReferralExists(reffralCode,function(NewreffralCode){
				let inserSql = "Insert Into users_master Set "
                inserSql += " email = :email, mobile_number = :mobile_number ,password = :password,user_type = :user_type,unic_id = :regNumber,social_type = :social_type,social_key = :social_key,referral_code = :referral_code";
                //In case of Therapist need to enter first name and last name
                
                if(first_name != ''){
                    inserSql += " ,first_name = :first_name"
                }
                if(last_name != ''){
                    inserSql += " ,last_name = :last_name "
                }
                if(kin_name != ''){
                    inserSql += " ,kin_name = :kin_name "
                }
                if(kin_number != ''){
                    inserSql += " ,kin_number = :kin_number "
                }
                if(req.body.used_referral != '' && req.body.used_referral != undefined){
                    inserSql += ", used_referral_code = :used_referral "
                } 
                if(group_code != ''){
                    inserSql += " ,used_group_code = :group_code "
                }
                //return 'll';
                //co
                dbConnection.query(inserSql, { 
                    type: dbConnection.QueryTypes.INSERT,
                    replacements: {
                        email: EncrytedEmail,
                        mobile_number: Encryted_mobile_number,
                        password:password,
                        regNumber:regNumber,
                        user_type:user_type,
                        last_name:last_name,
                        first_name:first_name,
                        social_key:social_key,
                        social_type:social_type,
                        referral_code:NewreffralCode,
                        used_referral:req.body.used_referral,
                        kin_name:kin_name,
                        kin_number:Encryted_kin_number,
                        group_code:group_code,
                        used_group_code:group_code
                    }
                }).then(function(result1) {
                	
                    if(result1){
                        dbConnection.query("Select * From users_master where id = '"+result1[0]+"'", { 
                            type: dbConnection.QueryTypes.SELECT,
                            replacements: {mobile_number: Encryted_mobile_number,}
                        }).then(function(loginResult) {
                            loginResult[0].email = UtilityHelper.decrypted(loginResult[0].email);
                            loginResult[0].mobile_number = UtilityHelper.decrypted(loginResult[0].mobile_number);
                            if(loginResult[0].kin_number != "" && loginResult[0].kin_number != null){
                                loginResult[0].kin_number=UtilityHelper.decrypted(loginResult[0].kin_number);
                            }else{
                                loginResult[0].kin_number=loginResult[0].kin_number;
                            }                    
                                                          
                            jwtHelper.JWTSighing({
                                //'first_name':loginResult[0].first_name,
                                //'last_name':loginResult[0].last_name,
                                'id':loginResult[0].id,
                                'email':loginResult[0].email,
                                'mobile_number':loginResult[0].mobile_number,
                                'user_type':loginResult[0].user_type,
                                'kin_number':loginResult[0].kin_number,
                                'kin_name':loginResult[0].kin_name,
                                'referral_code':NewreffralCode,
                                'group_code':group_code,
                                'used_group_code':group_code,
                                
                            }).then(function(result){
                                if(result.status){

                                    if(req.body.notification_key != "" && req.body.notification_key != undefined){
                                    
                                        let selectNotificationSql = "Select * From user_notification_keys where user_id = '"+loginResult[0].id+"'";

                                        dbConnection.query(selectNotificationSql, { 
                                            type: dbConnection.QueryTypes.SELECT,
                                        }).then(function(notificationExist) {

                                            if(notificationExist.length>0){

                                                let UpdateSql = "UPDATE user_notification_keys SET notification_key = :notification_key Where user_id = '"+loginResult[0].id+"'";

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
															user_id:loginResult[0].id
														}
												})
                                            }else{

                                                let InsertNotificationeSql = "INSERT into user_notification_keys SET user_id = :user_id, device_type = :device_type, user_type = :user_type, notification_key = :notification_key";

                                                dbConnection.query(InsertNotificationeSql, {
                                                    type: dbConnection.QueryTypes.UPDATE,
                                                    replacements: {user_id: loginResult[0].id,
                                                        device_type: 'web',
                                                        user_type: loginResult[0].user_type,
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
															user_id:loginResult[0].id
														}
												})
                                            }
                                        });
                                    }
                                   
    								//================= Send mail to customer=========================
    						        if(loginResult[0].user_type=='customer'){
                                        var templateSql = "select * from email_template where id = 1";
                                    }else{
                                        var templateSql = "select * from email_template where id = 8";
                                    }    								
    								dbConnection.query(templateSql, {
    									type: dbConnection.QueryTypes.SELECT
    								}).then((templateResult) => {

                                        if(loginResult[0].first_name != ""){
                                            var CUSTOMERNAME = "Hi " +loginResult[0].first_name+" "+loginResult[0].last_name;
                                        }else{
                                            var CUSTOMERNAME = "Hello";
                                        }                                    
    									var LOGO = constants.BASEURL+'public/images/email_logo.png';
    									var htmlTemplate = templateResult[0].body.replace(/[\s]/gi, ' ').replace('[CUSTOMERNAME]',CUSTOMERNAME).replace('[LOGO]',LOGO);
    									//==========send mail tocustomer from library==============
    								    mailOption = {
    										subject: templateResult[0].subject,
    										body: htmlTemplate,
    										email:loginResult[0].email,
    									};
    									EmailHelper.sendEmail(mailOption, function(mailResutl) {	
    									});
    								});
                                     //==========send mail to customer from library==============

                                    //send to admin email
                                    var adminTemplateSql = "select * from email_template where id = 7";
                                    dbConnection.query(adminTemplateSql, {
                                        type: dbConnection.QueryTypes.SELECT
                                    }).then((adminTemplateResult) => {

                                        var FIRST_NAME = loginResult[0].first_name;
                                        var LAST_NAME = loginResult[0].last_name;
                                        var EMAIL = loginResult[0].email;
                                        var MOBILE_NUMBER = loginResult[0].mobile_number;
                                        var TYPE = loginResult[0].user_type;   
                                        var LOGO = constants.BASEURL+'public/images/email_logo.png';

                                        var htmlTemplate = adminTemplateResult[0].body.replace(/[\s]/gi, ' ').replace('[FIRST_NAME]',FIRST_NAME).replace('[LAST_NAME]',LAST_NAME).replace('[LOGO]',LOGO).replace('[EMAIL]',EMAIL).replace('[MOBILE_NUMBER]',MOBILE_NUMBER).replace('[TYPE]',TYPE);

                                       
                                        adminMailOption = {
                                            subject: adminTemplateResult[0].subject,
                                            body: htmlTemplate,
                                            email:"info@syked.co.za",
                                        };
                                        EmailHelper.sendEmail(adminMailOption, function(mailResutl) {    
                                        });
                                    }); //send to admin email
    								                                                              
                                   
                                    //Remove temp user
                                    dbConnection.query("Delete from users_temp where id ='"+isExist[0].id+"'",{type: dbConnection.QueryTypes.DELETE});
                                    
                                    loginResult[0].token = result.token;
                                    response.msg = constants.MOBILE_VERIFY_SUCCESS;
                                    response.result = loginResult[0];
                                    response.statusCode = 200;
                                    res.statusCode = 200;
                                    res.send(response);
                                }else{
                                    console.log('--TOKEN ERROR-----------------');
                                    response.msg = constants.SOMETHING_WENT_WRONG;
                                    response.statusCode = 400;
                                    res.statusCode = 400;
                                    res.send(response);
                                }                                
                            })                            
                        }).catch(function(err) {
                            res.statusCode = 500;
                            res.msg = err;
                            console.log(err);
                            res.send(response);
                        });                        
                    }
                }).catch(function(err) {
                    res.statusCode = 500;
                    res.msg = err;
                    console.log(err);
                    res.send(response);
                });            
            });
		});
        }
	    //poiDjm0i1b2VQfHDezbMqA==
        //gLPeeJTC5XuXFpgVhsaCP72SGx9ljoHJNvKTYulK3tc=
        //d8578edf8458ce06fbc5bb76a58c5ca4
	});    

}

module.exports = mobile_verify;
var userReferralExists = function(referralCode,callBack){
	if(referralCode==""){
		callBack(null);
	}
    let query = "SELECT * FROM users_master WHERE referral_code = '"+referralCode+"'";
	var k = referralCode;
	dbConnection.query(query, { 
		type: dbConnection.QueryTypes.SELECT,
	}).then(function(result) {
		
        if(result.length==0) {
		   callBack(k)                   // use the continuation
        } else {
			var k1 = k+UtilityHelper.randomIntNumber(2); 
			userReferralExists(k1,callBack)  // otherwise, recurse on generate
		}
    });
}
// Check Group Code
var userGroupExist = function(groupCode,callBack){
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
