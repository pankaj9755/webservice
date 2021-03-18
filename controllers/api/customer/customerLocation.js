const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
customerLocation = (req,res) => {

    var result1 = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	request_id:req.query.request_id
    }
    const rules = {
        request_id: 'required',
    }
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    let SelectSql = "SELECT requests.id,users_master.lattitude,users_master.longitude FROM requests ";
    
    SelectSql += " LEFT JOIN users_master ON requests.customer_id = users_master.id";
    //SelectSql += " WHERE requests.id = :request_id AND requests.therapist_id =:user_id  AND requests.deleted_at is null";
    SelectSql += " WHERE requests.id = :request_id  AND requests.deleted_at is null"

    dbConnection.query(SelectSql, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {request_id:data.request_id,user_id:user_id}
    }).then(function(result1) {
    	if(result1.length > 0){
        	res.statusCode = 200;
        	response.statusCode = 200;
        	response.msg = constants.LIST_SUCCESS;
    		response.result = result1[0];
        	res.send(response);
    	}else{
    		res.statusCode = 500;
    		response.statusCode = 500;
            response.msg = constants.RECORD_NOT_FOUND;
            res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        response.statusCode = 500;
        res.msg = err;
        console.log(err);
        return res.send(response);
    });

}
module.exports = customerLocation;
