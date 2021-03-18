const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
reffralCodeDiscount = (req,res) => {

    var promises = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    
    var user_id = res.locals.userData.id;
	var is_used_reffral = 'yes';
    let reffralSql = "SELECT id,used_referral_code,first_name FROM users_master WHERE id='"+res.locals.userData.id+"' && benefit_i_referral_used = 'no' && used_referral_code is not null"; //used promo code //no means not using this code
    
    let countUsedReffralSql = "SELECT id,first_name,referral_code FROM users_master WHERE used_referral_code = '"+res.locals.userData.referral_code+"' && benefit_referral_used = 'no' AND deleted_at is null ORDER BY id ASC"; //my reffral code used someone count

	 let adminSql = "SELECT * FROM setting";

    promises.push(dbConnection.query(adminSql, {
        type: dbConnection.QueryTypes.SELECT
    }).then(function(adminResult) {
        adminInfo = adminResult;
    }));
    
    promises.push(dbConnection.query(reffralSql, {
        type: dbConnection.QueryTypes.SELECT
    }).then(function(reffralResult) {
        reffralInfo = reffralResult;
    }));

    promises.push(dbConnection.query(countUsedReffralSql, {
        type: dbConnection.QueryTypes.SELECT
    }).then(function(countUsedReffralResult) {
        usedReffralInfo = countUsedReffralResult;
    }));

    Promise.all(promises).then(function(result) {

        if(reffralInfo.length>0){
			var userQuery = "SELECT id,used_referral_code,first_name FROM users_master WHERE referral_code='"+reffralInfo[0].used_referral_code+"'";
			dbConnection.query(userQuery, {
			type: dbConnection.QueryTypes.SELECT
			}).then(function(userResult) {
				if(userResult.length>0){
					is_used_reffral = 'no';
					result = { 'is_used':is_used_reffral,'code':reffralInfo[0].used_referral_code,'discount':adminInfo[0].referral_discount,"is_my_code":"yes"};
					response.statusCode = 200;
					//You have referral bonus of 5% discount because you have used Krishna's referral code on signup. Do you want to use the discount? 
					response.msg = "You have referral bonus of "+adminInfo[0].referral_discount+"% discount because you have used "+userResult[0].first_name+"'s referral code on signup. Do you want to use the discount? ";
					response.result = result;
					return res.send(response);
				}else{
					response.statusCode = 200;
					response.msg = "";
					response.result = { 'is_used':is_used_reffral};
					return res.send(response);
				}
			});
        
        }else{
             if(usedReffralInfo.length>0){
				 is_used_reffral = 'no';
				result = { 'is_used':is_used_reffral,'code':usedReffralInfo[0].referral_code,'discount':adminInfo[0].referral_discount,"is_my_code":"no"};
				response.statusCode = 200;
				//You have referral bonus of 5% discount because you have used Krishna's referral code on signup. Do you want to use the discount? 
				response.msg = "You have referral bonus of "+adminInfo[0].referral_discount+"% discount because "+usedReffralInfo[0].first_name+" used your referral code for signup. Do you want to use the discount? ";
				response.result = result;
				return res.send(response);
			 }else{
				response.statusCode = 200;
				response.msg = "";
				response.result = { 'is_used':is_used_reffral};
				return res.send(response);
			}
             
        }                

        

    }).catch(function(err) {
        console.log('err',err);
       response.statusCode = 200;
		response.msg = "";
		response.result = { 'is_used':is_used_reffral};
		return res.send(response);
    });               
    	
}
module.exports = reffralCodeDiscount;
