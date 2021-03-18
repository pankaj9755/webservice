const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");

requestList = (req,res) => {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
        'pending':[],
        'completed':[],
        'confirmed':[],
        'canceled':[]
    };
    const promises = [];
     
    var therapist_id = res.locals.userData.id;
    let SelectSql = "SELECT users_master.about_me, users_master.first_name,users_master.last_name,users_master.profile_image,users_master.user_type,requests.id,requests.request_number,requests.therapy_type,requests.status,requests.apointment_date_time,requests.price,discount_promo_code From requests ";
    SelectSql += " LEFT JOIN users_master on users_master.id = requests.customer_id WHERE requests.therapist_id = :therapist_id AND requests.deleted_at is null";
    
    let SelectSql1 = SelectSql + " AND requests.status = 'pending' order by apointment_date_time DESC";
    let SelectSql2 = SelectSql + " AND requests.status = 'wip' order by apointment_date_time DESC";
    let SelectSql3 = SelectSql + " AND requests.status = 'completed' AND requests.request_therapist_delete = 'no' order by apointment_date_time DESC";
    let SelectSql4 = SelectSql + " AND requests.status = 'cancel' AND requests.request_therapist_delete = 'no' order by apointment_date_time DESC";

    promises.push(
        dbConnection.query(SelectSql1, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {therapist_id:therapist_id}
        }).then(function(result1) {
            if(result1.length > 0){
                response.pending = result1;
            }
        }).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            return res.send(response);
        }),
        dbConnection.query(SelectSql2, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {therapist_id:therapist_id}
        }).then(function(result2) {
            if(result2.length > 0){
                response.confirmed = result2;
            }
        }).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            return res.send(response);
        }),
        dbConnection.query(SelectSql3, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {therapist_id:therapist_id}
        }).then(function(result3) {
            if(result3.length > 0){
                response.completed = result3;
            }
        }).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            return res.send(response);
        }),
        dbConnection.query(SelectSql4, { 
            type: dbConnection.QueryTypes.SELECT,
            replacements: {therapist_id:therapist_id}
        }).then(function(result4) {
            if(result4.length > 0){
                response.canceled = result4;
            }
        }).catch(function(err) {
            res.statusCode = 500;
            res.msg = err;
            console.log(err);
            return res.send(response);
        }),
    );

    Promise.all(promises).then(function(result) {
        response.msg = constants.LIST_SUCCESS;
        res.statusCode = 200;
        res.send(response);
    })
    
}
module.exports = requestList;
