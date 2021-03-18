const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();

disclaimer = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	agree:req.body.agree,
    };
    const rules = {
        agree: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        res.send(response);
        return res.send(response);
    }

	var user_id = res.locals.userData.id;
    var user_type = res.locals.userData.user_type;
	let updateSql = "Update users_master set is_agree = '"+req.body.agree+"'";
	updateSql += " Where id = '"+user_id+"'";

	dbConnection.query(updateSql, { 
    	type: dbConnection.QueryTypes.UPDATE,
    }).then(function(result1) {
    	if(result1){
    		response.msg = '';
            response.user_type =user_type;
            res.statusCode = 200;
            res.send(response);
    	}
    }).catch(function(err) {
	    res.statusCode = 500;
	    res.msg = err;
	    console.log(err);
	    res.send(response);
	});
	
}
module.exports = disclaimer;