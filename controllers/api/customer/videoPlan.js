const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");

videoPlan = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    
    let SelectSql = "SELECT * From video_plan";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(resultNotification) {
    	if(resultNotification.length > 0){

            response.msg = constants.VIDEO_PLAN;
            response.statusCode = 200;
            response.result = resultNotification;
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
module.exports = videoPlan;
