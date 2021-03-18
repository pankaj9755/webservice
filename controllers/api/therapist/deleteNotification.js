const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
deleteNotification = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        notification_id : req.body.notification_id,
    }
    const rules = {
        notification_id: 'required',
    };

    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }

    var user_id = res.locals.userData.id;
    
    let SelectSql = "SELECT * From notifications where user_id = '"+user_id+"' And id='"+data.notification_id+"'";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(resultNotification) {
    	if(resultNotification.length > 0){

            let DeleteSql = "DELETE From notifications where user_id = '"+user_id+"' And id='"+data.notification_id+"'";
            dbConnection.query(DeleteSql, { 
                type: dbConnection.QueryTypes.DELETE,
            }).then(function(deleteNotification) {

                response.msg = constants.NOTIFICATION_DELETE_SUCCESS;
                response.statusCode = 200;
                res.statusCode = 200;
                res.send(response);
            });
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
module.exports = deleteNotification;
