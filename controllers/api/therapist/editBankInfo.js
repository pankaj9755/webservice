const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
var dateFormat = require('dateformat');

editBankInfo = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
	const data = {
    	bank_name:req.body.bank_name,
    	account_holder_name:req.body.account_holder_name,
    	account_number:req.body.account_number,
    	ssn_number:req.body.ssn_number,
    	zipcode:req.body.zipcode,
    	id_proof:req.body.id_proof,
    	address_line_1:req.body.address_line_1,
    	address_line_2:req.body.address_line_2,
    	state:req.body.state,
    	city:req.body.city,
    	date_of_birth:req.body.date_of_birth,
    	routing_number:req.body.routing_number,
        description:req.body.description
    };
    const rules = {
        bank_name: 'required',
        account_holder_name: 'required',
        ssn_number: 'required',
        //~ zipcode: 'required',
        //~ address_line_1: 'required',
        //~ state: 'required',
        //~ city: 'required',
        //~ date_of_birth: 'required',
        routing_number: 'required',
        account_number:'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    let updateSql = "UPDATE  bank_info set  bank_name = :bank_name,"
    updateSql += " account_holder_name = :account_holder_name , account_number = :account_number,"
    updateSql += " ssn_number = :ssn_number, zipcode = :zipcode, id_proof = :id_proof, address_line_1 = :address_line_1,"
    updateSql += " address_line_2 = :address_line_2, state = :state, city = :city, date_of_birth = :date_of_birth,"
    updateSql += " routing_number = :routing_number, description = :description ";
    updateSql += " where user_id = :user_id";
    dbConnection.query(updateSql, { 
        type: dbConnection.QueryTypes.UPDATE,
        replacements: {
        	user_id:user_id,
            bank_name:data.bank_name,
            account_holder_name:data.account_holder_name,
            account_number:data.account_number,
            ssn_number:data.ssn_number,
            zipcode:data.zipcode,
            state:data.state,
            city:data.city,
            date_of_birth: dateFormat(data.date_of_birth, "yyyy-mm-dd"),
            routing_number:data.routing_number,
            address_line_1:data.address_line_1,
            id_proof:data.id_proof?data.id_proof:'',
            address_line_2:data.address_line_2?data.address_line_2:'',
            description:data.description?data.description:'',
        }

    }).then(function(result1) {
    	if(result1){
    		response.msg = constants.PROFILE_UPDATE_SUCCESS;
            res.statusCode = 200;
            res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
}
module.exports = editBankInfo;
