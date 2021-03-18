'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require("dotenv").config();
var FCM = require("fcm-push");

var http = require('http');
var path = require('path');
var AccessToken = require('twilio').jwt.AccessToken;
var Twilio = require('twilio');
var VideoGrant = AccessToken.VideoGrant;
const VoiceGrant = AccessToken.VoiceGrant;
var express = require('express');
//var randomName = require('./randomname');
var Video = require('twilio-video');
var fs = require('fs');
// Create Express webapp.
var app = express();

var server = http.createServer(app);
var io = require('socket.io')(server);

const cors = require("cors");
const constants = require('./config/adminConstants'),
    jwtAuth = require('./libraries/jwtHelper');
const dbConnection = require("./config/connection");
const UtilityHelper = require('./libraries/UtilityHelper')();
const NotificationHelper =  require('./libraries/NotificationHelper')();
var ls = require('local-storage');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
//var pkey = fs.readFileSync('./ssl/privkey.pem');
//var pcert = fs.readFileSync('./ssl/fullchain.pem');

var bodyParser = require('body-parser');
var pkey = fs.readFileSync('../../../../etc/letsencrypt/live/syked.co.za/privkey.pem');
var pcert = fs.readFileSync('../../../../etc/letsencrypt/live/syked.co.za/fullchain.pem');

var https = require('https');
var port = process.env.VIDEOPORT || 3002;
var randomstring = require("randomstring");
var moment = require('moment');
var options = {
  key: pkey,
  cert: pcert
};
var request = require('request');

//var customJs = require('./custom');
// Set up the paths for the examples.
[
  'bandwidthconstraints',
  'codecpreferences',
  'localvideofilter',
  'localvideosnapshot',
  'mediadevices'
].forEach(function(example) {
  var examplePath = path.join(__dirname, `../examples/${example}/public`);
  app.use(`/${example}`, express.static(examplePath));
});

// Set up the path for the quickstart.
var quickstartPath = path.join(__dirname, '../quickstart/public');
app.use('/quickstart', express.static(quickstartPath));

// Set up the path for the examples page.
var examplesPath = path.join(__dirname, '../examples');
app.use('/examples', express.static(examplesPath));

/**
 * Default to the Quick Start application.
 */
app.get('/', function(request, response) {
  response.redirect('/quickstart');
});

/*****************************************/
/**** START For Cross origin request. ****/
/*****************************************/
// add cors to express app
app.use(cors());
// configuration for CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));

var server = https.createServer(options, app);
var io = require('socket.io')(server);
server.listen(port, function() {
   console.log('Express server running on *:' + port);

});

app.get('/test', function(request, response) {
  const client = new Twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
    accountSid: process.env.TWILIO_ACCOUNT_SID
  });

  client.video.rooms
    .create({
      uniqueName: 'DailyStandup',
    })
    .then(room => {
      console.log(room.sid);
    });
  response.send("success");
});

app.get('/createroom', function(request, response) {
  var connectOptions = {
    name: 'test',
    logLevel: 'debug'
  };
  Video.connect("fdff", connectOptions)
  console.log('not connect:');
  response.send("success");
});



/**
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
app.get('/token', function(request, response) {
  var identity = randomstring.generate({
    length: 5,
    charset: 'alphabetic'
  });
  var location = "Indore";
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    'AC0c39fc85dbbc3ac0447068994ef8f769',
    'SK0b1b9fa2a81642ee3d990e5fea4c4523',
    'PwzZPwgZniUurvFc0duQcHDb0p0DjfzR'
  );

  // Assign the generated identity to the token.
  token.identity = identity;
  token.location = location;
  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  console.log('called token',token.toJwt());
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});
// for audio called token
app.get('/audio-token', function(request, response) {
  var identity = randomstring.generate({
    length: 5,
    charset: 'alphabetic'
  });
  var location = "Indore";
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    'AC0c39fc85dbbc3ac0447068994ef8f769',  // test AC633c569f69e12a660c730190570d98d2 
    'SK0b1b9fa2a81642ee3d990e5fea4c4523', // test 
    'PwzZPwgZniUurvFc0duQcHDb0p0DjfzR' // test 
  );

  // Assign the generated identity to the token.
  token.identity = identity;
  token.location = location;
  // Create a "grant" which enables a client to use Voice as a given user
	const voiceGrant = new VoiceGrant({
	  outgoingApplicationSid: 'AP804fe6337f3e9e3ce0a7a0067abba6d7',
	  incomingAllow: true, // Optional: add to allow incoming calls
	});
	token.addGrant(voiceGrant);
    token.identity = identity;

  // Serialize the token to a JWT string and include it in a JSON response.
  console.log('called token',token.toJwt());
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});
// audio end point with xml
// for audio called token
app.post('/makeCall', function(request, response) {
	//console.log('request=============',request);
  console.log('request=============',request.body);

	const twiresponse = new VoiceResponse();
	const dial = twiresponse.dial({
			callerId: process.env.TWILIO_NUMBERVOICE
		});
		//dial.number('+919977757437');
		dial.number(request.body.to);
	//~ //response.type('application/xml');
	response.send(twiresponse.toString());
	
});



/**
 * Generate an Access Token for a chat application user - app
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
app.get('/usertoken', function(request, response) {
  var identity = request.param('name');
  var location = request.param('location');

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
   process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;
  token.location = location;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);
  console.log('Express server running on *:' + location + '  ' + identity + '');
  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

//socket 
io.on('connection', function(socket) {
  socket.on("error", function(err) {
    console.log('issue in connection', err);
  });

  socket.on('update-video-time', function(data, callBack) {
    var authData = JSON.parse(data);
    jwtAuth.JWTVerify(authData.token).then((jwtData) => {
        if (jwtData.status !== false) {  
            //let updateSql = "UPDATE user_video_plan SET used_seconds = used_seconds + 5 WHERE user_id = '"+jwtData.verify.id+ "' and plan_id = '"+authData.plan_id+"'";
            let updateSql = "UPDATE user_video_plan SET used_seconds = used_seconds + 5 WHERE  id = '"+authData.plan_id+"'";
                   
            dbConnection.query(updateSql, { 
              type: dbConnection.QueryTypes.UPDATE,
            }).then(function(UPDATE_RE) {
              if(UPDATE_RE){
                  callBack({
                  "success": 1,
                  "msg": "update",
                });
              }
            })
        }else{
            callBack({
              "success": 0,
              "msg": "Token mis match",
            });
        }

    }).catch(function(err) {
		console.log('err on update-video-time',err);
        callBack({
          "success": 0,
          "msg": "Token mis match",
        });
    });
  })
  


  
  //==========================================Login=============================
  socket.on('login', function(data, callBack) {
    
    var authData = JSON.parse(data);
    
    jwtAuth.JWTVerify(authData.token).then((jwtData) => {
		  console.log('login jwtData',jwtData.status);

		 if (jwtData.status !== false) {  
      console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv '+ jwtData.verify.id)
			let selectSql = "SELECT * FROM users_master WHERE id="+jwtData.verify.id+ "";
			dbConnection.query(selectSql, { 
				type: dbConnection.QueryTypes.SELECT,
				
			}).then(function(user_result) {
				if(user_result.length > 0){
				 var uniqueId = 'user_'+ user_result[0].id;
				 console.log('login socket ',uniqueId);
				ls.set(uniqueId,{
							'socket_ids': socket.id,
							'user_id': user_result[0].id,
							'user_email':  UtilityHelper.decrypted(user_result[0].email),
							'name': user_result[0].first_name+' '+user_result[0].last_name,
							'user_type' : user_result[0].user_type,
						});

				ls.set(socket.id, {
					'socket_ids': socket.id,
					'user_id': user_result[0].id,
					'user_email': UtilityHelper.decrypted(user_result[0].email),
					'name':user_result[0].first_name+' '+user_result[0].last_name,
					'user_type' : user_result[0].user_type,

				});
				socket.join(uniqueId);
        var current_time = moment().utc().format("YYYY-MM-DD HH:mm:ss");
          // online socket
          var onlineInfo = {
            user_id: user_result[0].id,
            is_online: "yes",
            message: "online",
            msg: "online",
            last_seen: current_time,
          };
          console.log('************************************************')
          console.log(onlineInfo.user_id)
          io.emit("online", onlineInfo);
				  callBack({
					  "success": 1,
					  "msg": "login",
					});
				}else{
					
					callBack({
					  "success": 0,
					  "msg": "not login",

					});
				}
			}).catch(function(err) {
				
					callBack({
				  "success": 0,
				  "err":err,
				  "msg": "not chat",
				});
			});
		}else{
			callBack({
			  "success": 0,
			  "msg": "not chat",

			});
		}
	 }).catch(function(err) {
		 
      callBack({
			  "success": 0,
			  "msg": "not chat",
			});
    });
     
    //io.sockets.emit('sender', json);
   
  });
  ////////////////////////////////////Call start=========================================
  socket.on('callstart', function(data, callBack) {
	 
    var callData = JSON.parse(data);
   
    var uniqueId = 'user_'+ callData.therapist_id;
    if (ls.get(uniqueId) != null) {
		
		var json = JSON.stringify({
			"message": "calling to patient...",
			
		});
		if (ls.get(uniqueId).socket_ids != undefined) {
			io.sockets.in(ls.get(uniqueId).socket_ids).emit('callreceived',json);
			
		}else{
			
		}
	}
	else{
		// nothing to do
		
	}
    
  });
  
  //========================================callend at app side===============================
  socket.on('callend', function(data, callBack) {
    console.log('callend');
    var json = JSON.stringify({
      "name": "end called...",

    });
    io.sockets.emit('callend', json);

  });
  // Call reject
  socket.on('callreject', function(data, callBack) {
    console.log('callreject');
    var json = JSON.stringify({
      "name": "call reject",
    });
    io.sockets.emit('callreject', json);
  });

  // update the location of users
  socket.on('updatelocation', function(data, callBack) {
    var authData = JSON.parse(data);
    console.log('update location + ');
    var json = JSON.stringify({
      "lat": authData.lat,
      "long": authData.long,
    });
    io.sockets.emit('getlocation', json);
  });

  socket.on('join_room',function(room,callBack){ 
    //console.log('[socket]','join room :',room);
    jwtAuth.JWTVerify(room.video_token).then((tokenData) => {
		var uniqueId = 'user_'+ room.to_user;
		var name = "Someone";
		if(ls.get('user_'+ room.from_user) != null){
		  var name = ls.get('user_'+ room.from_user).name;
		}
		console.log('join_room ---------------'+room.room);
		var remainsec = tokenData.verify.seconds - tokenData.verify.used_seconds;
		var msg = "Calling from "+name;
		if(ls.get(uniqueId) != null){
		 
		  console.log('join_room online---------------');
		  io.sockets.to(ls.get(uniqueId).socket_ids).emit('video_calling',{"video_token":room.video_token,'room':room.room,'to_user':room.to_user,'from_user':room.from_user,'room_unique_id':room.room_unique_id,'type':'video_calling','title':'Video Call','msg':msg,'remain_second':remainsec,'room_id':tokenData.verify.id});
		}else{
		  console.log('join_room offline---------------');
			// inform to called user to offlfine
			 var uniqueIdFrom = 'user_'+ room.from_user; 
			 // after 10 seconds
			 //~ setTimeout(function () {
				 //~ if(ls.get(uniqueIdFrom) != null){
				 //~ io.sockets.to(ls.get(uniqueIdFrom).socket_ids).emit('video_calling_offline',{'to_user':room.to_user,'from_user':room.from_user,'type':'video_calling_offline','title':'User Offline','msg':'User was offline'});
				//~ }
			//~ }, 20000);
			 
			
			// send notification to 
			let selectSql = "SELECT id,notification_key,device_type FROM users_master WHERE id="+room.to_user+ "";
			dbConnection.query(selectSql, { 
				type: dbConnection.QueryTypes.SELECT,
				
			}).then(function(user_result) {
				if(user_result.length > 0){
					var webIds = [];
					var notificationData = {"video_token":room.video_token,'room':room.room,'to_user':room.to_user,'from_user':room.from_user,'room_unique_id':room.room_unique_id,'type':'video_calling','title':'Video Call','msg':msg,'remain_second':remainsec,'room_id':tokenData.verify.id};
					if (user_result[0].device_type != "web") {
						 console.log('notifcation offline---------------');
						webIds.push(user_result[0].notification_key);
						notificationData.id = '';
						notificationData.title = 'Syked Calling';
						notificationData.message = msg;
						notificationData.type = 'video_calling';
						notificationData.device_type = user_result[0].device_type;
						notificationData.click_action = '';
												  
						NotificationHelper.mutipleVideoNotification(
						  webIds,
						  notificationData,
						  function (notificationResponse) {}
						);
					}
				}
			});
			//end
		}
	});
  })


  socket.on('accept_video_call',function(data,callBack){ 
    var uniqueId = 'user_'+ data.to_user;
    if(ls.get(uniqueId) != null){
      var msg = "Accept Call";
      io.sockets.to(ls.get(uniqueId).socket_ids).emit('accept_video_call',{'room':data.room,'to_user':data.to_user,'from_user':data.from_user,'msg':msg,'type':'accept_video_call',
			'title':'Accept Call'});
    }else{
      console.log('offline---------------');
    }
  })

  socket.on('reject_video_call',function(data,callBack){ 
    console.log('reject_from_user---------------'+data.from_user);
    console.log('reject_to_userl---------------'+data.to_user);
    var uniqueId = 'user_'+ data.to_user;
    if(ls.get(uniqueId) != null){
      var msg = "Call has been rejected";
      io.sockets.to(ls.get(uniqueId).socket_ids).emit('reject_video_call',{'type':'reject_video_call',
			'title':'Reject Call','to_user':data.to_user,'from_user':data.from_user,'msg':msg});
    }else{
      console.log('offline---------------');
    }
  })


  socket.on('end_video_call', function(data, callBack) {
    console.log('end_video_calling---------------');
    var authData = data;
    var uniqueId = 'user_'+ authData.to_user;
    
    var msg = "Call has been ended";
    if(ls.get(uniqueId) != null){
        var msg = "";
        io.sockets.to(ls.get(uniqueId).socket_ids).emit('end_video_call',{
			'room':authData.room,
			'type':'end_video_call',
			'title':'End Call',
			'to_user':authData.to_user,
			'from_user':authData.from_user,
			'msg':msg
		});
    }else{
        console.log('end_video_call user offline---------------');
    }
  });

  socket.on('disconnect', function() {
    if (ls.get(socket.id) != null) {
      if (ls.get(socket.id).user_id != undefined) {
        var user_id = ls.get(socket.id).user_id;
        var uniqueId = 'user_'+ user_id;
        // remove particular soceket of user
         console.log('============= disconnect called uniqueId====',uniqueId);
        if(ls.get(uniqueId) != null){
          ls.remove(uniqueId);
          ls.remove(socket.id);
        }
        var current_time = moment().utc().format("YYYY-MM-DD HH:mm:ss");
        // offline socket
        var offlineInfo = {
          user_id: user_id,
          is_online: "no",
          message: "Offline",
          msg: "Offline",
          last_seen: current_time,
        };
        io.emit("offline", offlineInfo);
        return 1;       
      } else {
        return 1;
      }
    } 
  });

  //===========================Start the typing ==================
    socket.on('typeMessage', function(data, callBack) {
      var callData = JSON.parse(data);
      var uniqueId = 'user_'+ callData.to_id;
      console.log("typeMessage",callData);
      if (ls.get(uniqueId) != null) {
        var json = JSON.stringify({
            "message": "typing...",
            "from_id": callData.from_id
        });
        if(ls.get(uniqueId).socket_ids != undefined) {
          io.sockets.in(ls.get(uniqueId).socket_ids).emit('typeMessage',json);        
        }
      }       
    });
     //=========================== user info ==================
  socket.on("userInfo", function (data, callBack) {
    var callData = JSON.parse(data);
    var uniqueId = "user_" + callData.id;
    console.log("--------------------------------------");
    console.log("userInfo", callData);
    let selectSql =
      "SELECT id, first_name, last_name, profile_image FROM users_master WHERE id=" +
      callData.id +
      "";
    dbConnection
      .query(selectSql, {
        type: dbConnection.QueryTypes.SELECT,
      })
      .then(function (user_result) {
        var resposne = {
          is_online: "yes",
          id: callData.id,
        };
        if (user_result.length > 0) {
          resposne.name =
            user_result[0].first_name + " " + user_result[0].last_name;
          resposne.profile_image = user_result[0].profile_image;
        }
        if (ls.get(uniqueId) != null) {
          callBack(resposne);
        } else {
          resposne.is_online = "no";
          callBack(resposne);
        }
      })
      .catch(function (err) {
        callBack({
          success: 0,
          err: err,
          msg: "Something went wrong ...111111",
          message: "Something went wrong 111",
        });
      });
  });


    //Private message
    socket.on("sendChatMessage", function (data, callBack) {

      var callData = JSON.parse(data);
      var uniqueId = 'user_'+ callData.receiver_id;
      console.log('privateMessage======',callData);
      //insert chat users
      if(ls.get(uniqueId) != null){  
        var uuid = callData.receiver_id;
      }

      let selectSql = "SELECT id, notification_key, device_type FROM users_master WHERE id="+callData.receiver_id+ "";
        dbConnection.query(selectSql, { 
        type: dbConnection.QueryTypes.SELECT,
      }).then(function(user_result) {
        let insertSql = "Insert into chat_history set receiver_id =:to_id,sender_id =:from_id,message =:message,type =:type";
        dbConnection.query(insertSql, { 
          type: dbConnection.QueryTypes.INSERT,     
          replacements: {to_id:callData.receiver_id,from_id:callData.sender_id,message:callData.message,type:'text'}           
        }).then(function(result12) {
			    var current_time = moment.utc();
          var message_data = JSON.stringify({
            sender_id: callData.sender_id,
            receiver_id: String(callData.receiver_id),
            name: callData.name,
            message: callData.message,
            id: result12[0],
            request_id: callData.request_id,
            sender_type: callData.sender_type,
            created_at:current_time,
          });  
          if(ls.get(uniqueId) != null){  
            io.sockets.in(ls.get(uniqueId).socket_ids).emit('sendChatMessage', message_data);
          } else {
              // send notification message
              if (user_result[0].device_type != "web") {
                //  send notification
                var serverKey = process.env.PUSH_AUTH_KEY;
                var fcm = new FCM(serverKey);
                var message = {};
                var notification = {
                  title: "New message",
                  body: callData.message,
                  message: callData.message,
                  user_id: callData.sender_id,
                  request_id: callData.request_id,
                  badge: 1,
                  sound: "default",
                  type: "CHAT_MESSAGE",
                  name: callData.name,
                };
                if (user_result[0].device_type == "android") {
                  message.data = notification;
                } else {
                  message.notification = notification;
                }
                if (user_result[0].notification_key != "") {
                  message.to = user_result[0].notification_key;
                  message.collapse_key = "your_collapse_key";
                  fcm
                    .send(message)
                    .then(function (response) {
                      // console.log(
                      //   "Successfully sent with response: ",
                      //   response
                      // );
                      callback(response);
                    })
                    .catch(function (err) {
                      // callback(err);
                      // console.log("Something has gone wrong!");
                    });
                } else {
                  callback(true);
                }
              }
            }
          callBack({
            "success": 1,
            "id":result12[0],
            "msg": "message sent",
            "message": "message sent",
            "created_at":current_time,
          });
        }).catch(function(err) {
          console.log(err);
          callBack({
            "success": 0,
            "err":err,
            "msg": "Something went wrong 111",
            "message": "Something went wrong 111",
          });
        });
      }).catch(function(err) {
        callBack({
          "success": 0,
          "err": err,
          "msg": "Something went wrong ...111111",
          "message": "Something went wrong 111",
        });
      });
    //send the data to all the clients who are accessing the same site(localhost)
    });
    //End message
    
    
    //===========================Open agreement pop if therapist want ==================
    socket.on('patient_agreement', function(data, callBack) {
		
      	var callData = JSON.parse(data);
      	console.log('patient_agreement=================================',callData);
      	let selectSql = "SELECT id,customer_id,therapist_id FROM requests WHERE id="+callData.request_id+ "";
		dbConnection.query(selectSql, { 
			type: dbConnection.QueryTypes.SELECT,
		}).then(function(user_result) {
			var uniqueId = 'user_'+ user_result[0].customer_id;
			var name = '';
			if(ls.get(uniqueId) != null){  
				name = ls.get(uniqueId).name;
			}
			console.log('uniqueId==========='+uniqueId);
			 var message_data = JSON.stringify({
                request_id: callData.request_id,
                 room: callData.request_id,
                'type':'patient_agreement_open',
				'title':'Agreement',
				'msg':'i <b>'+name+' </b>promise not to do anything to harm myself or to take my own life, If i am desperate, i will phone one of the following numbers to talk to someone who cares.<br><br> Lifeline 011 616 7889<br> Suicide Crisis Line 0800 567 567',
                
            });  
			if(ls.get(uniqueId) != null){  
				console.log('emit to users for patient_agreement_open =========================');
    			io.sockets.in(ls.get(uniqueId).socket_ids).emit('patient_agreement_open',message_data);
    		}
            callBack({
	        	"success": 1,
	        	"msg": "message sent",
	      	});
			
		});       
	});
	socket.on('patient_agreement_action', function(data, callBack) {
		console.log('patient_agreement_action=================================');
      	var callData = JSON.parse(data);
      	let selectSql = "SELECT id,customer_id,therapist_id FROM requests WHERE id="+callData.request_id+ "";
		dbConnection.query(selectSql, { 
			type: dbConnection.QueryTypes.SELECT,
		}).then(function(user_result) {
			var uniqueId = 'user_'+ user_result[0].therapist_id;
			 if(callData.action=='accept'){
				var msg = "Patient has accepted";
			}else{
				var msg = "Patient has declined";
			}
			 var message_data = {
                request_id: callData.request_id,
                room: callData.request_id,
                //msg: callData.user_name+' was '+callData.action+ ' the agreement! ',
                msg:msg,
                action: callData.action,
                type: 'patient_agreement_action',
                title: 'Agreement',
                
            };  
			if(ls.get(uniqueId) != null){  
				console.log('emit to users for patient_agreement_action =========================');
				console.log('callData.request_id =========================',callData.request_id);
				console.log('uniqueId =========================',uniqueId);
				uniqueId
    			io.sockets.in(ls.get(uniqueId).socket_ids).emit('patient_agreement_action',message_data);
    		}
            callBack({
	        	"success": 1,
	        	"msg": "message sent",
	      	});
			
		});       
	});
	

    // know to web
    socket.on('web_inform', function(data, callBack) {
    
      console.log('web inform',data);
    
      io.emit("user_notify_"+data.user_key, {
        "sender_type": data.sender_type,
        "is_success": data.is_success,
        "show_message": data.show_message,
        "type": data.type,
        'id': data.id
      }); 
      // this for website to send unquie key emit 
   
      console.log('herer========');
      if (data.user_id != null) {
        var uniqueId = 'user_'+ data.user_id;
       
        if (ls.get(uniqueId) != null && ls.get(uniqueId).socket_ids != undefined) {
          console.log('i am aherere',ls.get(uniqueId));
          io.sockets.in(ls.get(uniqueId).socket_ids).emit('user_notify',{
            "sender_type": data.sender_type,
            "is_success": data.is_success,
            "show_message": data.show_message,
            "type": data.type,
            'id': data.id
          });
        }
      }   
    });
    //==========================================Admin Login=============================
  socket.on('adminLogin', function(data, callBack) {
    console.log('admin login socket');
    var authData = JSON.parse(data);
    jwtAuth.JWTVerify(authData.token).then((jwtData) => {
		  console.log('jwtData',jwtData.verify);
		 if (jwtData.status !== false) {  
			let selectSql = "SELECT * FROM admin WHERE id="+jwtData.verify.id+ "";
			dbConnection.query(selectSql, { 
				type: dbConnection.QueryTypes.SELECT,
				
			}).then(function(user_result) {
				if(user_result.length > 0){
				 var uniqueId = 'admin_'+ user_result[0].id;
				ls.set(uniqueId,{
							'socket_ids': socket.id,
							'user_id': user_result[0].id,
							'user_email': user_result[0].email,
							'name': user_result[0].first_name,
							'user_type' : 'admin',
						});

				ls.set(socket.id, {
					'socket_ids': socket.id,
					'user_id': user_result[0].id,
					'user_email': user_result[0].email,
					'name': user_result[0].first_name,
					'user_type' : 'admin',

				});
				socket.join(uniqueId);
				  callBack({
					  "success": 1,
					  "msg": "login",

					});
				}else{
					
					callBack({
					  "success": 0,
					  "msg": "not login",

					});
				}
			}).catch(function(err) {
				
					callBack({
				  "success": 0,
				  "err":err,
				  "msg": "not chat",
				});
			});
		}else{
			callBack({
			  "success": 0,
			  "msg": "not chat",

			});
		}
	 }).catch(function(err) {
		 
      callBack({
			  "success": 0,
			  "msg": "not chat",
			});
    });
     
    //io.sockets.emit('sender', json);
   
  });
  // live suport enable/disable
  socket.on('liveSupport', function(data, callBack) {
	  console.log('liveSupport calling');
	  var emitData = {
		'is_live': data.is_live,
		'id': data.id,
		'therapist_id': data.therapist_id,
		'url': data.url,
		'stream_id': data.stream_id,
	};
	console.log('liveSupport============',emitData);
	 io.sockets.emit('liveSupport', emitData);
	   callBack({
		  "success": 1,
		  "msg": "login",

		});
  });
  /*
  * Live chat support chat send
  */
  socket.on("sendLiveChatMessage", function (data, callBack) {

      let callData = JSON.parse(data);
      jwtAuth.JWTVerify(callData.token).then((jwtData) => {
	    if (jwtData.status !== false) {  
            let user_id = jwtData.verify.id;
			console.log('sendLiveChatMessage======',callData);
			let insertSql = "Insert into support_chat set live_video_id =:live_video_id,user_id =:user_id,message =:message";
			dbConnection.query(insertSql, { 
			  type: dbConnection.QueryTypes.INSERT,     
			  replacements: {user_id:user_id,live_video_id:callData.live_video_id,message:callData.message}           
			}).then(function(result12) {
				var current_time = moment.utc();
				var message_data = JSON.stringify({
					user_id: user_id,
					name: 'Anonymous',
					profile_image: callData.profile_image,
					user_type: jwtData.verify.user_type,
					message: callData.message,
					id: result12[0],
					created_at:current_time,
				});  
				  
		  io.sockets.emit('receivedLiveChatMessage', message_data);
				 
          callBack({
            "success": 1,
            "id":result12[0],
            "msg": "message sent",
            "message": "Message Sent",
            "created_at":current_time,
          });
        }).catch(function(err) {
		console.log('here');
          console.log('sendLiveChatMessage',err);
          callBack({
            "success": 0,
            "err":err,
            "msg": "Something went wrong 111",
            "message": "Something went wrong 111",
          });
        });
      }else{
		callBack({
            "success": 0,
            //"err":err,
            "msg": "Something went wrong 222",
            "message": "Something went wrong 222",
          });
	  }
      
    //send the data to all the clients who are accessing the same site(localhost)
    });
   });
  

}); //end socket



