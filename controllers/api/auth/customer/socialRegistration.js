const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
socialRegistration = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	social_type:req.body.social_type,
    	social_key:req.body.social_key,
    };
    const rules = {social_type: 'required',social_key: 'required'};
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        res.send(response);
    }else{
    	let checkExistUser = "Select * From users_master where social_key = :social_key and social_type = :social_type";
    	dbConnection.query(checkExistUser, { 
			type: dbConnection.QueryTypes.SELECT,
			replacements: {social_key: req.body.social_key,social_type:req.body.social_type}
    	}).then(function(result0) {
    		if(result0.length > 0){
    			result0[0].email = UtilityHelper.decrypted(result0[0].email);
                result0[0].mobile_number = UtilityHelper.decrypted(result0[0].mobile_number);
    			jwtHelper.JWTSighing({
                    'first_name':result0[0].first_name,
                    'last_name':result0[0].last_name,
                    'email':result0[0].email,
                    'mobile_number':result0[0].mobile_number,
                }).then(function(result){
                    if(result.status){
                        result0[0].token = result.token;
                        response.msg = constants.MOBILE_VERIFY_SUCCESS;
                        response.result = result0;
                        res.statusCode = 200;
                        res.send(response);
                    }else{
                        console.log('--TOKEN ERROR-----------------');
                        response.msg = constants.SOMETHING_WENT_WRONG;
                        
                        res.statusCode = 400;
                        res.send(response);
                    }
                })
    		}else{

    			let inserSql = "Insert Into users_temp Set social_key = :social_key , social_type = :social_type , count = 1";
		    	
		    		
	    		dbConnection.query(inserSql, { 
					type: dbConnection.QueryTypes.INSERT,
					replacements: {
						social_key: req.body.social_key,
						social_type: req.body.social_type,
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
    }

}
module.exports = socialRegistration;