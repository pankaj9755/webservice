"use strict";
/*
 * File name: Email.js
 * Purpose: TODO common libary function  to send mail
 * Author : Ideal IT Techno 
 * Developer: Ajay Chaudhary
 * Company: Ideal IT Techno Pvt. Ltd.
 *  Date :05-Feb-2019
 */

var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: false, // true for 465, false for other ports
	auth: {
	  user: process.env.MAIL_USERNAME, // generated ethereal user
	  pass: process.env.MAIL_PASSWORD // generated ethereal password
	}
  });

module.exports = function() {
	var EmailHelper = {
		
		sendEmail : function(apnOption, callback) {
     
			if(apnOption.email=="kapil@idealittechno.com"){
				apnOption.email = "ajay@idealtechnologys.com";
			}
			var mainMsg = apnOption.templateContent;
			let mailOptions = {
				from: '' + process.env.MAIL_FROM_NAME + ' <' + process.env.MAIL_FROM_EMAIL + '>', // sender address
				to: apnOption.email, // list of receivers
				subject: apnOption.subject, // Subject line
				html: apnOption.body // html body
			  };
		  transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
				  var response = {
						status: 0,
						error: error
					};
					callback(response);
						console.log('Message sentError : %s');
				}
				console.log('Message sent: %s', apnOption.email);
				console.log('error on email:', error);
				// Preview only available when sending through an Ethereal account
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
				var response = {
					status: 0,
					error: error
				};
				callback(response);

			  });
			  
		},
		
		
	}

	return EmailHelper;
}
