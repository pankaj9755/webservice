const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');

CustomerOwnReuestDetail = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
        'result':{},
    };
    const data = {
    	request_number:req.query.id,
    };
    const rules = {
        request_number: 'required'
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
     
    var customer_id = res.locals.userData.id;
    let SelectSql = "SELECT users_master.about_me, users_master.first_name,users_master.last_name,users_master.profile_image,requests.id,requests.therapy_type,requests.status,requests.apointment_date_time,requests.price,payment_status  FROM requests ";
    SelectSql += " LEFT JOIN users_master ON users_master.id = requests.therapist_id where requests.customer_id = :customer_id AND requests.request_number = :request_number AND requests.deleted_at is null";
    
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {customer_id:customer_id,request_number:data.request_number}
    }).then(function(orderresult) {
        if(orderresult.length > 0){
            response.statusCode = 200;
			response.result = orderresult[0];
			response.msg = 'order create successful';
			return res.send(response);
        }else{
			res.statusCode = 400;
			response.statusCode = 400;
			response.msg = constants.RECORD_NOT_FOUND;
			return res.send(response);
		}
    }).catch(function(err) {
	   console.log('err',err);
	    res.statusCode = 500;
		response.msg = err;
		res.send(response);
   });
    
}
module.exports = CustomerOwnReuestDetail;
