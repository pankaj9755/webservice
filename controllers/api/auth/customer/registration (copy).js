const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
registration = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	first_name:req.body.first_name,
    	last_name:req.body.last_name,
    	mobile_number:req.body.mobile_number,
    	email:req.body.email,
    	password:req.body.password,
    };
	console.log(data);
    const rules = {
       	first_name: 'required',
        last_name: 'required',
        mobile_number: 'required',
        email: 'required',
        password: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        res.send(response);
    }else{
    	
    	let password = md5(req.body.password);
    	let EncrytedEmail = UtilityHelper.encrypted(req.body.email);
    	let Encryted_mobile_number = UtilityHelper.encrypted(req.body.mobile_number);
    	let checkExistphone = "Select * From users_master where mobile_number = :mobile_number And deleted_at is null";
    	let checkExistEmail = "Select * From users_master where email = :email And deleted_at is null";

    	new Promise(function(resolve, reject) {
    		dbConnection.query(checkExistphone, { 
				type: dbConnection.QueryTypes.SELECT,
				replacements: {mobile_number: Encryted_mobile_number}
	    	}).then(function(result0) {
	    		if(result0.length == 0){
	    			resolve(1);
	    		}else{
	    			response.msg = constants.PHONE_EXIST;
                	res.statusCode = 400;
                	res.send(response);
	    		}
	    	})
    		
    	}).then(function(result) { 
        	new Promise(function(resolve, reject) {
	    		dbConnection.query(checkExistEmail, { 
					type: dbConnection.QueryTypes.SELECT,
					replacements: {email: EncrytedEmail}
		    	}).then(function(result01) {
		    		if(result01.length == 0){
		    			resolve(1);
		    		}else{
		    			response.msg = constants.EMAIL_EXIST;
	                	res.statusCode = 400;
	                	res.send(response);
		    		}
		    	})
	    	})

    	}).then(function(result) { 
    		let code = Math.floor(1000 + Math.random() * 9000);
    		
    		let checkAlreadyExistEntry = "Select * From users_temp where email = :email or mobile_number = :mobile_number";

    		dbConnection.query(checkAlreadyExistEntry, { 
				type: dbConnection.QueryTypes.SELECT,
				replacements: {email: EncrytedEmail,mobile_number: Encryted_mobile_number,}
	    	}).then(function(isExist) {
	    		if(isExist.length > 0){
	    			let updateSql = "Update users_temp set code = :code ,password = :password, email = :email, mobile_number = :mobile_number where id = '"+isExist[0].id+"'"
	    			dbConnection.query(updateSql, {type: dbConnection.QueryTypes.UPDATE,
	    				replacements: {
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							email: EncrytedEmail,
							mobile_number: Encryted_mobile_number,
							password: password,
							code:code
						}
	    			}).then(function(result1) {
	    				response.msg = constants.REGISTRATION_SUCCESS;
			            res.statusCode = 200;
			            res.send(response);
	    				
	    			}).catch(function(err) {
		                res.statusCode = 500;
		                res.msg = err;
		                console.log(err);
		                res.send(response);
		            });
	    		}else{

	    			let inserSql = "Insert Into users_temp Set first_name = :first_name , last_name = :last_name,"
		    		inserSql += " email = :email, mobile_number = :mobile_number ,password = :password,code = :code, count = 1 ";
		    		
		    		dbConnection.query(inserSql, { 
						type: dbConnection.QueryTypes.INSERT,
						replacements: {
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							email: EncrytedEmail,
							mobile_number: Encryted_mobile_number,
							password: password,
							code:code
						}

			    	}).then(function(result1) {
			    		if(result1){
			    			response.msg = constants.REGISTRATION_SUCCESS;
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


	    	}).catch(function(err) {
                res.statusCode = 500;
                res.msg = err;
                console.log(err);
                res.send(response);
            });



    		
    	})
    }
}
module.exports = registration;