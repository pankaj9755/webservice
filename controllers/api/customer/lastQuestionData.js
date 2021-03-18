const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();

lastQuestionData = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    if(!res.locals.userData.id){
			res.statusCode = 200;
            response.msg = constants.RECORD_NOT_FOUND;
            response.result = [];
            return res.send(response);
	}
    var user_id = res.locals.userData.id;
   
    let SelectSql = "SELECT id,question_answer,score,category FROM requests WHERE customer_id = :user_id ORDER BY id DESC LIMIT 1";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {user_id:user_id}
    }).then(function(result1) {
    	if(result1.length > 0){
    		response.msg = constants.LIST_SUCCESS;
    		response.result = result1[0].question_answer;
    		response.last_score = result1[0].score;
    		response.category = result1[0].category;
    		response.statusCode = 200;
            res.statusCode = 200;
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
        res.send(response);
    });
}
module.exports = lastQuestionData;
