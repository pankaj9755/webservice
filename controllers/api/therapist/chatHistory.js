const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
chatHistory = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };

    const data = {
        sender_id:req.body.sender_id,
        receiver_id:req.body.receiver_id,
    }

    const rules = {
        sender_id: 'required',
        receiver_id: 'required',
    };

    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }

    let SelectSql = "SELECT * From chat_history  where (sender_id = '"+data.sender_id+"' And receiver_id='"+data.receiver_id+"') Or (sender_id = '"+data.receiver_id+"' And receiver_id='"+data.sender_id+"') ORDER BY id ASC";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result) {

        if(result.length > 0){
                        
            response.msg = "Chat history";
            response.statusCode = 200;
            response.result = result;
            res.statusCode = 200;
            res.send(response);                      
        }else{

            res.statusCode = 500;
            response.statusCode = 500;
            response.result = result;
            response.msg = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
        }
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
    

    
       
}
module.exports = chatHistory;
