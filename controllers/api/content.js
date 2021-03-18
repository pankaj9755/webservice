const dbConnection = require("./../../config/connection");
const Validator = require('validatorjs');
const constants = require('./../../config/constants');
content = (req, res) => {
	const response = {
        'msg': '',
        'result':[],
    };
    const data = {
    	type:req.body.type,
    };
    const rules = {
        type: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    let SelectSql = "Select * From pages where type = :type";
    dbConnection.query(SelectSql, { 
		type: dbConnection.QueryTypes.SELECT,
		replacements: {type: data.type,}
	}).then(function(isExist) {
		if(isExist.length == 0){
			response.msg = constants.RECORD_NOT_FOUND;
            response.statusCode = 400;
            res.statusCode = 400;
            return res.send(response);
		}

		response.msg = "";
        response.result = isExist[0];
        res.statusCode = 200;
        res.send(response);
	}).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
}
module.exports = content;