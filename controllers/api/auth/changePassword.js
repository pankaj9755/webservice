const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');

changePassword = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	old_password:req.body.old_password,
    	new_password:req.body.new_password,
    };
    const rules = {
        new_password: 'required',
        old_password: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    let new_password = md5(req.body.new_password);
    let old_password = md5(req.body.old_password);
    let user_id = res.locals.userData.id;

    if(new_password == old_password){
    	res.statusCode = 200;
        response.msg = constants.OLD_PASSWORD_NEW_PASSWORD_SAME;
        response.success = 2;
        return res.send(response);
    }

    let SelectSql = "Select id from users_master where id= :user_id and password = :old_password";
    dbConnection.query(SelectSql, { 
		type: dbConnection.QueryTypes.SELECT,
		replacements: {user_id: user_id,old_password:old_password}
	}).then(function(result0) {
		if(result0.length > 0){
			let UpdateSql = "Update users_master set password = :new_password where id = :user_id";
			dbConnection.query(UpdateSql, { 
				type: dbConnection.QueryTypes.UPDATE,
				replacements: {user_id: user_id,old_password:old_password,new_password:new_password}
			}).then(function(result1) {
				res.statusCode = 200;
            	response.msg = constants.PASSWORD_CHANGE_SUCCESS;
            	response.success = 1;
            	res.send(response);
			})
		}else{
			res.statusCode = 200;
            response.msg = constants.CHANGE_PASSWORD_NOT_MATCH;
            response.success = 0;
            res.send(response);
		}

	}).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        response.message = err;
        response.statusCode = 500;
        return res.send(response);
    });
}
module.exports = changePassword;