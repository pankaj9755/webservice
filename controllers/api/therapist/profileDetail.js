const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
profileDetail = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    let SelectSql = "Select * From users_master where id = '"+user_id+"' and deleted_at is null";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {
    	if(result1.length > 0){
            result1[0].email = UtilityHelper.decrypted(result1[0].email);
            result1[0].mobile_number = UtilityHelper.decrypted(result1[0].mobile_number);

    		response.msg = constants.DETAIL_SUCCESS;
    		response.result = result1[0];
            res.statusCode = 200;
            res.send(response);
    	}else{
    		res.statusCode = 400;
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
module.exports = profileDetail;