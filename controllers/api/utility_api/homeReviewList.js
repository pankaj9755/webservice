const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");


homeReviewList = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
       
    var SelectSql =  "SELECT  id,review FROM ratings WHERE (deleted_at is Null AND review IS NOT NUll AND review!='') ORDER BY ratings.id DESC LIMIT 10";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(resultreviews) {
    	if(resultreviews.length > 0){

            response.msg = 'home review';
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
module.exports = homeReviewList;
