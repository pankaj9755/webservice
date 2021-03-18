const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");


myReview = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    var user_id = res.locals.userData.id;
    //var SelectSql = "SELECT  ratings.*, users_master.first_name AS first_name,users_master.last_name AS last_name FROM ratings LEFT JOIN users_master ON users_master.id = ratings.customer_id WHERE ratings.therapist_id = "+ user_id + " ORDER BY ratings.id DESC";
    var SelectSql =  "SELECT  ratings.*, 'Anonymous' AS first_name,'' AS last_name FROM ratings WHERE ratings.therapist_id = "+ user_id + " ORDER BY ratings.id DESC";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(resultreviews) {
    	if(resultreviews.length > 0){

            response.msg = 'my review';
            response.statusCode = 200;
            response.result = resultreviews;
            res.statusCode = 200;
            res.send(response);
    	}else{
    		res.statusCode = 200;
            response.statusCode = 200;
            response.msg = 'No Review Yet';
            response.result = [];
            res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
    
}
module.exports = myReview;
