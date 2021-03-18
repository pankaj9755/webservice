const dbConnection = require("./../../config/connection");
const Validator = require('validatorjs');
const constants = require("./../../config/constants");
const jwt = require('jsonwebtoken');
const fs = require('fs');
	

checkPlan = (req, res) => {
	
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	request_id:req.body.id
    }
	var user_id = res.locals.userData.id;
	//let selectSql = "SELECT seconds,used_seconds,id FROM user_video_plan where user_id = :user_id AND status = 'active' AND payment_status = 'done' ";
	let selectSql = "SELECT seconds,used_seconds,user_video_plan.id,requests.id AS request_id FROM user_video_plan JOIN requests ON requests.request_number=user_video_plan.invoice_id WHERE user_video_plan.status = 'active' AND requests.id= :request_id";
	//let selectSql = "SELECT seconds,used_seconds,id FROM user_video_plan WHERE status = 'active'";
	dbConnection.query(selectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {user_id: user_id,request_id:data.request_id}
    }).then(function(planInfo) {
    	if(planInfo.length > 0){ 
            
    		if(parseInt(planInfo[0].seconds)  <= parseInt(planInfo[0].used_seconds) ){
    			response.msg = constants.PLAN_EXPIRED;
            	response.statusCode = 200;
            	response.result = [];
            	res.statusCode = 200;
            	return res.send(response);
    		}else{
				//  genrated token behalf of  video plan 
				
				 
    			response.msg = 'Plan found';
    			response.result = planInfo[0];
	            res.statusCode = 200;
	            res.send(response);
			 
    		}
    		
    	}else{
    		response.msg = constants.PLAN_NOT_FOUND;
    		response.result = [];
            response.statusCode = 200;
            res.statusCode = 200;
            return res.send(response);
    	}
    })
}
module.exports = checkPlan;
