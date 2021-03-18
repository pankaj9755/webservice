const dbConnection = require("./../../config/connection");
const shortid = require('shortid');

var NotificationHelper = require("../../libraries/NotificationHelper")();
const UtilityHelper = require('../../libraries/UtilityHelper')();
var dateFormat = require('dateformat');


test = (req, res) => {
	console.log('000---------------------');
	//console.log(req.body);
	const response = {
        'msg': '',
        'result':[],
    };
    //email = UtilityHelper.encrypted('ndlovududu@yahoo.com');
   // console.log('ndlovududu@yahoo.com',email);

    //~ var notificationData = {};
		//~ notificationData.id = "";
		//~ notificationData.title = "web notification";
		//~ notificationData.message = "web notification";
		//~ notificationData.type = "admin";

    //~ NotificationHelper.mutipleNotification(["fql4PKMG36o:APA91bHoyaAasQtTGJ4a0BHNsONzwqSqOV4Kf_sFRUQokLcNIr7xUXa9i9ehUuFLTEHXr4Ew5xzr2R8ZbmZdVUO-mb0R2hUAT1AaG5yXUsm6w6xUbRf10io7OlZ_RDGZTmsVXedUIPBk"], notificationData, function (notificationResponse) {
		//~ console.log("Web Notification Response: ", notificationResponse);
		//~ res.send('----ll');
	//~ });
	response.statusCode = 200;
	//response.result = email;
	response.msg = 'email';
	return res.send(response);

	
}
module.exports = test;
