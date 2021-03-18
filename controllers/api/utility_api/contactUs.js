const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var _ = require('lodash');
var moment = require('moment-timezone');
var fs = require('fs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../libraries/jwtHelper');
var EmailHelper =  require('./../../../libraries/EmailHelper')();


contactUs = function(req, res) {
	
    const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        email:req.body.email,
        message:req.body.message,
        user_name:req.body.user_name,
        phone:req.body.phone,
    };

    const rules = {
        email:'required',
        message:'required',
        user_name:'required',
        phone:'required',
    };
    const validation = new Validator(data,rules);

    if(validation.fails()){
        response.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }

    let SelectSql = "Select * From email_template where id = '3'";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(tempResult) {

    	if(tempResult.length > 0){
       
		    //var htmlTemplate = req.body.message;
		    var LOGO = constants.BASEURL+'public/images/email_logo.png';
		    var htmlTemplate =
		'<table style="margin: 0px auto; max-width: 440px; font-family: arial;" border="0" width="509" cellspacing="15" cellpadding="0" bgcolor="#f0f4f5">' +
		'<tbody>' +
		'<tr>'+
		'<td valign="middle">'+
		'<img style="width:100px;text-align: center;" alt="Syked" src="'+LOGO+'">'+
		'</td>'+
		'</tr>'+
		'<tr bgcolor="#ffffff">' +
		'<td>' +
		'<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
		'<tbody>' +
		'</tbody>' +
		'</table>' +
		'</td>' +
		'</tr>' +
		'<tr bgcolor="#ffffff">' +
		'<td>' +
		'<table style="border-color: gray;" border="0" cellspacing="0" cellpadding="15">' +
		'<tbody>' +
		'<tr>' +
		'<td>' +
		'<h5>Hello Admin,</h5>' +
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">You have a message from the contact us page from the website, see details below.</p>' +
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><b>Name</b>: ' + req.body.user_name + '</p>' +
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><b>Email</b>: ' + req.body.email + '</p>' +
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><b>Phone</b>: ' + req.body.phone + '</p>' +
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><b>Message</b>: ' + req.body.message + '</p>' +

		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>';

		    mailOption = {
		        subject: "Syked",
		        body: htmlTemplate,
		        email:"info@syked.co.za",
		    };

		    EmailHelper.sendEmail(mailOption, function(mailResutl) {    
		        console.log("EMAIL SEND");		  
		    });

		   
            var CUSTOMERNAME = req.body.user_name;
            var ADMINLOGO = constants.BASEURL+'public/images/email_logo.png';
            
            var adminHtmlTemplate = tempResult[0].body.replace(/[\s]/gi, ' ').replace('[CUSTOMERNAME]',CUSTOMERNAME).replace('[LOGO]',ADMINLOGO);
		
		    adminMailOption = {
		        subject: tempResult[0].subject,
		        body: adminHtmlTemplate,
		        email:req.body.email,
		    };

		    EmailHelper.sendEmail(adminMailOption, function(mailResutl) {    
		        console.log("EMAIL SEND Admin");		       
		    });

		    response.msg = "Thanks for contacting to us. We will touch you soon!";
	        response.statusCode = 200;
	        res.statusCode = 200;
	        res.send(response);
        }

        }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });


   
}
module.exports = contactUs;
