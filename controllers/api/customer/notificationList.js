const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
notificationList = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    //let SelectSql = "SELECT * FROM notifications WHERE user_id = '"+user_id+"' AND type='customer_job_detail' ORDER BY id DESC";

    let SelectSql = "SELECT * FROM notifications WHERE user_id = '"+user_id+"' AND type IN('customer_job_detail','detail') ORDER BY id DESC";

    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(resultNotification) {
    	if(resultNotification.length > 0){
			// update unread message
			let updateSql = "UPDATE notifications SET status='read'  WHERE user_id = '"+user_id+"' AND status='unread'";
			dbConnection.query(updateSql, { 
				type: dbConnection.QueryTypes.UPDATE,
			});

            response.msg = constants.NOTIFICATION_LIST;
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
module.exports = notificationList;
