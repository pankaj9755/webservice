const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
editRequestDetail = (req,res) => {

     var promiseData = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    
     let SelectSql = "SELECT users_master.id,requests.id AS request_id,customer_id,therapist_id,apointment_date_time,email,mobile_number,first_name,last_name,users_master.therapy_type,unic_id,about_me,qualification,years_experience,hpcsa_no FROM requests LEFT JOIN users_master ON requests.therapist_id=users_master.id  WHERE requests.id = '"+req.query.id+"' AND customer_id='"+user_id+"' AND requests.deleted_at is null";
    
    
   
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {
    	if(result1.length > 0){
            result1[0].email = UtilityHelper.decrypted(result1[0].email);
            result1[0].mobile_number = UtilityHelper.decrypted(result1[0].mobile_number);

            var ratingSql = "SELECT  ratings.*, IF(users_master.first_name != '','Anonymous','Anonymous') AS first_name,IF(users_master.last_name != '','Anonymous','Anonymous') AS last_name FROM ratings LEFT JOIN users_master ON users_master.id = ratings.customer_id WHERE ratings.therapist_id = "+ result1[0].id + " ORDER BY ratings.id DESC";

            promiseData.push(
                dbConnection.query(ratingSql, {
                    type: dbConnection.QueryTypes.SELECT
                }).then(function(review_list) {
                    if(review_list.length > 0){                
                        response.reviewList = review_list;                      
                        return review_list;
                    }else{
                        response.reviewList = [];
                        return review_list;
                    }
                }).catch(function(err) {
                    console.log(' -- check failed err.message: ' + err.message);
                    res.statusCode = 400;
                    response.msg = err.message;
                    response.statusCode = 400;
                    res.send(response);
                }) 
            );

            var AvgRatingSQL = "SELECT AVG(rating) AS rating, (select count(*) AS totalRating FROM ratings WHERE therapist_id = "+ result1[0].id + ") AS total_rating FROM ratings  WHERE therapist_id = "+ result1[0].id + " ";

            promiseData.push(
                dbConnection.query(AvgRatingSQL, {
                    type: dbConnection.QueryTypes.SELECT
                }).then(function(total_rating) {
                    if(total_rating.length > 0){
                        response.totalRating = total_rating;
                        return total_rating;
                    }else{
                        response.totalRating = [];
                        return total_rating;
                    }
                }).catch(function(err) {
                    console.log(' -- check failed err.message: ' + err.message);
                    res.statusCode = 400;
                    response.msg = err.message;
                    response.statusCode = 400;
                    res.send(response);
                    //return service_data;
                }) 
            );

            var SpecialtiesSQL = "SELECT id,therapist_id,name FROM specialties where therapist_id = "+result1[0].id+"";

            promiseData.push(
                dbConnection.query(SpecialtiesSQL, {
                    type: dbConnection.QueryTypes.SELECT
                }).then(function(result_specialties) {
                    if(result_specialties.length > 0){
                        response.specialties_data = result_specialties;
                        return result_specialties;
                    }else{
                        response.specialties_data = [];
                        return result_specialties;
                    }
                }).catch(function(err) {
                    console.log(' -- check failed err.message: ' + err.message);
                    res.statusCode = 400;
                    response.msg = err.message;
                    response.statusCode = 400;
                    res.send(response);
                }) 
            );

            Promise.all(promiseData).then(function() {
                
                result1[0].reviewList = response.reviewList;
                result1[0].totalRating = response.totalRating;
                result1[0].specialties = response.specialties_data;

                response.msg = constants.DETAIL_SUCCESS;
                response.statusCode = 200;
                response.result = result1[0];
                res.statusCode = 200;
                res.send(response);
                   
            }).catch((err) => {
                
                res.statusCode = 400;
                response.msg = err.message;
                response.statusCode = 400;
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
        res.send(response);
    });
    

}
module.exports = editRequestDetail;
