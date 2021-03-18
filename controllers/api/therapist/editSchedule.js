const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
var dateFormat = require('dateformat');
var moment = require('moment');
editSchedule = (req,res) => {
    
    var promiseData = [];
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	input_data:req.body.input_data,
    };
    const rules = {
        input_data: 'required',
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    var inputData = JSON.stringify(req.body.input_data)
    var inputDataVal = JSON.parse(inputData);

    console.log("inputDataVal=========");
    console.log(inputDataVal);
    console.log("inputDataVal");

    let SelectSql = "Select * From therapist_schedule where therapist_id = '"+user_id+"' ";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {
        if(result1.length > 0){

            for(var i=0; i<inputDataVal.length; i++){
                
                /*if(inputDataVal[i].open_time == ""){
                    var open_time = "00:00:00";
                }else{
                    var openDateTime = inputDataVal[i].open_time;
                    var originalOpenDateTime = moment(openDateTime, "hh:mm a");
                    console.log("--original open_time---------",originalOpenDateTime.format("HH:mm:00"));
                    var open_time = originalOpenDateTime.format('HH:mm:00');
                }
                
                if(inputDataVal[i].close_time == ""){
                    var close_time = "00:00:00";
                }else{
                    var closeDateTime = inputDataVal[i].close_time;
                    var originalCloseDateTime = moment(closeDateTime, "hh:mm a");
                    var close_time = originalCloseDateTime.format('HH:mm:00');
                }*/

                if(inputDataVal[i].schedule.length>0){

                    //var scheduleDataVal = JSON.stringify(inputDataVal[i].schedule)
                    //var scheduleData = JSON.parse(scheduleDataVal);

                    var scheduleData = inputDataVal[i].schedule;
                    var scheduleArray = [];
                    for(var j=0; j<scheduleData.length; j++){
                        var toSchedule = scheduleData[j].to;
                        var originalToSchedule = moment(toSchedule, "hh:mm a");
                        var toScheduleFinalVal = originalToSchedule.format('HH:mm:00');

                        var fromSchedule = scheduleData[j].from;
                        var originalFromSchedule = moment(fromSchedule, "hh:mm a");
                        var fromScheduleFinalVal = originalFromSchedule.format('HH:mm:00');

                        if(toScheduleFinalVal !="Invalid date" || fromScheduleFinalVal !="Invalid date"){
							scheduleArray.push({"to":toScheduleFinalVal,"from":fromScheduleFinalVal});
                        }
                    }   
                    console.log("------scheduleArray-----");
                    console.log(scheduleArray);
                    console.log("========scheduleArray==========");
                    var schedule = JSON.stringify(scheduleArray);
                }else{
                    var schedule = "";
                }
                
                if(inputDataVal[i].is_open){
					inputDataVal[i].is_open ='yes';
				}else{
					inputDataVal[i].is_open ='no';
				}

                //let UpdateSql = "Update therapist_schedule set open_time = :open_time, close_time = :close_time, is_open = :is_open, schedule = :schedule"
                let UpdateSql = "Update therapist_schedule set is_open = :is_open, schedule = :schedule"
                UpdateSql += " where day_number = :day_number and therapist_id = :therapist_id";

                promiseData.push(
                    dbConnection.query(UpdateSql, { 
                        type: dbConnection.QueryTypes.UPDATE,
                        replacements: {
                            //open_time: open_time,
                            //close_time: close_time,
                            is_open: inputDataVal[i].is_open,   
                            id: inputDataVal[i].id,    
                            day_number: inputDataVal[i].day_number, 
                            therapist_id: user_id,
                            schedule: schedule,
                        }
                    }).then(function(result1) {
                        
                        response.msg = constants.RECORD_UPDATED_SUCCESS;                  
                    }).catch(function(err) {
                        console.log(' -- check failed err.message: ' + err.message);
                        
                        response.msg = err.message;
                        response.statusCode = 500;                                    
                    })
                );
            }
        }  else {
            console.log("kkkkkk");
            for(var i=0; i<inputDataVal.length; i++){
                
                /*if(inputDataVal[i].open_time == ""){
                    var open_time = "00:00:00";
                }else{
                    var openDateTime = inputDataVal[i].open_time;
                    var originalOpenDateTime = moment(openDateTime, "hh:mm a");            
                    var open_time = originalOpenDateTime.format('HH:mm:00');
                }
               
                if(inputDataVal[i].open_time == ""){
                    var close_time = "00:00:00";
                }else{
                    var closeDateTime = inputDataVal[i].close_time;
                    var originalCloseDateTime = moment(closeDateTime, "hh:mm a");
                    var close_time = originalCloseDateTime.format('HH:mm:00');
                }*/

                if(inputDataVal[i].schedule.length>0){

                    var scheduleData = inputDataVal[i].schedule;
                    var scheduleArray = [];
                    for(var j=0; j<scheduleData.length; j++){
						
                        var toSchedule = scheduleData[j].to;
                        var originalToSchedule = moment(toSchedule, "hh:mm a");
                        var toScheduleFinalVal = originalToSchedule.format('HH:mm:00');

                        var fromSchedule = scheduleData[j].from;
                        var originalFromSchedule = moment(fromSchedule, "hh:mm a");
                        var fromScheduleFinalVal = originalFromSchedule.format('HH:mm:00');
						if(toScheduleFinalVal !="Invalid date" || fromScheduleFinalVal !="Invalid date"){
							scheduleArray.push({"to":toScheduleFinalVal,"from":fromScheduleFinalVal});
                        }
                    }   
                    var schedule = JSON.stringify(scheduleArray);
                }else{
                    var schedule = "";
                }
                 if(inputDataVal[i].is_open){
					inputDataVal[i].is_open ='yes';
				}else{
					inputDataVal[i].is_open ='no';
				}

                //let insertSql = "Insert Into therapist_schedule set open_time = :open_time, close_time = :close_time, is_open = :is_open,therapist_id=:therapist_id,day_number=:day_number,schedule=:schedule";

                let insertSql = "Insert Into therapist_schedule set open_time='00:00:00',close_time='00:00:00',is_open=:is_open,therapist_id=:therapist_id,day_number=:day_number,schedule=:schedule";
                
                promiseData.push(
                    dbConnection.query(insertSql, { 
                        type: dbConnection.QueryTypes.INSERT,
                        replacements: {
                            //open_time: open_time,
                            //close_time: close_time,
                            is_open: inputDataVal[i].is_open,      
                            day_number: inputDataVal[i].day_number, 
                            therapist_id: user_id,
                            schedule: schedule,
                        }
                    }).then(function(result1) {
                
                        response.msg = constants.RECORD_UPDATED_SUCCESS;             
                    }).catch(function(err) {                        
                        console.log(' -- check failed err.message: ' + err.message);
                        response.msg = err.message;
                        response.statusCode = 500;         
                    })
                );
            }
        }  

        Promise.all(promiseData).then(function(result) {

            response.msg = constants.RECORD_UPDATED_SUCCESS;
            response.statusCode = 200;
            res.statusCode = 200;
            res.send(response);
        }).catch((err) => {     
            res.statusCode = 400;
            response.msg = err.message;
            response.statusCode = 400;
            res.json(response);
        });
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
    
}
module.exports = editSchedule;
