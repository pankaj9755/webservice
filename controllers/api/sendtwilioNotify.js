const dbConnection = require("./../../config/connection");
const shortid = require('shortid');

var dateFormat = require('dateformat');

const accountSid = 'AC995f62ce9753f629bbe191408a5f170b';
const authToken = '03788fed588ddcbeed363a84bfc33aec';
const Twilio = require('twilio');

const client = new Twilio(accountSid, authToken);

const service = client.notify.services('ISf39352b900e7e12a2f70d4273435e510');



sendtwilioNotify = (req, res) => {
	const response = {
        'msg': '',
        
    };
    
    client.notify.services('ISf39352b900e7e12a2f70d4273435e510')
             .notifications
             .create({body: 'Hello Bob', identity: ['qwe12345678']})
             .then(notification => {
		console.log(notification);
		response.msg = "succcess.";
		res.statusCode = 200;
		res.send(response);
	  })
	  .catch(error => {
		console.log(error);
		response.msg = "error.";
		res.statusCode = 200;
		res.send(response);
	  })
	.done();
    
	
    	
}
module.exports = sendtwilioNotify;
