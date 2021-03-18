const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();

questionList = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	therapy_type:req.body.therapy_type
    }
    const rules = {
        //therapy_type: 'required',
    }
    const validation = new Validator(data,rules);
    if(data.therapy_type=="" || data.therapy_type==null){
		data.therapy_type = "employee";
	}
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    //var user_id = res.locals.userData.id;
    let SelectSql = "Select * From questions where therapy_type = :therapy_type and status = 'active' and deleted_at is null";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {therapy_type:data.therapy_type}
    }).then(function(result1) {
    	if(result1.length > 0){
    		response.msg = constants.LIST_SUCCESS;
    		response.result = result1;
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
module.exports = questionList;
