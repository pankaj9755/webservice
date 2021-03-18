const dbConnection = require("./../../config/connection");
const Validator = require('validatorjs');
updateVideoPlanTime = (req, res) => {
	const response = {
        'msg': '',
        'result':[],
    };
    const data = {
    	plan_id:req.body.plan_id,
        used_seconds:req.body.used_seconds,
    };
    const rules = {
    	used_seconds:'required',
        plan_id: 'required',
    }
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    let selectSql = "SELECT seconds,used_seconds,id FROM user_video_plan where user_id = :user_id and id = :plan_id";

    dbConnection.query(selectSql, { 
        type: dbConnection.QueryTypes.SELECT,
        replacements: {user_id: user_id,plan_id:data.plan_id}
    }).then(function(result0) {
        if(result0.length > 0){
            console.log('------------------------------------------------99999999999999');
            
            var befor_used_sec =  result0[0].used_seconds;
            let after_used_sec = parseInt(result0[0].used_seconds)  + parseInt(data.used_seconds);
            //console.log(data.used_seconds);
            //console.log(parseInt(data.used_seconds));
            //console.log(result0.used_seconds);

            let updateSql = "UPDATE user_video_plan set used_seconds = '"+after_used_sec+"' where id = '"+data.plan_id+"'";
            dbConnection.query(updateSql, { 
                type: dbConnection.QueryTypes.UPDATE,
            });

            response.msg = 'Plan has been updated successfully.';
            res.statusCode = 200;
            res.send(response);
        }

    })


    
}
module.exports = updateVideoPlanTime;