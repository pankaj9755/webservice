"use strict";
/*
 * File name: Email.js
 * Purpose: TODO common libary function  
 * Author : Ideal IT Techno 
 * Developer: Ajay Chaudhary
 * Company: Ideal IT Techno Pvt. Ltd.
 *  Date :14-March-2018
 */

var crypto = require('crypto');
var key = 'DtEcAaWZweSDhQc5PVnRLMYoHoWQEBlD';   //32 char long
var iv = 'DtEcAaWZweSDhQc5'; // 16 char long
var encryptionMethod = "AES-256-CBC";
//16 dight key 
//var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
//var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

module.exports = function() {
	var UtilityHelper = {
		oldencrypted: function(data) {
		var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
		var crypted = cipher.update(data, 'utf-8', 'hex');
			crypted += cipher.final('hex');
			return crypted;
		},
		olddecrypted: function(hexString) {
			var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
			var decrypted = decipher.update(hexString, 'hex', 'utf-8');
			decrypted += decipher.final('utf-8');
			return decrypted;
			
		},
		randomNumber: function(string_length) {
			    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"; 
				var randomstring = ''; 
				for (var i = 0; i < string_length; i++) {
					var rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum, rnum + 1);
				}
			return randomstring;
		},
		randomIntNumber: function(string_length) {
			    var chars = "0123456789"; 
				var randomstring = ''; 
				for (var i = 0; i < string_length; i++) {
					var rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum, rnum + 1);
				}
			return randomstring;
		},
		smscode : function(country_code,mobile_number,verification_code){
     
			const accountSid = process.env._SMS_AUTH_KEY;
            const authToken = process.env._SMS_AUTH_TOKEN;

            let plivo = require('plivo');
		    let client = new plivo.Client(accountSid,authToken);
		
			//~ client.messages.create(
				//~ '1919-822-9929', //  destination number +1 919-822-9929   
                //~ country_code + mobile_number,
			    //~ verification_code+' mobile verification code to your Barhop account. Regards Barhop Team'
			 //~ ).then(function(message_created) {
			 	//~ console.log(message_created)
			//~ });
		},
		encrypted: function(plain_text) {
			var encryptor = crypto.createCipheriv(encryptionMethod, key, iv);
			return encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64');
		},
		decrypted: function(encryptedMessage) {
			
			
			var decryptor = crypto.createDecipheriv(encryptionMethod, key, iv);
			return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
		},
		
		ucfirst: function(str, force) {
			str=force ? str.toLowerCase() : str;
			return str.replace(/(\b)([a-zA-Z])/,
			function(firstLetter) {
				return firstLetter.toUpperCase();
			});
		},

		ucwords: function(str,force) {
			str=force ? str.toLowerCase() : str;
			return str.replace(/(\b)([a-zA-Z])/g,
			function(firstLetter) {
				return firstLetter.toUpperCase();
			});
		},
		IsJsonString: function (str) {
		  try {
			JSON.parse(str);
		  } catch (e) {
			return false;
		  }
		  return true;
		},
	}

	return UtilityHelper;
}
