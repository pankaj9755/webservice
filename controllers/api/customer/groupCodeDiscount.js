const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
groupCodeDiscount = (req,res) => {

    var promises = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    
    var user_id = res.locals.userData.id;
	
	
	let countUsedGroupSql = "SELECT count(*) AS total_session FROM requests WHERE customer_id = '"+res.locals.userData.id+"' && status IN ('pending','wip')"; //

	 let groupCodeSql = "SELECT id,code,free_session FROM group_code WHERE code = '"+res.locals.userData.group_code+"' ";
   
    promises.push(dbConnection.query(countUsedGroupSql, {
        type: dbConnection.QueryTypes.SELECT
    }).then(function(countUsedGroupResult) {
        countUsedGroupInfo = countUsedGroupResult;
    }));
    
    promises.push(dbConnection.query(groupCodeSql, {
        type: dbConnection.QueryTypes.SELECT
    }).then(function(groupCodeResult) {
        groupCodeInfo = groupCodeResult;
    }));

    Promise.all(promises).then(function(result) {
	
        if(groupCodeInfo.length>0){
			var remaingSession = groupCodeInfo[0].free_session-countUsedGroupInfo[0].total_session;
			console.log('remaingSession===============',remaingSession);
			if(remaingSession>0){
				response.statusCode = 200;
				response.msg = "";
				response.result = {'group_code':groupCodeInfo[0].code,'is_group_code_applied':true};
				return res.send(response);
			}else{
				response.statusCode = 200;
				response.msg = "";
				response.result = { 'is_group_code_applied':false};
				return res.send(response);
			}
			
        }else{
            response.statusCode = 200;
			response.msg = "";
			response.result = {'is_group_code_applied':false};
			return res.send(response);
			
             
        }                

        

    }).catch(function(err) {
        console.log('err',err);
       response.statusCode = 200;
		response.msg = "";
		response.result = {'is_group_code_applied':false};
		return res.send(response);
    });               
    	
}
module.exports = groupCodeDiscount;
