const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
var moment = require('moment');
const Validator = require('validatorjs');
var NotificationHelper =  require('./../../../libraries/NotificationHelper')();
var SocketHelper =  require('./../../../libraries/SocketHelper')();
var EmailHelper =  require('./../../../libraries/EmailHelper')();
var UtilityHelper = require('./../../../libraries/UtilityHelper')();

edit = (req,res) => {

	var notificationData = {};
    var webIds = [];

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,        
    };
    const data = {
    	id:req.body.id,
    	schedule_date:req.body.schedule_date,
    	timeoffset:req.body.timeoffset ?req.body.timeoffset:120,
    	
    };
    const rules = {
        id: 'required',
        schedule_date: 'required',
       
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';       
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    // check last order of day
    let orderInfoSQl = "SELECT * FROM requests WHERE id ='"+data.id+"' AND customer_id='"+user_id+"'";
	dbConnection.query(orderInfoSQl, { 
		type: dbConnection.QueryTypes.SELECT,
	}).then(function(orderInfo) {
	
		if(orderInfo.length<1){
			res.statusCode = 200;
			response.msg = 'Sorry! You have no permission to update booking.';       
			return res.send(response);
		}
		var schedule_date = moment(data.schedule_date).utc().format("YYYY-MM-DD HH:mm:00");
		
		var replacementsData =  {
				schedule_date: schedule_date,
				id:data.id
		};
		if(orderInfo[0].status!='pending'){
			res.statusCode = 200;
			response.msg = 'Sorry! Now you have not update booking.';       
			return res.send(response);
		}
		let updateSql = "UPDATE requests SET apointment_date_time=:schedule_date WHERE id=:id";
				
			
			dbConnection.query(updateSql, { 
				type: dbConnection.QueryTypes.UPDATE,
				replacements: replacementsData
			}).then(function(updateRecord) {
				if(updateRecord){
				
				
					
					

						var notificationData = {};
						var webIds = [];

						let SelectSql = "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email AS therapist_email From requests LEFT JOIN users_master AS customer  ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist  ON requests.therapist_id = therapist.id WHERE requests.id = :id";
					    dbConnection.query(SelectSql, { 
					        type: dbConnection.QueryTypes.SELECT,
					        replacements: {id:data.id}
					    }).then(function(requestsData) {					    	

					    	//Send email to admin on create booking
								var CUSTOMERNAME = res.locals.userData.first_name;
								console.log('timeoffset================',data.timeoffset);
								var APPOINTMENTDATE = moment(req.body.schedule_date).utcOffset(Number(data.timeoffset)).format("DD MMM YYYY hh:mm A");
								

								if(orderInfo[0].therapy_type == 'online_therapy'){
									var THARAPYTYPE = "Online Therapy";
								}else if(orderInfo[0].therapy_type == 'teen_counseling'){
									var THARAPYTYPE = "Teen Counseling";
								}else if(orderInfo[0].therapy_type == 'marriage_counseling'){
									var THARAPYTYPE = "Marriage Counseling";
								}else if(orderInfo[0].therapy_type == 'social_worker'){
									var THARAPYTYPE = "Social Worker";
								}else if(orderInfo[0].therapy_type == 'registered_councillor'){
									var THARAPYTYPE = "Registered Counsellor";
								}else if(orderInfo[0].therapy_type == 'counselling_psychologist'){
									var THARAPYTYPE = "Counseling Psychologist";
								}else if(orderInfo[0].therapy_type == 'clinical_psychologist'){
									var THARAPYTYPE = "Clinical Psychologist";
								}

								sendMailToAdmin({'REQUEST_NUMBER':orderInfo[0].request_number,'THARAPY_TYPE':THARAPYTYPE,'CUSTOMERNAME':CUSTOMERNAME,'APPOINTMENT_DATE':APPOINTMENTDATE});					
							//end email code		

							//Send email to therapist on create booking
							var therapistTemplateSql = "select * from email_template where id = 11";
							dbConnection.query(therapistTemplateSql, {
								type: dbConnection.QueryTypes.SELECT
							}).then((therapistTemplateResult) => {								
								
								var THERAPISTNAME = requestsData[0].therapist_first_name+' '+requestsData[0].therapist_last_name;								
																																
								var REQUESTNUMBER = orderInfo[0].request_number;
								var LOGO = constants.BASEURL+'public/images/email_logo.png';
								var therapistEmail = UtilityHelper.decrypted(requestsData[0].therapist_email);

								var therapistHtmlTemplate = therapistTemplateResult[0].body.replace(/[\s]/gi, ' ').replace('[THERAPISTNAME]',THERAPISTNAME).replace('[CUSTOMERNAME]',CUSTOMERNAME).replace('[LOGO]',LOGO).replace('[REQUESTNUMBER]',REQUESTNUMBER).replace('[THARAPYTYPE]',THARAPYTYPE).replace('[APPOINTMENTDATE]',APPOINTMENTDATE); 
								//==========send mail to therapist from library==============
							    therapistMailOption = {
									subject: therapistTemplateResult[0].subject,
									body: therapistHtmlTemplate,
									//email:"krishna@idealittechno.com",
									email:therapistEmail,
								};
								EmailHelper.sendEmail(therapistMailOption, function(mailResutl) {	
								});
							});
							//end email code


							let SelectUserNotificationSql = "Select * from user_notification_keys where user_id = '"+orderInfo[0].therapist_id+"'";
					        dbConnection.query(SelectUserNotificationSql, { 
					            type: dbConnection.QueryTypes.SELECT,
					        }).then(function(userNotification) {   

					            if(userNotification.length>0){

					                webIds.push(userNotification[0].notification_key);

					                notificationData.id = "";
					                notificationData.title = "Update Booking Request";
					                notificationData.message = "Customer was updated booking request.";
					                notificationData.type = "therapist_job_detail"                             
					                notificationData.device_type = "web";
					                notificationData.click_action = constants.BASE_PATH+"my-account/therapist-request-detail/"+requestsData[0].id;

					                NotificationHelper.mutipleNotification(webIds, notificationData, function (notificationResponse) {
					                    console.log("Web Notification Response: ", notificationResponse);
					                });					                					                
					            }

					            var requestMessage = "Customer was updated booking request.";
				                let insertSql = "Insert into notifications set user_id = :user_id,request_id = :request_id,type = :type, title = :title, message = :message";
				                dbConnection.query(insertSql, { 
				                    type: dbConnection.QueryTypes.INSERT,
				                    replacements: {user_id:requestsData[0].therapist_id,request_id:requestsData[0].id,type:"therapist_job_detail",title:"Booking Request",message:requestMessage}
				                }).then(function(resultInsert) {	               
				               	});

					            var socketOption = {
			                        type:"therapist_job_detail",
			                        show_message: "Customer was updated booking request.",
			                        id:requestsData[0].id,
			                        is_success:'yes',
			                        is_admin_inform:'yes',
			                        user_id:requestsData[0].therapist_id,
			                        sender_type:'customer',
			                    }
			                    SocketHelper.userInform(socketOption, function(info) {              
			                    });
					        });
						});
					

					response.statusCode = 200;
					response.result = {request_number:orderInfo[0].request_number,id:data.id};
					response.msg = 'Booking updated successful.';
					return res.send(response);
				}else{
					response.statusCode = 500;
					response.msg = err;
					res.send(response);
				}
			}).catch(function(err) {
				response.statusCode = 500;
				response.msg = err;
				console.log('err here',err);
				res.send(response);
			});
		
	}).catch(function(err) {
		response.statusCode = 500;
		response.msg = err;
		console.log('erere',err);
		res.send(response);		
	});
}
module.exports = edit;


function sendMailToAdmin(requestInfo){

	var templateSql = "select * from email_template where id = 12";
	dbConnection.query(templateSql, {
		type: dbConnection.QueryTypes.SELECT
	}).then((templateResult) => {
		var CUSTOMERNAME = requestInfo.CUSTOMERNAME;
		var REQUEST_NUMBER = requestInfo.REQUEST_NUMBER;
		var THARAPY_TYPE = requestInfo.THARAPY_TYPE;
		var APPOINTMENT_DATE = requestInfo.APPOINTMENT_DATE
                                       
		var LOGO = constants.BASEURL+'public/images/email_logo.png';
		var htmlTemplate = templateResult[0].body.replace(/[\s]/gi, ' ').replace('[CUSTOMERNAME]',CUSTOMERNAME).replace('[LOGO]',LOGO).replace('[REQUEST_NUMBER]',REQUEST_NUMBER).replace('[THARAPY_TYPE]',THARAPY_TYPE).replace('[APPOINTMENT_DATE]',APPOINTMENT_DATE); 
		//==========send mail tocustomer from library==============
	    mailOption = {
			subject: templateResult[0].subject,
			body: htmlTemplate,
			//email:"ajay@idealtechnologys.com",
			email:"info@syked.co.za",
		};
		EmailHelper.sendEmail(mailOption, function(mailResutl) {	
		});
	});
}
