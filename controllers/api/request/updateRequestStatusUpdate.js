const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
var moment = require('moment');
const Validator = require('validatorjs');
updateRequestStatusUpdate = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	request_number:req.body.id,
    	status:req.body.status,
    };
    const rules = {
        request_number: 'required',
        status: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var customer_id = res.locals.userData.id;
    var updated_at = moment().format("YYYY-MM-DD HH:mm:00");
    
	let UpdateSql = "UPDATE requests SET ";
		UpdateSql += " status = :status,updated_at='"+updated_at+"' ";
		UpdateSql += " WHERE request_number = :request_number AND customer_id=:customer_id";
		
	dbConnection.query(UpdateSql, { 
		type: dbConnection.QueryTypes.UPDATE,
		replacements: {
			request_number: data.request_number,
			customer_id: customer_id,
			status: data.status
		}
	}).then(function(updateresutl) {
		response.statusCode = 200;
		response.msg = 'order updated successful';
        return res.send(response);
	
	}).catch(function(err) {
		response.statusCode = 500;
		response.msg = err;
		
		res.send(response);
	});
}
module.exports = updateRequestStatusUpdate;
