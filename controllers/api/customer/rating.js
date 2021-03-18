const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
rating = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        request_id:req.body.request_id,
        rating:req.body.rating,
        review:req.body.review,
        therapist_id:req.body.therapist_id,
    }

    const rules = {
        therapist_id: 'required',
        review: 'required',
        rating: 'required',
        request_id: 'required'
    };

    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }

    var user_id = res.locals.userData.id;

    let SelectSql = "SELECT * From ratings where customer_id = '"+user_id+"' And job_id='"+data.request_id+"'";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result) {
    	if(result.length > 0){
            
            let updateSql = "Update ratings set rating =:rating, review=:review where job_id =:job_id And customer_id =:customer_id";

             dbConnection.query(updateSql, { 
                type: dbConnection.QueryTypes.UPDATE,
                replacements: {rating: data.rating,review:data.review,customer_id:user_id,job_id:data.request_id}                   
            }).then(function(result12) {

                if(result12){
                    response.msg = "Review successful";
                    response.statusCode = 200;
                    res.statusCode = 200;
                    res.send(response);
                }else{
                    res.statusCode = 400;
                    response.msg = constants.SOMETHING_WENT_WRONG;
                    return res.send(response);
                }
            })
    	}else{

            let insertSql = "Insert into ratings set job_id =:job_id, customer_id =:customer_id, therapist_id =:therapist_id,rating =:rating, review=:review";

             dbConnection.query(insertSql, { 
                type: dbConnection.QueryTypes.INSERT,     
                replacements: {rating: data.rating,review:data.review,therapist_id:data.therapist_id,customer_id:user_id,job_id:data.request_id}           
            }).then(function(result12) {

                if(result12){
					// update avrage rating and total rating
					let ratingSql = "SELECT AVG(rating) AS avg_rating,count(*) AS total_rating From ratings where therapist_id =:therapist_id";
					dbConnection.query(ratingSql, { 
						replacements: {therapist_id: data.therapist_id},	
						type: dbConnection.QueryTypes.SELECT,
					}).then(function(ratingInfo) {
						if(ratingInfo.length > 0){
								let updateSql = "Update users_master set avg_rating =:avg_rating, total_rating=:total_rating where id =:therapist_id";
								 dbConnection.query(updateSql, { 
									type: dbConnection.QueryTypes.UPDATE,
									replacements: {avg_rating: (ratingInfo[0].avg_rating).toFixed(2),total_rating:ratingInfo[0].total_rating,therapist_id:data.therapist_id}                   
								}).then(function(result12) {
									
								});
						}
					});
					
                    response.msg = "Review added successful";
                    response.statusCode = 200;
                    res.statusCode = 200;
                    res.send(response);
                }else{
                    res.statusCode = 400;
                    response.msg = constants.SOMETHING_WENT_WRONG;
                    return res.send(response);
                }
            })
        }
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
       
}
module.exports = rating;
