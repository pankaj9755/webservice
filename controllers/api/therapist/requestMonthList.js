const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var moment = require('moment');
requestMonthList = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
        'result':[]
    };
    const data = {
    	month:req.query.month,
    	timezone: req.query.timezone? req.query.timezone:""
    }
    const rules = {
        month: 'required',
    }
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var monthRequest = [];
    var therapist_id = res.locals.userData.id;
    let SelectSql = "SELECT users_master.about_me, users_master.first_name,users_master.last_name,users_master.profile_image,users_master.user_type,requests.id,requests.request_number,requests.therapy_type,requests.status,requests.apointment_date_time,requests.price,discount_promo_code FROM requests ";
    
    //SelectSql += " LEFT JOIN users_master on users_master.id = requests.customer_id WHERE requests.therapist_id = :therapist_id AND MONTH(apointment_date_time)=:month AND requests.status !='draft' AND requests.deleted_at is null";
    SelectSql += " LEFT JOIN users_master on users_master.id = requests.customer_id WHERE requests.therapist_id = :therapist_id AND requests.status !='draft' AND requests.request_therapist_delete='no' AND requests.deleted_at is null";
    
     dbConnection.query(SelectSql, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {therapist_id:therapist_id,month:data.month}
        }).then(function(result) {
            
			for(var j=0; j < result.length; j++){
				(function(j){
					bgcolor = '#bac866';
					textColor = '#fff';
					if(result[j].status=="cancel"){
						bgcolor = '#FF0000';
					}
					if(result[j].status=="pending" || result[j].status=="draft" ){
						bgcolor = '#ffbf25';
					}
					if(result[j].status=="wip"){
						bgcolor = '#2c3db7';
					}
                    if(result[j].first_name != ""){

                        var firstName = result[j].first_name.charAt(0).toUpperCase() + result[j].first_name.slice(1);
                        var lastName = result[j].last_name.charAt(0).toUpperCase() + result[j].last_name.slice(1);
                        var userName = firstName +' '+ lastName;
                    }else{
                        var userName = "";
                    }                    
					title = userName+' '+moment(result[j].apointment_date_time).format("hh:mm A") ;
					if(data.timezone!=''){
						title = userName+' '+moment(result[j].apointment_date_time).tz(data.timezone).format("hh:mm A");
					}
					var dateTimeJson =  {'available':'',
						'title':title,
						'start': moment(result[j].apointment_date_time).format("YYYY-MM-DD hh:mm"),
						'end':moment(result[j].apointment_date_time).format("YYYY-MM-DD hh:mm:59"),
						'className':['my-book-bg-','cursor-pointer'],
						'backgroundColor':bgcolor,
						'borderColor':bgcolor,
						'textColor':textColor,
                        'name':userName,
                        'request_number':result[j].request_number,
                        'about_me':result[j].about_me,
                        'therapy_type':result[j].therapy_type,
                        'price':result[j].price,
                        'discount_promo_code':result[j].discount_promo_code,
                        'request_id':result[j].id,
                        'apointment_date':result[j].apointment_date_time,
                        'profile_image':result[j].profile_image,
                        'status':result[j].status,
						};

					var finalJson = JSON.stringify(dateTimeJson);
					finalJson = JSON.parse(finalJson);
					monthRequest.push(finalJson); //First json push
				})(j); 
			}
						
			res.statusCode = 200;
    		response.msg = 'list';
    		response.result = monthRequest;
        	res.send(response);
           
        }).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            return res.send(response);
    });           
    
}
module.exports = requestMonthList;
