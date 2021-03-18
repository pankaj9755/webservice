const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
getSchedule = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    let SelectSql = "Select * From therapist_schedule where therapist_id = '"+user_id+"' ";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {
    	if(result1.length > 0){

            response.msg = constants.SCHEDULE_SUCCESS;
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
module.exports = getSchedule;