const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var moment = require('moment');

buyVideoPlan = (req,res) => {

	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };

    const data = {
        plan_id:req.body.plan_id,
        price:req.body.price,
        number_of_minutes:req.body.number_of_minutes,
    }

    const rules = {
        plan_id: 'required',
        price: 'required',
        number_of_minutes: 'required',
    };

    var user_id = res.locals.userData.id;

    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }

    let lastInvoiceSql = "Select count(*) As last_invoice_id From user_video_plan Where DATE(created_at) ='"+moment().format('YYYY-MM-DD')+"'";
    dbConnection.query(lastInvoiceSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(lastInvoiceInfo) {

        var invoice_id = lastInvoiceInfo[0].last_invoice_id+100; // last invoice id
        invoice_id = moment().format('YYYYMMDD')+""+invoice_id+"";

            let insertSql = "Insert Into user_video_plan set plan_id =:plan_id, user_id =:user_id, amount =:amount, seconds=:seconds, invoice_id =:invoice_id";

            var numberOfMinute = data.number_of_minutes*60; //minute convert in seconds

            dbConnection.query(insertSql, { 
                type: dbConnection.QueryTypes.INSERT,     
                replacements: {plan_id:data.plan_id, amount:data.price, user_id:user_id, seconds:numberOfMinute, invoice_id:invoice_id}           
            }).then(function(result12) {

                if(result12){
                    response.msg = "Plan added successful";
                    response.statusCode = 200;
                    response.order_number = invoice_id;
                    res.statusCode = 200;
                    res.send(response);
                }else{
                    res.statusCode = 400;
                    response.msg = constants.SOMETHING_WENT_WRONG;
                    return res.send(response);
                }
            }).catch(function(err) {
                res.statusCode = 500;
                res.msg = err;
                console.log(err);
                res.send(response);
            });

    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });

}
module.exports = buyVideoPlan;
