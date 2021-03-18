const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
therapistList = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    let SelectSql = "SELECT id,first_name,last_name,unic_id,profile_image,gender,qualification,years_experience,therapy_type,about_me ,hpcsa_no FROM users_master where user_type = 'therapist' and therapy_profile_status='verify' AND deleted_at is null";
    
    if(user_id!=0){
		SelectSql +=" AND id !="+user_id+"";
	}
	SelectSql +=" ORDER BY avg_rating DESC,total_rating DESC";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {
    	if(result1.length > 0){

            response.msg = constants.THERAPIST_SUCCESS;
            response.statusCode = 200;
            response.result = result1;
            res.statusCode = 200;
            res.send(response);
    	}else{
    		res.statusCode = 400;
            response.statusCode = 400;
            response.msg = constants.RECORD_NOT_FOUND;
            res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
}
module.exports = therapistList;
