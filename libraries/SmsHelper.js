"use strict";
/*
 * File name: Smshelper.js
 * Purpose: TODO common libary function  to send sms 
 * Author : Ideal IT Techno 
 * Developer: Ajay Chaudhary
 * Company: Ideal IT Techno Pvt. Ltd.
 *  Date :12-Aug-2019
 */

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;  // Your Auth Token from www.twilio.com/console
var  fromNumber = process.env.TWILIO_NUMBER;
const client = require('twilio')(accountSid, authToken); 


module.exports = function() {
	var SmsHelper = {
		
		sendSMS : function(apnOption, callback) {
     
			console.log('apnOption',apnOption);
			console.log('process.env.TWILIO_NUMBER',process.env.TWILIO_NUMBER);
			// As the auth_id and auth_token are unspecified, Plivo will fetch them from the PLIVO_AUTH_ID and PLIVO_AUTH_TOKEN environment variables.
			
			
			  
			client.messages.create({
					 body: apnOption.body,
					 from: fromNumber, // From a valid Twilio number
					 to: apnOption.to,  // Text this number
					 
					
				}).then(function (response) {
					console.log('SMS here==================',response);
					console.log('apnOption',apnOption);
					
					var response = {
						status: 1,
						
					};
					callback(response);
				}, function (err) {
					var response = {
						status: 0,
						
					};
					callback(response);
				});
		  },
		  callDetail : function(apnOption,Callback){
			 var response = {
						status: 0,
						result:{},
					};
			 client.video.rooms(apnOption.room_id)
            .fetch()
            .then(function (room) {
				console.log('room here==================',room);
				var response = {
						status: 1,
						result:room
						
					};
				callback(response);
			},function (err) {
					var response = {
						status: 0,
						err:err
					};
				callback(response);
			});
				
		 },
		
		
	}

	return SmsHelper;
}



