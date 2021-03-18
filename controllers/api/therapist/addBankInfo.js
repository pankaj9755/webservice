const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();

const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
var dateFormat = require('dateformat');
addBankInfo = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	bank_name:req.body.bank_name,
    	account_holder_name:req.body.account_holder_name,
    	account_number:req.body.account_number,
    	//ssn_number:req.body.ssn_number,
    	zipcode:req.body.zipcode,
    	id_proof:req.body.id_proof,
    	address_line_1:req.body.address_line_1,
    	address_line_2:req.body.address_line_2,
    	state:req.body.state,
    	city:req.body.city,
    	//date_of_birth:req.body.date_of_birth,
    	routing_number:req.body.routing_number,
        //description:req.body.description
    };
    const rules = {
        bank_name: 'required',
        account_holder_name: 'required',
        //ssn_number: 'required',
        //~ zipcode: 'required',
        //~ address_line_1: 'required',
        //~ state: 'required',
        //~ city: 'required',
        //date_of_birth: 'required',
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

    data.bank_id = shortid.generate();
    data.stripe_customer_id = shortid.generate();

    let insertSql = "Insert Into bank_info set user_id = :user_id, bank_id = :bank_id,bank_name = :bank_name,"
    insertSql += " account_holder_name = :account_holder_name , account_number = :account_number,"

    /*insertSql += " ssn_number = :ssn_number, zipcode = :zipcode, id_proof = :id_proof, address_line_1 = :address_line_1,"*/

    //insertSql += " ssn_number = :ssn_number, date_of_birth = :date_of_birth, description = :description,"

    insertSql += " ssn_number = :ssn_number,zipcode=12454,"

   //insertSql += " zipcode = :zipcode, id_proof = :id_proof, address_line_1 = :address_line_1, state = :state, city = :city,"

    insertSql += " routing_number = :routing_number, stripe_customer_id = :stripe_customer_id";

    dbConnection.query(insertSql, { 
        type: dbConnection.QueryTypes.INSERT,
        replacements: {
            user_id: user_id,
            bank_id: data.bank_id,
            bank_name:data.bank_name,
            account_holder_name:data.account_holder_name,
            account_number:data.account_number,
            ssn_number:0,
            date_of_birth: "1991-10-02",
            //date_of_birth: dateFormat(data.date_of_birth, "yyyy-mm-dd"),
            //description:data.description?data.description:'',
            address_line_2:data.address_line_2?data.address_line_2:'',
            zipcode:data.zipcode,
            state:data.state,
            city:data.city,
            
            routing_number:data.routing_number,
            stripe_customer_id:data.stripe_customer_id,
            address_line_1:data.address_line_1,
            id_proof:data.id_proof?data.id_proof:'',            
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
module.exports = addBankInfo;
