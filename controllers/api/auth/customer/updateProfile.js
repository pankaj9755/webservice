const constants = require("./../../../../config/constants");
const dbConnection = require("./../../../../config/connection");
const Validator = require('validatorjs');
var md5 = require('md5');
const UtilityHelper = require('./../../../../libraries/UtilityHelper')();
const jwtHelper = require('./../../../../libraries/jwtHelper');
_ = require('lodash');

updateProfile = (req,res) => {

    var users_id = res.locals.userData.id;
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        age:req.body.age,
        address:req.body.address,
        city:req.body.city,
    };
    const rules = {
        first_name:'required',
        //last_name:'required',
    };
    const validation = new Validator(data,rules);

    if(validation.fails()){
        response.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    
	let SelectSql = "Select * From users_master where id = "+users_id+"";

	dbConnection.query(SelectSql, { 
		type: dbConnection.QueryTypes.SELECT,
	}).then(function(result) {
        var profile_image = req.body.profile_image?req.body.profile_image:"";
		if(result.length>0){

           if(result[0].referral_code!="" && result[0].referral_code!=null){
			   console.log('-- referral_code is not null');
					reffralCode = result[0].referral_code;
			}else{
				console.log('-- referral_code  null');
				reffralCode = data.first_name;
				if(data.last_name !=null){
					reffralCode += data.last_name;
				}
				var lenghtOfCode = reffralCode.length;
				if(lenghtOfCode<6){
					reffralCode = reffralCode+UtilityHelper.randomIntNumber(5-lenghtOfCode); 
				}else{
					reffralCode = reffralCode.slice(0,5);
				}
				reffralCode = reffralCode.replace(/ /g,'');
			}
			
			userReferralExists(reffralCode,users_id, function(NewreffralCode){
						
					if(req.body.kin_number != "" && req.body.kin_number != undefined && req.body.kin_number != 0){
				        var Encryted_kin_number = UtilityHelper.encrypted(req.body.kin_number);
				    }else{
				        var Encryted_kin_number = "";
				    }
            
					let UpdateSql = "UPDATE users_master SET first_name = :first_name, age= :age, address= :address, city= :city, referral_code =:referral_code ";
					if(req.body.profile_image != ''){
						UpdateSql += " , profile_image = :profile_image"
					}

					if(req.body.kin_name != ''){
						UpdateSql += " , kin_name = :kin_name"
					}
					if(req.body.kin_number != ''){
						UpdateSql += " , kin_number = :kin_number"
					}

					UpdateSql += " WHERE id = :users_id";

					dbConnection.query(UpdateSql, {
						type: dbConnection.QueryTypes.UPDATE,
						replacements: {first_name: data.first_name,
							//last_name: data.last_name,
							age: data.age,
							address: data.address,
							city:data.city,
							users_id:users_id,
							profile_image:profile_image,
							referral_code:NewreffralCode,
							kin_name:req.body.kin_name,
							kin_number:Encryted_kin_number,
						}
					}).then(function(update_result) {
						response.statusCode = 200;
						response.msg = constants.UPDATE_INFO_SUCCESSFULLY;
						response.referral_code = NewreffralCode;
						return res.send(response);
					}).catch(function(err) {
						console.log('-- check forgot password Query failed err.message:'+err.message);
						response.statusCode = 400;
						response.msg = constants.SOMETHING_WENT_WRONG;
						return res.send(response);
					});	
				});
			}else{
				response.statusCode = 400;
				response.msg = constants.RECORD_NOT_FOUND;            
				return res.send(response);
			}
		}).catch(function(err) {
			console.log(err);
			response.statusCode = 500;
			response.msg = err;
			res.send(response);
		});
	
}

module.exports = updateProfile;

var userReferralExists = function( referralCode, UserId, callBack){
    let query = "SELECT * FROM users_master WHERE referral_code = '"+referralCode+"' AND id !='"+UserId+"'";
	var k = referralCode;
	dbConnection.query(query, { 
		type: dbConnection.QueryTypes.SELECT,
	}).then(function(result) {
		
        if(result.length==0) {
		   callBack(k)                   // use the continuation
        } else {
			var k1 = k+UtilityHelper.randomIntNumber(2); 
			userReferralExists(k1,UserId, callBack)  // otherwise, recurse on generate
		}
    });
}
