const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var _ = require('lodash');
var moment = require('moment-timezone');
var fs = require('fs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../libraries/jwtHelper');
var EmailHelper =  require('./../../../libraries/EmailHelper')();


subscription = function(req, res) {
	
    const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = { 
    	email:req.body.email, 
    	name: req.body.name,
    };

    const rules = {
        email:'required',
        name:'required',
    };
    const validation = new Validator(data,rules);

    if(validation.fails()){
        response.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }       
		    
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
	'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Someone subscription to us. Below we mention name and email of user!</p>' +
	'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><b>Name</b>: '+req.body.name+'</p>' +
	'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><b>Email</b>: '+req.body.email+'</p>' +
	'</td>' +
	'</tr>' +
	'</tbody>' +
	'</table>' +
	'</td>' +
	'</tr>' +
	'</tbody>' +
	'</table>';

    mailOption = {
        subject: "User signing up to Syked",
        body: htmlTemplate,
        email:"info@syked.co.za",
    };

    EmailHelper.sendEmail(mailOption, function(mailResutl) {
        console.log("EMAIL SEND");		  
    });

    response.msg = "Thanks for signing up, a member of our team will be in touch soon";
    response.statusCode = 200;
    res.statusCode = 200;
    res.send(response);
   
}
module.exports = subscription;
