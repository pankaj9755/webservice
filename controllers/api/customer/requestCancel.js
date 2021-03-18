const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var NotificationHelper =  require('./../../../libraries/NotificationHelper')();
var SocketHelper =  require('./../../../libraries/SocketHelper')();
requestCancel = (req,res) => {
    var notificationData = {};
    var webIds = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	request_id:req.body.request_id
    }
    const rules = {
        request_id: 'required',
    }
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    var customer_name = res.locals.userData.first_name+' '+res.locals.userData.last_name;
    //let SelectSql = "Select id,therapist_id,status From requests where id = :request_id and customer_id = :user_id";

    let SelectSql = "Select requests.id,requests.status,requests.payment_status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,users_master.first_name,users_master.last_name,users_master.email,users_master.is_email_verify From requests Join users_master On requests.therapist_id = users_master.id where requests.id = :request_id and requests.customer_id = :user_id";

    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {request_id:data.request_id,user_id:user_id}
    }).then(function(result1) {
    	if(result1.length == 0){
    		res.statusCode = 400;
            response.msg = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
    	}

    	if(result1[0].status == 'pending'){

    		let updateSql = "Update requests set status = 'cancel' where id = '"+result1[0].id+"'";
    		 dbConnection.query(updateSql, { 
		        type: dbConnection.QueryTypes.UPDATE,
		        
		    }).then(function(result12) {
		    	if(result12){
                   
                    if(result1[0].payment_status == "done"){

                        var type = "therapist_job_detail";
                        var title = "Cancel Request";
                        var message = customer_name +" has cancelled your request.";

                        let insertSql = "Insert into notifications set user_id = :user_id,request_id = :request_id,type = :type, title = :title, message = :message";
                        dbConnection.query(insertSql, { 
                            type: dbConnection.QueryTypes.INSERT,
                            replacements: {user_id:result1[0].therapist_id,request_id:data.request_id,type:type,title:title,message:message}
                        }).then(function(resultInsert) {

                        });


                        let SelectUserNotificationSql = "Select * from user_notification_keys where user_id = '"+result1[0].therapist_id+"'";
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
                                notificationData.click_action = constants.BASE_PATH+"my-account/therapist-request-detail/"+req.body.request_id;
                                
                                NotificationHelper.mutipleNotification(webIds, notificationData, function (notificationResponse) {
                                    console.log("Web Notification Response: ", notificationResponse);
                                });
							}
							var socketOption = {
								type:type,
								show_message:message,
								id:data.request_id,
								is_success:'yes',
								is_admin_inform:'yes',
								user_id:result1[0].therapist_id,
								sender_type:'customer',
							}
							SocketHelper.userInform(socketOption, function(info) {  });
                                                                
                        });
                    }

		    		res.statusCode = 200;
    				response.msg = constants.CANCEL_SUCCESS;
        			res.send(response);
		    	}else{
		    		res.statusCode = 400;
            		response.msg = constants.SOMETHING_WENT_WRONG;
            		return res.send(response);
		    	}
		    })

    	}else{
    		res.statusCode = 400;
            response.msg = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        return res.send(response);
    });
}
module.exports = requestCancel;
