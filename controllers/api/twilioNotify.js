const dbConnection = require("./../../config/connection");
const shortid = require('shortid');

var dateFormat = require('dateformat');

const accountSid = 'AC995f62ce9753f629bbe191408a5f170b';
const authToken = '03788fed588ddcbeed363a84bfc33aec';
const client = require('twilio')(accountSid, authToken);

twilioNotify = (req, res) => {
	const response = {
        'msg': '',
        
    };
    console.log('req.body',req.body);
    client.notify.services('ISf39352b900e7e12a2f70d4273435e510')
             .bindings
             .create({
                identity: req.body.identity,
                bindingType: req.body.BindingType,
                address: req.body.Address
              })
             .then(binding => console.log(binding));
	  result ={
		identity: req.body.identity,
        bindingType: req.body.BindingType,
        address: req.body.Address
	  };
	response.msg = "test List.";
	res.statusCode = 200;
	res.send(response);
    	
}
module.exports = twilioNotify;
