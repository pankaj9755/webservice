const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../../libraries/jwtHelper');
var EmailHelper =  require('./../../../../libraries/EmailHelper')();
var googleRecaptcha =  require('./../../../../libraries/googleRecaptcha')();
_ = require('lodash');


forgotPassword = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        email:req.body.email,
        token:req.body.token,
    };
    const rules = {
        email:'required',
    };
    const validation = new Validator(data,rules);

    if(validation.fails()){
        response.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
       
    let EncrytedEmail = UtilityHelper.encrypted(req.body.email);
    let emal2 =  UtilityHelper.encrypted('sheillazwane@gmail.com');
    console.log('sheillazwane@gmail.com ========',emal2);
	let SelectSql = "Select * From users_master where email = '"+EncrytedEmail+"' AND  deleted_at is null";
	googleRecaptcha.verifyRecaptcha(data, function(recaptchaResutl) {    
	if(recaptchaResutl.status==1){
			dbConnection.query(SelectSql, { 
				type: dbConnection.QueryTypes.SELECT,
			}).then(function(result) {

			if(result.length>0){

				var otp_code = _.random(1000000000, 9999999999);

				var update_sql = "UPDATE users_master SET remember_token = '" + otp_code +"' WHERE id = '" + result[0].id + "'";
				var user_key =  result[0].id;
				
				dbConnection.query(update_sql, {
					type: dbConnection.QueryTypes.UPDATE
				}).then(function(update_result) {

					//if(result[0].is_email_verify == 'yes') {


						var templateSql = "select * from email_template where id = 2";
						dbConnection.query(templateSql, {
							type: dbConnection.QueryTypes.SELECT
						}).then((templateResult) => {

							if(result[0].first_name != ""){
								var CUSTOMERNAME = "Hi "+result[0].first_name;
							}else{
								var CUSTOMERNAME = "Hello";
							}                    
							var LOGO = constants.BASEURL+'public/images/email_logo.png';
							var LINK = '<a style="border-radius: 3px; font-size: 15px; color: white; border: 1px #bac866 solid; box-shadow: inset 0 1px 0 #bac866, inset 1px 0 0 #bac866; text-decoration: none; padding: 10px 7px 10px 7px; width: 110px; max-width: 210px; margin: 6px auto; display: block; background-color: #bac866; text-align: center;" href="'+constants.BASE_PATH+'reset-password/'+user_key+'/'+otp_code+'">Reset Password</a>';                       

							var htmlTemplate = templateResult[0].body.replace(/[\s]/gi, ' ').replace('[CUSTOMERNAME]',CUSTOMERNAME).replace('[LOGO]',LOGO).replace('[LINK]',LINK);
							//==========send mail tocustomer from library==============
							var userEmail = UtilityHelper.decrypted(result[0].email);
							mailOption = {
								subject: templateResult[0].subject,
								body: htmlTemplate,
								email:userEmail,
							};
							EmailHelper.sendEmail(mailOption, function(mailResutl) {    

								console.log("EMAIL SEND");
							});   
						});                
				   // }
					response.statusCode = 200;
					response.msg = constants.FORGOT_PASSWORD;
					//res.statusCode = 200;
					return res.send(response);

				}).catch(function(err) {
					console.log('-- check forgot password Query failed err.message:'+err.message);
					response.statusCode = 400;
					response.msg = constants.SOMETHING_WENT_WRONG;
					return res.send(response);
				});
				}else{
					response.statusCode = 400;
					response.msg = constants.EMAIL_NOT_EXIST;
					//res.statusCode = 400;
					return res.send(response);
				}
		
			}).catch(function(err) {
				console.log(err);
				response.statusCode = 500;
				response.msg = err;
				res.send(response);
			});
    }else{
		response.statusCode = 400;
        response.msg = constants.SOMETHING_WENT_WRONG;
        //res.statusCode = 400;
        return res.send(response);
	}
  });
}

module.exports = forgotPassword;
