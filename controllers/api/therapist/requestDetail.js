const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
requestDetail = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
        'result1':[]
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
    var therapist_id = res.locals.userData.id;
    let SelectSql = "SELECT requests.*,users_master.first_name AS therapist_first_name,users_master.last_name AS therapist_last_name,users_master.mobile_number AS mobile_number,users_master.kin_name,users_master.kin_number,users_master.about_me,users_master.profile_image,users_master.user_type,discount_promo_code,IFNULL(ratings.rating,'0') AS rating,ratings.review,ratings.created_at AS review_at,thU.unic_id AS th_unic_id,requests.created_by FROM requests ";
    
    SelectSql += " LEFT JOIN users_master ON requests.customer_id = users_master.id";
    SelectSql += " LEFT JOIN users_master AS thU ON requests.therapist_id = thU.id";
    SelectSql += " LEFT JOIN ratings ON requests.id = ratings.job_id";
    SelectSql += " WHERE requests.id = :request_id AND requests.therapist_id =:therapist_id AND requests.deleted_at is null"

    dbConnection.query(SelectSql, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {request_id:data.request_id,therapist_id:therapist_id}
    }).then(function(result1) {
    	if(result1.length > 0){
        	res.statusCode = 200;
        	if(result1[0].mobile_number!=""){
				result1[0].mobile_number = UtilityHelper.decrypted(result1[0].mobile_number);
			}
			if(result1[0].kin_number!="" && result1[0].kin_number!=null && result1[0].kin_number!=0){
				result1[0].kin_number = UtilityHelper.decrypted(result1[0].kin_number);
			}else{
				result1[0].kin_number = '';
			}
			if(result1[0].survey_question ==""){
				result1[0].survey_question = null;
			}
    		response.msg = "Request Detail";
    		response.result = result1;
        	res.send(response);
    	}else{
    		res.statusCode = 200;
            response.msg = constants.RECORD_NOT_FOUND;
            response.result = [];
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
