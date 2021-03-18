const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');

resetPassword = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	token:req.body.token,
    	password:req.body.password,
    	user_id:req.body.user_id,
    };
    const rules = {
        token: 'required',
        password: 'required',
        user_id: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    let password = md5(req.body.password);
    let selectSql = "Select id from users_master where id = :user_id and remember_token = :token";
    dbConnection.query(selectSql, { 
		type: dbConnection.QueryTypes.SELECT,
		replacements: {user_id: data.user_id,token:data.token}
	}).then(function(result0) {
		if(result0.length > 0){

			let updateSql = "Update users_master set password = :password,remember_token = '' where id = :user_id"
			dbConnection.query(updateSql, { 
				type: dbConnection.QueryTypes.UPDATE,
				replacements: {user_id: data.user_id,password:password,token:data.token}
			}).then(function(result1) {

				res.statusCode = 200;
            	response.msg = constants.RESET_PASSWORD_SUCCESS;
            	res.send(response);
			});
		}else{
			res.statusCode = 400;
            response.msg = constants.RECORD_NOT_FOUND;
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
module.exports = resetPassword;