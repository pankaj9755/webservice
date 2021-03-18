'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require("dotenv").config();

var http = require('http');
var path = require('path');
var AccessToken = require('twilio').jwt.AccessToken;
var Twilio = require('twilio');
var VideoGrant = AccessToken.VideoGrant;
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
var ls = require('local-storage');

//var pkey = fs.readFileSync('./ssl/privkey.pem');
//var pcert = fs.readFileSync('./ssl/fullchain.pem');


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
 console.log('connection made');
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
        callBack({
          "success": 0,
          "msg": "Token mis match",
        });
    });
  })


  
  //==========================================Login=============================
  socket.on('login', function(data, callBack) {
    console.log('login socket');
    var authData = JSON.parse(data);
    jwtAuth.JWTVerify(authData.token).then((jwtData) => {
		  console.log('jwtData',jwtData.verify);
		 if (jwtData.status !== false) {  
			let selectSql = "SELECT * FROM users_master WHERE id="+jwtData.verify.id+ "";
			dbConnection.query(selectSql, { 
				type: dbConnection.QueryTypes.SELECT,
				
			}).then(function(user_result) {
				if(user_result.length > 0){
				 var uniqueId = 'user_'+ user_result[0].id;
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
				console.log('socket.id',socket.id);

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
    var uniqueId = 'user_'+ room.to_user;
    var name = "Someone";
    if(ls.get('user_'+ room.from_user) != null){
      var name = ls.get('user_'+ room.from_user).name;
    }

    console.log('join_room ---------------'+room);
    

    if(ls.get(uniqueId) != null){
      var msg = "Calling from "+name;
      io.sockets.to(ls.get(uniqueId).socket_ids).emit('video_calling',{"video_token":room.video_token,'room':room.room,'to_user':room.to_user,'from_user':room.from_user,'msg':msg});
    }else{
      console.log('offline---------------');
      // inform to called user to offlfine
     var uniqueIdFrom = 'user_'+ room.from_user; 
     if(ls.get(uniqueIdFrom) != null){
		 io.sockets.to(ls.get(uniqueIdFrom).socket_ids).emit('video_calling_offline',{'to_user':room.to_user,'from_user':room.from_user,'msg':'User was offline'});
	 }
    }
  })


  socket.on('accept_video_call',function(data,callBack){ 
    var uniqueId = 'user_'+ data.to_user;
    if(ls.get(uniqueId) != null){
      var msg = "";
      io.sockets.to(ls.get(uniqueId).socket_ids).emit('accept_video_call',{'room':data.room,'to_user':data.to_user,'from_user':data.from_user,'msg':msg});
    }else{
      console.log('offline---------------');
    }
  })

  socket.on('reject_video_call',function(data,callBack){ 
    console.log('reject_from_user---------------'+data.from_user);
    console.log('reject_to_userl---------------'+data.to_user);
    var uniqueId = 'user_'+ data.to_user;
    if(ls.get(uniqueId) != null){
      var msg = "";
      io.sockets.to(ls.get(uniqueId).socket_ids).emit('reject_video_call',{'to_user':data.to_user,'from_user':data.from_user,'msg':msg});
    }else{
      console.log('offline---------------');
    }
  })


  socket.on('end_video_call', function(data, callBack) {
    console.log('end_video_calling---------------');
    console.log(data);
    var authData = data;
    var uniqueId = 'user_'+ authData.to_user;
    console.log(uniqueId);
    var msg = "call end";
    if(ls.get(uniqueId) != null){
        var msg = "";
        io.sockets.to(ls.get(uniqueId).socket_ids).emit('end_video_call',{'to_user':authData.to_user,'from_user':authData.from_user,'msg':msg});
    }else{
        console.log('end_video_call user offline---------------');
    }
  });

  socket.on('disconnect', function() {
    console.log('============= disconnect called====');
    if (ls.get(socket.id) != null) {
      if (ls.get(socket.id).user_id != undefined) {
        var user_id = ls.get(socket.id).user_id;
        var uniqueId = 'user_'+ user_id;
        // remove particular soceket of user
        console.log('all scoket scoket',ls.get(uniqueId));
        if(ls.get(uniqueId).socket_ids != null){
          console.log('=========== remove old socket id===============');        
          ls.remove(uniqueId);
          ls.remove(socket.id);
        }
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
    //===========================Start the typing ==================
    socket.on('userInfo', function(data, callBack) {
      var callData = JSON.parse(data);
      var uniqueId = 'user_'+ callData.id;
      console.log("userInfo",callData);
      if (ls.get(uniqueId) != null) {
        callBack({
          "is_online": "yes",
          "id": callData.id,
        });
      }else{
        callBack({
          "is_online": "no",
          "id": callData.id,
        });
      }
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

      let selectSql = "SELECT * FROM users_master WHERE id="+callData.receiver_id+ "";
        dbConnection.query(selectSql, { 
        type: dbConnection.QueryTypes.SELECT,
      }).then(function(user_result) {

        let insertSql = "Insert into chat_history set receiver_id =:to_id,sender_id =:from_id,message =:message,type =:type";
        dbConnection.query(insertSql, { 
          type: dbConnection.QueryTypes.INSERT,     
          replacements: {to_id:callData.receiver_id,from_id:callData.sender_id,message:callData.message,type:'text'}           
        }).then(function(result12) {
          var message_data = JSON.stringify({
            sender_id: callData.sender_id,
            receiver_id: String(callData.receiver_id),
            message: callData.message,
            id: result12[0],
            request_id: callData.request_id,
            sender_type: callData.sender_type,
          });  
          if(ls.get(uniqueId) != null){  
            io.sockets.in(ls.get(uniqueId).socket_ids).emit('sendChatMessage', message_data);
          }
          callBack({
            "success": 1,
            "msg": "message sent",
          });
        }).catch(function(err) {
          console.log(err);
          callBack({
            "success": 0,
            "err":err,
            "msg": "Something went wrong 111",
          });
        });
      }).catch(function(err) {

        callBack({
          "success": 0,
          "err": err,
          "msg": "Something went wrong ...111111",
        });
      });
    //send the data to all the clients who are accessing the same site(localhost)
    });
    //End message
    
    
    //===========================Open agreement pop if therapist want ==================
    socket.on('patient_agreement', function(data, callBack) {
		console.log('patient_agreement=================================');
      	var callData = JSON.parse(data);
      	let selectSql = "SELECT id,customer_id,therapist_id FROM requests WHERE id="+callData.request_id+ "";
		dbConnection.query(selectSql, { 
			type: dbConnection.QueryTypes.SELECT,
		}).then(function(user_result) {
			var uniqueId = 'user_'+ user_result[0].customer_id;
			console.log('uniqueId==========='+uniqueId);
			 var message_data = JSON.stringify({
                request_id: callData.request_id,
                
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
		console.log('patient_agreement=================================');
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
                //msg: callData.user_name+' was '+callData.action+ ' the agreement! ',
                msg:msg,
                action: callData.action,
                
            };  
			if(ls.get(uniqueId) != null){  
				console.log('emit to users for patient_agreement_open =========================');
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

}); //end socket



