const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
getSchedule = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    let SelectSql = "SELECT id,therapist_id,day_number,schedule,CASE is_open WHEN 'yes' THEN true ELSE false END AS is_open From therapist_schedule where therapist_id = '"+user_id+"' ORDER BY day_number ASC ";
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
