const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
var EmailHelper =  require('./../../../libraries/EmailHelper')();
var NotificationHelper =  require('./../../../libraries/NotificationHelper')();
var SocketHelper =  require('./../../../libraries/SocketHelper')();

var moment = require('moment');

updateRequestStatus = (req,res) => {
    var notificationData = {};
    var webIds = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	request_id:req.body.request_id,
        status:req.body.status,
        timeoffset:req.body.timeoffset ?req.body.timeoffset:120,
    }
    const rules = {
        request_id: 'required',
        status: 'required',
    }
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var therapist_id = res.locals.userData.id;
    var therapist_name = res.locals.userData.first_name+' '+res.locals.userData.last_name;
    let SelectSql = "Select requests.id,requests.request_number,requests.therapy_type,requests.status,requests.customer_id,requests.apointment_date_time,requests.price,users_master.first_name,users_master.last_name,users_master.email,users_master.is_email_verify From requests Join users_master On requests.customer_id = users_master.id where requests.id = :request_id and requests.therapist_id = :therapist_id";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {request_id:data.request_id,therapist_id:therapist_id}
    }).then(function(requestsData) {

    	if(requestsData.length == 0){
    		res.statusCode = 400;
            response.msg = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
    	}

        if(req.body.status == 'cancel'){
            var type = "customer_job_detail";
            var title = "Cancelled Request";
            var message = therapist_name +" has cancelled your request.";
            response.msg = constants.CANCEL_SUCCESS;
            var template_id = "6";
        }else if(req.body.status == 'wip'){
            var type = "customer_job_detail";
            var title = "Confirmed Request";
            var message = therapist_name +" has confirmed your request.";
            response.msg = constants.ACCEPTED_SUCCESS;
            var template_id = "4";
        }else{
            var type = "customer_job_detail";
            var title = "Completed Request";
            var message = therapist_name +" has completed your request.";
            response.msg = constants.COMPLETED_SUCCESS; 
            var template_id = "5";
        }

                
		let updateSql = "Update requests set status = :status where id = :request_id And therapist_id = :therapist_id";
		 dbConnection.query(updateSql, { 
	        type: dbConnection.QueryTypes.UPDATE,
	        replacements: {request_id:data.request_id,therapist_id:therapist_id,status:data.status}
	    }).then(function(updateData) {
	    	if(updateData){

                let insertSql = "Insert into notifications set user_id = :user_id,request_id = :request_id,type = :type, title = :title, message = :message";
                dbConnection.query(insertSql, { 
                    type: dbConnection.QueryTypes.INSERT,
                    replacements: {user_id:requestsData[0].customer_id,request_id:data.request_id,type:type,title:title,message:message}
                }).then(function(resultInsert) {                   
                }); 

                let SelectUserNotificationSql = "Select * from user_notification_keys where user_id = '"+requestsData[0].customer_id+"'";
                dbConnection.query(SelectUserNotificationSql, { 
                    type: dbConnection.QueryTypes.SELECT,
                }).then(function(userNotification) {   

                    if(userNotification.length>0){

                        webIds.push(userNotification[0].notification_key);

                        notificationData.id = "";
                        notificationData.title = title;
                        notificationData.message = message;
                        notificationData.type = type;                             
                        notificationData.device_type = "web";
                        notificationData.click_action = constants.BASE_PATH+"my-account/request-detail/:"+req.body.request_id;

                        NotificationHelper.mutipleNotification(webIds, notificationData, function (notificationResponse) {
                            
                        });                        
                    }

                    var socketOption = {
                        type:type,
                        show_message:message,
                        id:data.request_id,
                        is_success:'yes',
                        is_admin_inform:'yes',
                        user_id:requestsData[0].customer_id,
                        sender_type:'therapist',
                    }
                    SocketHelper.userInform(socketOption, function(info) {  });                                    
                });
                //Send email to patient on confirm booking
                if(req.body.status == 'wip'){
					var therapistTemplateSql = "select * from email_template where id = 15";
					dbConnection.query(therapistTemplateSql, {
						type: dbConnection.QueryTypes.SELECT
					}).then((therapistTemplateResult) => {								
						
						var CUSTOMERNAME = requestsData[0].first_name+' '+requestsData[0].last_name;	
						var THERAPISTNAME  = res.locals.userData.first_name;							
						var APPOINTMENTDATE = moment(requestsData[0].apointment_date_time).utcOffset(Number(data.timeoffset)).format("DD MMM YYYY");
						var APPOINTMENTTIME = moment(requestsData[0].apointment_date_time).utcOffset(Number(data.timeoffset)).format("hh:mm A");
																								
						var REQUESTNUMBER = requestsData[0].request_number;
						var LOGO = constants.BASEURL+'public/images/email_logo.png';
						var customerEmail = UtilityHelper.decrypted(requestsData[0].email);
						if(requestsData[0].therapy_type == 'online_therapy'){
							var THARAPYTYPE = "Online Therapy";
						}else if(requestsData[0].therapy_type == 'teen_counseling'){
							var THARAPYTYPE = "Teen Counseling";
						}else if(requestsData[0].therapy_type == 'marriage_counseling'){
							var THARAPYTYPE = "Marriage Counseling";
						}else if(requestsData[0].therapy_type == 'social_worker'){
							var THARAPYTYPE = "Social Worker";
						}else if(requestsData[0].therapy_type == 'registered_councillor'){
							var THARAPYTYPE = "Registered Counsellor";
						}else if(requestsData[0].therapy_type == 'counselling_psychologist'){
							var THARAPYTYPE = "Counseling Psychologist";
						}else if(requestsData[0].therapy_type == 'clinical_psychologist'){
							var THARAPYTYPE = "Clinical Psychologist";
						}


						var therapistHtmlTemplate = therapistTemplateResult[0].body.replace(/[\s]/gi, ' ').replace('[THERAPISTNAME]',THERAPISTNAME).replace('[CUSTOMERNAME]',CUSTOMERNAME).replace('[LOGO]',LOGO).replace('[REQUESTNUMBER]',REQUESTNUMBER).replace('[THARAPYTYPE]',THARAPYTYPE).replace('[APPOINTMENTDATE]',APPOINTMENTDATE).replace('[APPOINTMENTTIME]',APPOINTMENTTIME).replace('[APPOINTMENTDATE]',APPOINTMENTDATE).replace('[APPOINTMENTTIME]',APPOINTMENTTIME);  
						//==========send mail to therapist from library==============
						therapistMailOption = {
							subject: therapistTemplateResult[0].subject,
							body: therapistHtmlTemplate,
							//email:"ajay@idealittechno.com",
							email:customerEmail,
						};
						EmailHelper.sendEmail(therapistMailOption, function(mailResutl) {	
						});
					});
					//end email code
				}

                res.statusCode = 200;
                response.statusCode = 200;                               
                res.send(response);

	    	}else{
	    		res.statusCode = 400;
                response.statusCode = 400;
        		response.msg = constants.SOMETHING_WENT_WRONG;
        		return res.send(response);
	    	}
	    }).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            return res.send(response);
        });
            
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        return res.send(response);
    });
}
module.exports = updateRequestStatus;
