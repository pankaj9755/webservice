const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
var moment = require('moment');
const Validator = require('validatorjs');
applyPromo = (req,res) => {

	var promises = [];
	var amount = 0;
	var msg = "";
	var msg1 = "";

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	promo_code:req.body.promo_code.trim(),
    	total_amount:req.body.total_amount,
    };
    const rules = {
        promo_code: 'required',
        total_amount:'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.msg1 = '';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    
    let promoCodeSql = "Select * From promocode where code = '"+data.promo_code+"' ";
    let countUsedPromoSql = "Select count(id) as total_promo From requests where promo_code = '"+data.promo_code+"'";
    let countUserUsedPromoSql = "Select count(id) as total_promo From requests where promo_code = '"+data.promo_code+"' And customer_id = '"+user_id+"' ";
	
    promises.push(dbConnection.query(promoCodeSql, {
		type: dbConnection.QueryTypes.SELECT
	}).then(function(promoCodeResult) {
		promocodeInfo = promoCodeResult;
	}));

	promises.push(dbConnection.query(countUsedPromoSql, {
		type: dbConnection.QueryTypes.SELECT
	}).then(function(countUsedPromoResult) {
		usedPromoInfo = countUsedPromoResult;
	}));

	promises.push(dbConnection.query(countUserUsedPromoSql, {
		type: dbConnection.QueryTypes.SELECT
	}).then(function(countUserUsedPromoResult) {
		userUsedPromoInfo = countUserUsedPromoResult;
	}));

	Promise.all(promises).then(function(result) {
		if(promocodeInfo.length>0){
			if(promocodeInfo[0].status == 'inactive'){
				response.statusCode = 400;
	            response.msg = 'Promo code is inactive';
	            response.msg1 = '';
	            return res.send(response);
			}	

			var currentDate = moment().format("YYYY-MM-DD 00:00:00");
			var valdiFromDate = moment(promocodeInfo[0].valid_from).format("YYYY-MM-DD HH:mm:ss");
			if(valdiFromDate > currentDate){
				response.statusCode = 400;
            	response.msg = 'This promocode is not available yet.';
            	response.msg1 = '';
            	return res.send(response);
			}

			var valdiTillDate = moment(promocodeInfo[0].valid_till).format("YYYY-MM-DD HH:mm:ss");
			console.log('valdiTillDate',valdiTillDate);
			console.log('currentDate',currentDate);
			if(valdiTillDate < currentDate){
				response.statusCode = 400;
            	response.msg = 'This promocode has been expired.';
            	response.msg1 = '';
            	return res.send(response);
			}

			
				if(promocodeInfo[0].max_uses <= usedPromoInfo[0].total_promo){
					response.statusCode = 400;
					response.msg = 'The limit of this promocode has expired.';
					response.msg1 = '';
					return res.send(response);
				}

				if(promocodeInfo[0].max_uses_per_person <= userUsedPromoInfo[0].total_promo){
					response.statusCode = 400;
					response.msg = 'The limit of this promocode has expired.';
					response.msg1 = '';
					return res.send(response);
				}
			
				if(promocodeInfo[0].discount_type == "percent"){
					
					var amount = data.total_amount * promocodeInfo[0].discount_amount / 100;
					// var msg = "Congratulations! Your promocode '" + promocodeInfo[0].title + "' has been applied. You saved $" + Number(amount).toFixed(2) + ".";
					var msg = "Congratulations! Your promocode '" + promocodeInfo[0].code + "' has been applied.";
					var msg1 = "Click Pay Now to complete booking.";
					var result = {"amount":amount,msg:msg,msg1:msg1};
				}else{
					
					var amount = promocodeInfo[0].discount_amount;
					//var msg = "Congratulations! Your promocode '" + promocodeInfo[0].title + "' has been applied. You saved $" + Number(amount).toFixed(2) + ".";
					var msg = "Congratulations! Your promocode '" + promocodeInfo[0].code + "' has been applied."
					var msg1 = "Click Pay Now to complete booking.";
					var result = {"amount":amount,msg:msg,msg1:msg1};
				}
			
			response.statusCode = 200;
			response.result = result;
            response.msg = 'Promo code Info';
            response.msg1 = '';
            return res.send(response);
        }else{
        	response.statusCode = 400;
            response.msg = 'Promo code is invalid';
            response.msg1 = '';
            return res.send(response);
        }	
	}).catch(function(err) {
		console.log('err',err);
		response.statusCode = 500;
		response.msg = err;
		response.msg1 = '';
		return res.send(response);
	});
}
module.exports = applyPromo;
