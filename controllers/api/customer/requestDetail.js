const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
requestDetail = (req,res) => {

    var result1 = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	request_id:req.body.request_id
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
    let SelectSql = "SELECT requests.*,users_master.first_name AS therapist_first_name,users_master.last_name AS therapist_last_name,users_master.mobile_number AS therapist_mobile_number,users_master.about_me,users_master.user_type,users_master.profile_image,IFNULL(ratings.rating,'0') AS rating,ratings.review,ratings.created_at AS review_at FROM requests ";
    
    SelectSql += " LEFT JOIN users_master ON requests.therapist_id = users_master.id";
    SelectSql += " LEFT JOIN ratings ON requests.id = ratings.job_id";
    SelectSql += " WHERE requests.id = :request_id AND requests.customer_id =:user_id  AND requests.deleted_at is null"

    dbConnection.query(SelectSql, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {request_id:data.request_id,user_id:user_id}
    }).then(function(result1) {
    	if(result1.length > 0){
        	res.statusCode = 200;
        	if(result1[0].therapist_mobile_number!=""){
				result1[0].therapist_mobile_number = UtilityHelper.decrypted(result1[0].therapist_mobile_number);
			}
    		response.msg = constants.LIST_SUCCESS;
    		response.result = result1;
        	res.send(response);
    	}else{
    		res.statusCode = 200;
            response.result = []
            response.msg = constants.RECORD_NOT_FOUND;
            res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        return res.send(response);
    });

}
module.exports = requestDetail;
