const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
var moment = require('moment');
const Validator = require('validatorjs');
var NotificationHelper =  require('./../../../libraries/NotificationHelper')();
var SocketHelper =  require('./../../../libraries/SocketHelper')();
var EmailHelper =  require('./../../../libraries/EmailHelper')();
var UtilityHelper = require('./../../../libraries/UtilityHelper')();

create = (req,res) => {

	var notificationData = {};
    var webIds = [];

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,        
    };
    const data = {
    	therapist_id:req.body.therapist_id,
    	schedule_date:req.body.schedule_date,
    	therapy_type:req.body.therapy_type,
    	timeoffset:req.body.timeoffset ?req.body.timeoffset:120,
    	
    };
    const rules = {
        therapist_id: 'required',
        schedule_date: 'required',
        therapy_type: 'required'
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';       
        response.errors = validation.errors.errors;
        return res.send(response);
    }
   
    var user_id = res.locals.userData.id;
    var user_group_code = res.locals.userData.group_code;
    var score = req.body.score ? parseInt(req.body.score) : 0;
   
    // check last order of day
    let lastOrderSql = "Select count(*) As last_order From requests where DATE(created_at) ='"+moment().format('YYYY-MM-DD')+"'";
	dbConnection.query(lastOrderSql, { 
		type: dbConnection.QueryTypes.SELECT,
	}).then(function(lastOrderInfo) {
		
		var question_answer = JSON.stringify(req.body.question_answer);
		var schedule_date = moment(req.body.schedule_date).utc().format("YYYY-MM-DD HH:mm:00");
		var request_number = lastOrderInfo[0].last_order+100; // last order number
		request_number = moment().format('YYYYMMDD')+""+request_number+"";
		var replacementsData =  {
					request_number: request_number,
					therapist_id: req.body.therapist_id,
					customer_id: user_id,
					therapy_type: req.body.therapy_type,
					schedule_date: schedule_date,
					question_answer:req.body.question_answer,
					price:req.body.price,
					total_amount:req.body.total_amount,
					promo_code:req.body.promo_code.trim(),
					discount_promo_code:req.body.discount_promo_code,
					status:'draft',
					payment_status:'pending',
					referral_discount_amount:req.body.referral_discount_amount,
					referral_code:req.body.referral_code,
					is_my_code:req.body.is_my_code,
					group_code: user_group_code,
					is_group_code_applied:req.body.group_code_applied,
					score:score
		};
		replacementsData.total_amount = replacementsData.total_amount- replacementsData.referral_discount_amount;
		
		check_groupcode(replacementsData,function(groupres){
			check_referralcode(replacementsData,function(referralres){
				
				if(referralres.success==0){
					res.statusCode = 500;
					response.msg = 'Something error on create order. Try again if issue exists persists please contact to support team.';
					response.errors = validation.errors.errors;
					return res.send(response);
				}
				
				check_promocode(replacementsData,function(promores){

				if(promores.success==0){
					res.statusCode = 500;
					response.msg = 'Something error on create order. Try again if issue exists persists please contact to support team.';
					response.errors = validation.errors.errors;
					return res.send(response);
				}
				replacementsData.discount_promo_code = promores.discount_amount;
				if(req.body.price<0){
					replacementsData.price = 0;
				}
				if(promores.discount_amount==replacementsData.total_amount){
					replacementsData.status = 'pending';
					replacementsData.payment_status = 'done';
				}
				// check group code 
				if(groupres.success==1 && groupres.is_group_code_applied==true){
					
					replacementsData.status = 'pending';
					replacementsData.payment_status = 'done';
					replacementsData.group_code = user_group_code;
				}else{
					replacementsData.group_code =null;
					
				}
				
				console.log('i aam here==========================');
					   
				let inserSql = "Insert Into requests Set "
					inserSql += " request_number = :request_number, therapist_id = :therapist_id ,customer_id = :customer_id,therapy_type = :therapy_type,apointment_date_time =:schedule_date,question_answer="+question_answer+",price=:price,promo_code=:promo_code,discount_promo_code=:discount_promo_code,status=:status,payment_status=:payment_status,referral_code=:referral_code,referral_code_amount=:referral_discount_amount,group_code=:group_code,score=:score";
				console.log('inserSql=============',inserSql);
				dbConnection.query(inserSql, { 
					type: dbConnection.QueryTypes.INSERT,
					replacements: replacementsData
				}).then(function(insertresutl) {
					if(insertresutl){
						
						// insert into video plan table 
					let inserPlanSql = "Insert Into user_video_plan set plan_id =:plan_id, user_id =:user_id, amount =:amount, seconds=:seconds, invoice_id =:invoice_id";
					dbConnection.query(inserPlanSql, { 
						type: dbConnection.QueryTypes.INSERT,
						replacements: {plan_id:1, amount:250, user_id:user_id, seconds:3600, invoice_id:request_number} 
						}).then(function(insertplanresutl) {
					});	
						// If reffreal code used then updade users table
						if(referralres.id!=0 ){
								let updatereferralCodeSql = '';
								if(req.body.is_my_code=='yes'){
									updatereferralCodeSql = "UPDATE users_master SET benefit_i_referral_used='yes' WHERE id=:id";
								}
								if(req.body.is_my_code=='no'){
									updatereferralCodeSql = "UPDATE users_master SET benefit_referral_used='yes' WHERE id=:id";
								}
								if(updatereferralCodeSql!=''){
									dbConnection.query(updatereferralCodeSql, { 
									type: dbConnection.QueryTypes.UPDATE,
									replacements: {"id":referralres.id}
									});
								}
						}
						
						if(replacementsData.payment_status == "done"){

							var notificationData = {};
							var webIds = [];

							let SelectSql = "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email AS therapist_email,therapist.notification_key AS therapist_notification_key,therapist.device_key AS therapist_device_type From requests LEFT JOIN users_master AS customer  ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist  ON requests.therapist_id = therapist.id WHERE requests.request_number = :order_number";
							dbConnection.query(SelectSql, { 
								type: dbConnection.QueryTypes.SELECT,
								replacements: {order_number:request_number}
							}).then(function(requestsData) {					    	

								//Send email to admin on create booking
									var CUSTOMERNAME = res.locals.userData.first_name;
									var APPOINTMENTDATE = moment(req.body.schedule_date).utcOffset(Number(data.timeoffset)).format("DD MMM YYYY hh:mm A");

									if(req.body.therapy_type == 'online_therapy'){
										var THARAPYTYPE = "Online Therapy";
									}else if(req.body.therapy_type == 'teen_counseling'){
										var THARAPYTYPE = "Teen Counseling";
									}else if(req.body.therapy_type == 'marriage_counseling'){
										var THARAPYTYPE = "Marriage Counseling";
									}else if(req.body.therapy_type == 'social_worker'){
										var THARAPYTYPE = "Social Worker";
									}else if(req.body.therapy_type == 'registered_councillor'){
										var THARAPYTYPE = "Registered Counsellor";
									}else if(req.body.therapy_type == 'counselling_psychologist'){
										var THARAPYTYPE = "Counseling Psychologist";
									}else if(req.body.therapy_type == 'clinical_psychologist'){
										var THARAPYTYPE = "Clinical Psychologist";
									}

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
								 if (requestsData[0].therapist_device_type != "web") {
										  webIds.push(requestsData[0].therapist_notification_key);
										  notificationData.id = requestsData[0].id;
										  notificationData.title = "Booking Request";
										  notificationData.message = "You have a booking request.";;
										  notificationData.type = "therapist_job_detail";
										  notificationData.device_type = requestsData[0].therapist_device_type;
										  notificationData.click_action =
											constants.BASE_PATH +
											"my-account/therapist-request-detail/" +
											requestsData[0].id;
										  NotificationHelper.mutipleNotification(
											webIds,
											notificationData,
											function (notificationResponse) {
											  console.log("Web Notification Response: ", notificationResponse);
											}
										  );
								}

								let SelectUserNotificationSql = "Select * from user_notification_keys where user_id = '"+req.body.therapist_id+"'";
								dbConnection.query(SelectUserNotificationSql, { 
									type: dbConnection.QueryTypes.SELECT,
								}).then(function(userNotification) {   

									if(userNotification.length>0){

										webIds.push(userNotification[0].notification_key);

										notificationData.id = "";
										notificationData.title = "Booking Request";
										notificationData.message = "You have a booking request.";
										notificationData.type = "therapist_job_detail"                             
										notificationData.device_type = "web";
										notificationData.click_action = constants.BASE_PATH+"my-account/therapist-request-detail/"+requestsData[0].id;
																	
										NotificationHelper.mutipleNotification(webIds, notificationData, function (notificationResponse) {
											console.log("Web Notification Response: ", notificationResponse);
										});					                					                
									}

									var requestMessage = "You have a booking request.";
									let insertSql = "Insert into notifications set user_id = :user_id,request_id = :request_id,type = :type, title = :title, message = :message";
									dbConnection.query(insertSql, { 
										type: dbConnection.QueryTypes.INSERT,
										replacements: {user_id:req.body.therapist_id,request_id:requestsData[0].id,type:"therapist_job_detail",title:"Booking Request",message:requestMessage}
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

						response.statusCode = 200;
						response.result = {order_number:request_number,is_group_code_applied:groupres.is_group_code_applied};
						response.msg = 'order create successful';
						return res.send(response);
					}else{
						response.statusCode = 500;
						response.msg = err;
						return res.send(response);
					}
				}).catch(function(err) {
					response.statusCode = 500;
					response.msg = err;
					console.log('err here',err);
					return res.send(response);
				});
			});
		});
	 });
	}).catch(function(err) {
		response.statusCode = 500;
		response.msg = err;
		console.log('erere',err);
		return res.send(response);		
	});
}
module.exports = create;

var  check_promocode = function(promocodeinfo,callback) {
	const promoreply = {
        'msg': 'error on promocode',
        'msg1':"",
        'success': 0
    };
    var user_id = promocodeinfo.customer_id;
    var promises = [];
	if(promocodeinfo.promo_code==''){
		promoreply.discount_amount = 0;
		promoreply.msg = "no promo code used";
		promoreply.msg1 = "";
		promoreply.success = 1;
		callback(promoreply);
	}
	if(promocodeinfo.promo_code!=''){
		let promoCodeSql = "Select * From promocode where code = '"+promocodeinfo.promo_code+"' ";
		let countUsedPromoSql = "Select count(id) as total_promo From requests where promo_code = '"+promocodeinfo.promo_code+"'";
		let countUserUsedPromoSql = "Select count(id) as total_promo From requests where promo_code = '"+promocodeinfo.promo_code+"' And customer_id = '"+user_id+"' ";
	
		promises.push(dbConnection.query(promoCodeSql, {
		type: dbConnection.QueryTypes.SELECT
		}).then(function(promoCodeResult) {
			promocodeInfo = promoCodeResult;
		}));
		promises.push(dbConnection.query(countUsedPromoSql, {
			type: dbConnection.QueryTypes.SELECT
		}).then(function(countUsedPromoResult) {
			usedPromoInfo = countUsedPromoResult;
		}));

		promises.push(dbConnection.query(countUserUsedPromoSql, {
			type: dbConnection.QueryTypes.SELECT
		}).then(function(countUserUsedPromoResult) {
			userUsedPromoInfo = countUserUsedPromoResult;
		}));
		Promise.all(promises).then(function(result) {
			if(promocodeInfo.length>0){
				if(promocodeInfo[0].status == 'inactive'){
					promoreply.msg = 'Promo code is inactive';
					promoreply.msg1 = "";
					callback(promoreply);
				}
	            var currentDate = moment().format("YYYY-MM-DD 00:00:00");
				var valdiFromDate = moment(promocodeInfo[0].valid_from).format("YYYY-MM-DD HH:mm:ss");
				if(valdiFromDate > currentDate){
					promoreply.msg = 'This promocode is not available yet.';
					promoreply.msg1 = "";
					callback(promoreply);
				}
				var valdiTillDate = moment(promocodeInfo[0].valid_till).format("YYYY-MM-DD HH:mm:ss");
				
				if(valdiTillDate < currentDate){
					promoreply.msg = 'This promocode has been expired.';
					promoreply.msg1 = "";
					callback(promoreply);
				}
				if(promocodeInfo[0].max_uses <= usedPromoInfo[0].total_promo){					
					promoreply.msg = 'The limit of this promocode has expired.';
					promoreply.msg1 = "";
					callback(promoreply);
				}

				if(promocodeInfo[0].max_uses_per_person <= userUsedPromoInfo[0].total_promo){
					promoreply.msg = 'The limit of this promocode has expired.';
					promoreply.msg1 = "";
					callback(promoreply);
				}
				if(promocodeInfo[0].discount_type == "percent"){
					promoreply.success = 1;
					promoreply.discount_amount = promocodeinfo.total_amount * promocodeInfo[0].discount_amount / 100;
					promoreply.msg = "Congratulations! Your promocode '" + promocodeInfo[0].code + "' has been applied.";
					promoreply.msg1 = "Click Pay Now to complete booking.";
					callback(promoreply);
				}else{
					promoreply.success = 1;
					promoreply.discount_amount = promocodeInfo[0].discount_amount;
					promoreply.msg = "Congratulations! Your promocode '" + promocodeInfo[0].code + "' has been applied.";
					promoreply.msg1 = "Click Pay Now to complete booking.";
					callback(promoreply);
				}				
			}
			else{
				promoreply.msg = 'Promo code not found';
				promoreply.msg1 = "";
				callback(promoreply);
			}			
		}).catch(function(err) {
			promoreply.success = 0;
			callback(promoreply);
		});		
	}	 
}
var  check_groupcode = function(groupcodeinfo,callback) {
	const groupreply = {
        'msg': 'error on groupcode',
        'is_group_code_applied': false,
        'msg1':"",
        'success': 0,
        'id':0
    };
    
    var user_id = groupcodeinfo.customer_id;
    var promises = [];
    if(groupcodeinfo.group_code==null || groupcodeinfo.group_code==''|| groupcodeinfo.is_group_code_applied ==false){
		groupreply.discount_amount = 0;
		groupreply.msg = "no referral code used";
		groupreply.id = 0;
		groupreply.success = 1;
		groupreply.is_group_code_applied = false;
		callback(groupreply);
	}else{
		let countUsedGroupSql = "SELECT count(*) AS total_session FROM requests WHERE customer_id = '"+user_id+"' && status IN ('pending','wip')"; //

		 let groupCodeSql = "SELECT id,code,free_session FROM group_code WHERE code = '"+groupcodeinfo.group_code+"' ";

		promises.push(dbConnection.query(countUsedGroupSql, {
			type: dbConnection.QueryTypes.SELECT
		}).then(function(countUsedGroupResult) {
			countUsedGroupInfo = countUsedGroupResult;
		}));
		
		promises.push(dbConnection.query(groupCodeSql, {
			type: dbConnection.QueryTypes.SELECT
		}).then(function(groupCodeResult) {
			allGroupCodeInfo = groupCodeResult;
		}));
		Promise.all(promises).then(function(result) {

			if(allGroupCodeInfo.length>0){
				var remaingSession = allGroupCodeInfo[0].free_session-countUsedGroupInfo[0].total_session;
				if(remaingSession>0){
					groupreply.success = 1;
					groupreply.msg = "";
					groupreply.is_group_code_applied = true;
					callback(groupreply);
				}else{
					groupreply.success = 1;
					groupreply.msg = "";
					groupreply.is_group_code_applied = false;
					callback(groupreply);
				}
				
			}else{
				   groupreply.success = 1;
					groupreply.msg = "";
					groupreply.is_group_code_applied = false;
					callback(groupreply);
			}                

			

		})	
	}
		 
}
// check referral code
var  check_referralcode = function(referralcodeinfo,callback) {
	const referralreply = {
        'msg': 'error on promocode',
        'msg1':"",
        'success': 0,
        'id':0
    };
    
    var user_id = referralcodeinfo.customer_id;
    var promises = [];
	if(referralcodeinfo.referral_code==''){
		referralreply.discount_amount = 0;
		referralreply.msg = "no referral code used";
		referralreply.id = 0;
		referralreply.msg1 = "";
		referralreply.success = 1;
		callback(referralreply);
	}
	
	if(referralcodeinfo.referral_code!=''){
		if(referralcodeinfo.is_my_code=='yes'){
			var referralCodeSql = "SELECT id,benefit_i_referral_used,benefit_referral_used FROM users_master WHERE id='"+user_id+"' AND benefit_i_referral_used='no' ";
		}else{
			var referralCodeSql = "SELECT id,benefit_i_referral_used,benefit_referral_used FROM users_master WHERE referral_code = '"+referralcodeinfo.referral_code+"' AND benefit_referral_used='no' ";
		}
		
		promises.push(dbConnection.query(referralCodeSql, {
		type: dbConnection.QueryTypes.SELECT
		}).then(function(referralCodeResult) {
			referralInfo = referralCodeResult;
		}));
		
		Promise.all(promises).then(function(result) {
			if(referralInfo.length>0){
				referralreply.success = 1;
				referralreply.id = referralInfo[0].id;
				referralreply.msg = "";
				referralreply.msg1 = "Click Pay Now to complete booking.";
				callback(referralreply);
								
			}
			else{
				referralreply.msg = 'Reffreal code not found';
				referralreply.msg1 = "";
				callback(referralreply);
			}			
		}).catch(function(err) {
			referralreply.success = 0;
			callback(referralreply);
		});		
	}	 
}


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
