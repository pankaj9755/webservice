const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
homeScreenTherapist = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
     let SelectSql = "SELECT id,first_name,last_name,avg_rating,total_rating,profile_image FROM users_master where user_type = 'therapist' and therapy_profile_status='verify' AND deleted_at is null";
    
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
module.exports = homeScreenTherapist;
