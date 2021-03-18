const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
var EmailHelper =  require('./../../../libraries/EmailHelper')();
var NotificationHelper =  require('./../../../libraries/NotificationHelper')();
var SocketHelper =  require('./../../../libraries/SocketHelper')();
var UtilityHelper = require('./../../../libraries/UtilityHelper')();

notifyReorderPayFast = (req,res) => {
	res.sendStatus(200);
	var response = {} ;
	var listedarray = [];
	var pfData = [];

	var notificationData = {};
	var webIds = [];
	
	// Payfast only notify your webhooks from these IPs: Any notify from outside of these can safely be considered counterfeit
	// 52.31.139.75, 52.49.173.169, 52.214.14.220
	var listedarray = [];
	var replacementData  = {};
	listedarray[0] = "41.74.179.193";
	listedarray[1] = "41.74.179.222";
	listedarray[2] = "197.97.145.145";
	listedarray[3] = "197.97.145.158";
	listedarray[4] = "197.97.145.144";
	listedarray[5] = "41.74.179.192";		
	
	var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
		ip = ip.split(',')[0];
		ip = ip.split(':').slice(-1); 
	var payment = {
		payment_id: req.body.pf_payment_id,
		order_number:req.body.m_payment_id,
		status: req.body.payment_status,
		orderName: req.body.item_name,
		gross: req.body.amount_gross,
		fee: req.body.amount_fee,
		net: req.body.amount_net,
		name: req.body.name_first,
		last_name: req.body.name_last,
		signature: req.body.signature
    };

  	if(listedarray.includes(ip.toString()) === true){
  		
		let UpdateSql = "UPDATE requests SET ";
		UpdateSql += " payment_status = 'done', ";
		UpdateSql += " status = 'wip' ";
		UpdateSql += " WHERE request_number = "+payment.order_number+"";
		console.log('UpdateSql',UpdateSql);
		dbConnection.query(UpdateSql, { 
			type: dbConnection.QueryTypes.UPDATE,
		})

		let SelectSql = "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email as therapist_email,therapist.therapy_type From requests LEFT JOIN users_master AS customer  ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist  ON requests.therapist_id = therapist.id WHERE requests.request_number = :order_number";
	    dbConnection.query(SelectSql, { 
	        type: dbConnection.QueryTypes.SELECT,
	        replacements: {order_number:payment.order_number}
	    }).then(function(requestsData) {

			let insertTransactionSql = "INSERT INTO transaction SET payment_id = :payment_id,request_id = :request_id,type ='credit', amount = :amount, fees = :fees,status='success'";
			dbConnection.query(insertTransactionSql, { 
	                    type: dbConnection.QueryTypes.INSERT,
	                    replacements: {request_id:requestsData[0].id,payment_id:payment.payment_id,amount:payment.gross,fees:payment.fee}
	        })


			//Send email to admin on create booking
				var CUSTOMERNAME = res.locals.userData.first_name;
				var APPOINTMENTDATE = moment(requestsData[0].apointment_date_time).utc().format("DD MMM YYYY HH:mm A");

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

				//var THARAPYTYPE = requestsData[0].therapy_type;
				sendMailToAdmin({'REQUEST_NUMBER':request_number,'THARAPY_TYPE':THARAPYTYPE,'CUSTOMERNAME':CUSTOMERNAME,'APPOINTMENT_DATE':APPOINTMENTDATE});					
			//end email code


			//Send email to therapist on create booking
				var therapistTemplateSql = "select * from email_template where id = 10";
				dbConnection.query(therapistTemplateSql, {
					type: dbConnection.QueryTypes.SELECT
				}).then((therapistTemplateResult) => {								
					
					var THERAPISTNAME = requestsData[0].therapist_first_name+' '+requestsData[0].therapist_last_name;										
					var REQUESTNUMBER = request_number;
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


			
			let SelectUserNotificationSql = "SELECT * FROM user_notification_keys WHERE user_id = '"+requestsData[0].therapist_id+"'";

	        dbConnection.query(SelectUserNotificationSql, { 
	            type: dbConnection.QueryTypes.SELECT,
	        }).then(function(userNotification) {   

	            if(userNotification.length>0){

	                webIds.push(userNotification[0].notification_key);

	                notificationData.id = "";
	                notificationData.title = "Booking Request";
	                notificationData.message = "You have a booking request.";
	                notificationData.type = "therapist_job_detail";                             
	                notificationData.device_type = "web";
	                notificationData.click_action = constants.BASE_PATH+"my-account/therapist-request-detail/"+requestsData[0].id;

	                NotificationHelper.mutipleNotification(webIds, notificationData, function (notificationResponse) {
	                    console.log("Web Notification Response: ", notificationResponse);
	                });	                
	            }

	            var requestMessage = "You have a booking request.";
	                let insertSql = "INSERT INTO notifications SET user_id = :user_id,request_id = :request_id,type = :type, title = :title, message = :message";
	                dbConnection.query(insertSql, { 
	                    type: dbConnection.QueryTypes.INSERT,
	                    replacements: {user_id:requestsData[0].therapist_id,request_id:requestsData[0].id,type:"therapist_job_detail",title:"Booking Request",message:requestMessage}
	                }).then(function(resultInsert) {	               
	               	});

	            var socketOption = {
                    type:"therapist_job_detail",
                    show_message: "You have a booking request.",
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
    }
 
  	
	var body =  JSON.stringify(payment);
	body +=  ip;
	body += JSON.stringify(req.body);
	
	var mailOption = {
					subject: 'console log of notify Payment reorder request plan',
					body: ip,
					email:"ajay@idealittechno.com",
	};
	EmailHelper.sendEmail(mailOption, function(mailResutl) {    
		console.log("EMAIL SEND");
	}); 


    
}
module.exports = notifyReorderPayFast;




function sendMailToAdmin(requestInfo){

	var templateSql = "select * from email_template where id = 9";
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
			//email:"krishna@idealittechno.com",
			email:"info@syked.co.za",
		};
		EmailHelper.sendEmail(mailOption, function(mailResutl) {	
		});
	});
}
