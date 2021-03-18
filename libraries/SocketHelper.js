"use strict";
/*
 * File name: SocketHelper.js
 * Purpose: TODO inform to users if any activity to web and admin inform .  
 * Author : Ideal IT Techno 
 * Developer: Ajay Chaudhary
 * Company: Ideal IT Techno Pvt. Ltd.
 * Date :20-Dec-2018
 */
 
var io = require('socket.io-client');
var socket = io.connect('https://syked.co.za:3002', {
		secure: true,
		rejectUnauthorized: false
	});

module.exports = function() {
	var SocketHelper = {
		// inform to chat 
		userInform: function(apnOption, callback) {
			
			var sresponse = {
				"show_message": apnOption.show_message,
				"type": apnOption.type,					
				"sender_type": apnOption.sender_type,
				"user_id": apnOption.user_id,
				"id": apnOption.id,
				"is_success": apnOption.is_success,										
			};

			
			socket.emit("web_inform", sresponse);
			if(apnOption.is_admin_inform=='yes'){ // if also admin to emit 
				socket.emit("admin_inform", sresponse);
			}
			var response = {
				status: 0
			};
			callback(response);
		},
		multipleUserInform: function(apnOption,ids, callback) {
			
			ids.forEach(element => { 
			var sresponse = {
				"show_message": apnOption.show_message,
				"type": apnOption.type,					
				"sender_type": apnOption.sender_type,
				"user_id": element,
				"id": apnOption.id,
				"is_success": apnOption.is_success,										
			};
			
			  socket.emit("web_inform", sresponse);
			}); 
			
			var response = {
				status: 0
			};
			callback(response);
		},
		
	}

	return SocketHelper;
}
