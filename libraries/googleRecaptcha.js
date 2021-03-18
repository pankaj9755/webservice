"use strict";
/*
 * File name: googleRecaptcha.js
 * Purpose: TODO Check recaptcha from Google
 * Author : Ideal IT Techno 
 * Developer: Ajay Chaudhary
 * Company: Ideal IT Techno Pvt. Ltd.
 *  Date :22-Oct-2019
 */

let secret = process.env.SECRETKEY_RECAPTCHA;
const Request = require("request");
module.exports = function() {
	var googleRecaptcha = {
		
		verifyRecaptcha: function(apnOption, callback) {
			let token = apnOption.token;
			
			var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
				recaptcha_url += "secret=" + secret + "&";
				recaptcha_url += "response=" + token ;
				//recaptcha_url += "remoteip=" + request.connection.remoteAddress;
				Request(recaptcha_url, function(error, resp, body) {
					body = JSON.parse(body);
					if(body.success !== undefined && !body.success) {
						var response = {
						status: 0,
						body: JSON.stringify(body),
						};
						callback(response);
					}else{
						var response = {
							status: 1,
							body: JSON.stringify(body),
						};
						callback(response);
					}
				});
			
			
			
		},
		
		
		
	}

	return googleRecaptcha;
}
