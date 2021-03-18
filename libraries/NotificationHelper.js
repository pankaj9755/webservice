"use strict";

var FCM = require('fcm-push');
var moment = require('moment');
// User-Notification
module.exports = function() {

var NotificationHelper = {
	sendNotification : function(user_info, msg, id, callback) {
	    var serverKey = process.env.PUSH_AUTH_KEY;
	    var fcm = new FCM(serverKey);
	    var message = {};

	    if (user_info.device_type == 'android') {
	        var data = {
	            title: user_info.title,
	            id: user_info.id, //
	            user_id: 0, // user_info.id,
	            email: "", // user_info.email,
	            name: "", // user_info.first_name,
	            image: "", // user_info.image,
	            type: user_info.type,
	            badge: 1,
	            sound: 'default',
	            message: msg
	        }
            
            //for match squads
	        if(id == 'yes')
	        {
                data.match_squads = user_info.match_squads;
	        }else{
	        	data.match_squads = "";
	        }

	        message.data = data;
	    } else {
	       var notification = {
	            title: user_info.title,
	            id: user_info.id, //job id
	            user_id: 0, // user_info.id,
	            email: "", // user_info.email,
	            name: "", // user_info.full_name,
	            image: "", // user_info.profile_image,
	            type: user_info.type,
	            //badge: "",
	            sound: 'default',
	            message: msg,
	            body: msg,
	            heading: user_info.title,
	        }


	        message.notification = notification;
	    }
	    if (user_info.notification_key != '') {
	        message.to = user_info.notification_key;
	        message.collapse_key = 'your_collapse_key';

	        fcm.send(message).then(function (response) {
	            console.log("Successfully sent with response: ", response);
	            callback(response);
	        }).catch(function (err) {
	            callback(err);
	            console.log("Something has gone wrong!");
	           // console.log("----------")
	            console.error(err);
	        })
	    } else {
	        callback(true);
	    }
	},
	mutipleNotification :function(noti_ids,info, callback) {
		var serverKey = process.env.PUSH_AUTH_KEY;
	    var fcm = new FCM(serverKey);
	    var message = {};
		var i,j,temparray,chunk = 450;

		for (i=0,j=noti_ids.length; i<j; i+=chunk) {
			(function(i) {
				temparray = noti_ids.slice(i,i+chunk);
			
				if (info.device_type == 'android') {
					var data = {
						title: info.title,
						id: info.id, //site id
						user_id: 0, // user_info.id,
						email: "", // user_info.email,
						name: "", // user_info.first_name,
						image: "", // user_info.image,
						type: info.type,
						badge: 1,
						sound: 'default',
						message: info.msg
					}

					message.data = data;
					message.registration_ids = temparray;
					message.collapse_key = 'your_collapse_key';

					
				} if (info.device_type == 'iphone') {
					var notification = {
						title: info.title,
						id: info.id, //site id
						user_id: 0, // user_info.id,
						email: "", // user_info.email,
						name: "", // user_info.full_name,
						image: "", // user_info.profile_image,
						type: info.type,
						//badge: "",
						sound: 'default',
						message: info.msg,
						body: info.msg,
						heading: info.title,
					}
				
					message.notification = notification;
					message.registration_ids = temparray;
					message.collapse_key = 'your_collapse_key';
				}else{
					var notification = {
						title: info.title,
						id: info.id, //site id
						user_id: 0, // user_info.id,
						email: "", // user_info.email,
						name: "", // user_info.full_name,
						//image: "https://syked.co.za/admin/assets/images/white_logo.png", // user_info.profile_image,
						type: info.type,
						//badge: "",
						sound: 'default',
						message: info.message,
						body: info.message,
						icon:"https://syked.co.za/web/assets/images/logo.png",
						click_action:info.click_action,
						heading: info.title,
					}
				
					message.notification = notification;
					message.registration_ids = temparray;
					message.collapse_key = 'your_collapse_key';
				}
				
				fcm.send(message).then(function (response) {
					  console.log('send-----------------'+response);
					}).catch(function (err) {
						console.log('error was notification',err);
						console.log('key is',temparray);
					})
				
				
			}) (i)
		}
		callback(true);
		
	},
	 mutipleVideoNotification: function (noti_ids, info, callback) {
      var serverKey = process.env.PUSH_AUTH_KEY;
      var fcm = new FCM(serverKey);
      var message = {};
      var i,
        j,
        temparray,
        chunk = 450;

      for (i = 0, j = noti_ids.length; i < j; i += chunk) {
        (function (i) {
          temparray = noti_ids.slice(i, i + chunk);
          if (info.device_type == "iOS") {
            var notification = {
              title: info.title,
              id: info.id, //site id
              user_id: 0, // user_info.id,
              email: "", // user_info.email,
              name: "", // user_info.full_name,
              image: "", // user_info.profile_image,
              type: info.type,
              //badge: "",
              sound: "videoCallingRing.wav",
              message: info.message,
              body: info.message,
              heading: info.title,
              click_action: info.click_action,
              heading: info.title,
              video_token: info.video_token,
              room: info.room,
              to_user: info.to_user,
              from_user: info.from_user,
              room_unique_id: info.room_unique_id,
              remain_second: info.remain_second,
              room_id: info.room_id,
              time: moment().utc().format("YYYY-MM-DD HH:mm:ss")
            };

            message.notification = notification;
            message.registration_ids = temparray;
            message.collapse_key = "your_collapse_key";
          } else {
            var notification = {
              title: info.title,
              id: info.id, //site id
              user_id: 0, // user_info.id,
              email: "", // user_info.email,
              name: "", // user_info.full_name,
              //image: "https://syked.co.za/admin/assets/images/white_logo.png", // user_info.profile_image,
              type: info.type,
              //badge: "",
              sound: "default",
              message: info.message,
              body: info.message,
              icon: "https://syked.co.za/web/assets/images/logo.png",
              //click_action:"https://syked.co.za/web/",
              click_action: info.click_action,
              heading: info.title,
              video_token: info.video_token,
              room: info.room,
              to_user: info.to_user,
              from_user: info.from_user,
              room_unique_id: info.room_unique_id,
              remain_second: info.remain_second,
              room_id: info.room_id,
              
            };

            message.data = notification;
            message.registration_ids = temparray;
            message.collapse_key = "your_collapse_key";
          }
          console.log("video calling notification");
          fcm
            .send(message)
            .then(function (response) {
              console.log("video calling notification send");
              console.log("send------" + response);
            })
            .catch(function (err) {
              console.log("error was notification", err);
             // console.log("key is", temparray);
            });
        })(i);
      }
      callback(true);
    },
}
return NotificationHelper;
}
