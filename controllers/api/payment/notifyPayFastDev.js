const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
var EmailHelper =  require('./../../../libraries/EmailHelper')();
var NotificationHelper =  require('./../../../libraries/NotificationHelper')();
var SocketHelper =  require('./../../../libraries/SocketHelper')();
var UtilityHelper = require('./../../../libraries/UtilityHelper')();

notifyPayFastDev = (req,res) => {
	res.sendStatus(200);
	var response = {} ;
	var listedarray = [];
	var pfData = [];

	var notificationData = {};
	var webIds = [];
	
	// Payfast only notify your webhooks from these IPs: Any notify from outside of these can safely be considered counterfeit
	// 52.31.139.75, 52.49.173.169, 52.214.14.220
	var listedarray = [];
	var replacementData  = {};
	listedarray[0] = "41.74.179.193";
	listedarray[1] = "41.74.179.222";
	listedarray[2] = "197.97.145.145";
	listedarray[3] = "197.97.145.158";
	listedarray[4] = "197.97.145.144";
	listedarray[5] = "41.74.179.192";		
	
	var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
		ip = ip.split(',')[0];
		ip = ip.split(':').slice(-1); 
	var payment = {
		payment_id: req.body.pf_payment_id,
		order_number:req.body.m_payment_id,
		status: req.body.payment_status,
		orderName: req.body.item_name,
		gross: req.body.amount_gross,
		fee: req.body.amount_fee,
		net: req.body.amount_net,
		name: req.body.name_first,
		last_name: req.body.name_last,
		signature: req.body.signature
    };

  	if(listedarray.includes(ip.toString()) === true){
  		      
    }
 
  	
	var body =  JSON.stringify(payment);
	body +=  ip;
	body += JSON.stringify(req.body);
	
	var mailOption = {
					subject: 'console log of notify Payment request plan',
					body: body,
					email:"ajay@idealittechno.com",
	};
	EmailHelper.sendEmail(mailOption, function(mailResutl) {    
		console.log("EMAIL SEND");
	}); 


    
}
 module.exports = notifyPayFastDev;





