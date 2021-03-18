const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var _ = require('lodash');
var moment = require('moment-timezone');
var fs = require('fs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../libraries/jwtHelper');
var EmailHelper =  require('./../../../libraries/EmailHelper')();


videoCallAlert = function(req, res) {
	
    const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = { 
    	request_id:req.body.request_id, 
    	timeoffset:req.body.timeoffset ?req.body.timeoffset:120,
    	
    };

    const rules = {
        request_id:'required',
        
    };
    const validation = new Validator(data,rules);
	var adminEmail = [];
    if(validation.fails()){
        response.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }       
	var user_id = res.locals.userData.id;
    let requestsSql = "SELECT requests.id AS requests_id,uc.id AS customer_id,uc.first_name AS customer_first_name,ut.id AS therapist_id,ut.first_name AS therapist_first_name,requests.therapy_type,requests.apointment_date_time,requests.request_number  FROM requests LEFT JOIN users_master AS uc ON uc.id=requests.customer_id LEFT JOIN users_master AS ut ON ut.id=requests.therapist_id  WHERE requests.id=:id";
    dbConnection.query(requestsSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements:{
                id: data.request_id,
           },
    }).then(function(requestsData) {
		

    	if(requestsData.length > 0){
			if(user_id!=requestsData[0].therapist_id){
			response.msg = "Soory! You have no permission to perform this action!";
	        response.statusCode = 400;
	        res.statusCode = 400;
	        res.send(response);
		}
			var therapistTemplateSql = "SELECT * FROM email_template WHERE id = 13";
			dbConnection.query(therapistTemplateSql, {
				type: dbConnection.QueryTypes.SELECT
			}).then((therapistTemplateResult) => {								
				
				var THERAPISTNAME = requestsData[0].therapist_first_name;	
				var CUSTOMERNAME = requestsData[0].customer_first_name;							
																												
				var REQUESTNUMBER = requestsData[0].request_number;
				var LOGO = constants.BASEURL+'public/images/email_logo.png';
				var APPOINTMENTDATE = moment(requestsData[0].apointment_date_time).utcOffset(Number(data.timeoffset)).format("DD MMM YYYY hh:mm A");
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

				var therapistHtmlTemplate = therapistTemplateResult[0].body.replace(/[\s]/gi, ' ').replace('[THERAPIST_NAME]',THERAPISTNAME).replace('[CUSTOMER_NAME]',CUSTOMERNAME).replace('[LOGO]',LOGO).replace('[REQUEST_NUMBER]',REQUESTNUMBER).replace('[THARAPY_TYPE]',THARAPYTYPE).replace('[APPOINTMENT_DATE]',APPOINTMENTDATE); 
				
				adminEmail.push('wandile@syked.co.za');
				adminEmail.push('info@syked.co.za');
				
				//adminEmail.push('ajay@idealittechno.com');
				//adminEmail.push('kapil@idealittechno.com');
				//==========send mail to therapist from library==============
				therapistMailOption = {
					subject: therapistTemplateResult[0].subject,
					body: therapistHtmlTemplate,
					//email:"krishna@idealittechno.com",
					email:adminEmail,
				};
				EmailHelper.sendEmail(therapistMailOption, function(mailResutl) {	
				});
			});

		    response.msg = "Alert to admin successfully!";
	        response.statusCode = 200;
	        res.statusCode = 200;
	        res.send(response);
	        
	        
        }else{
			response.msg = "Soory! Alert to admin not successfully!";
	        response.statusCode = 400;
	        res.statusCode = 400;
	        res.send(response);
		}

        }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });

   
   
}
module.exports = videoCallAlert;
