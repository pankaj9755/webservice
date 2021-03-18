const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const jwtHelper = require('./../../../libraries/jwtHelper');

unreadNotificatioCount = function(req, res) {
	
    const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;

    let SelectSql = "SELECT COUNT(*) AS unread_count FROM notifications where status='unread' AND user_id = '"+user_id+"'";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(UnResult) {

    	if(UnResult.length > 0){
            response.msg = "";
		    response.count = UnResult[0].unread_count;
	        response.statusCode = 200;
	        res.statusCode = 200;
	        res.send(response);
        }else{
			response.msg = "";
		    response.count = 0;
	        response.statusCode = 200;
	        res.statusCode = 200;
	        res.send(response);
		}

        }).catch(function(err) {
			response.msg = "";
		    response.count = 0;
	        response.statusCode = 200;
	        res.statusCode = 200;
	        res.send(response);
    });


   
}
module.exports = unreadNotificatioCount;
