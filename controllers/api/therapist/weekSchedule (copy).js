const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
var moment = require('moment');
weekSchedule = (req,res) => {

    var currentWeekDay = moment().weekday(); //current week number;
    var schedule = [];
    const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        week_number:req.query.week_number,
        id:req.query.id,
    };
    const rules = {
        week_number: 'required',
        id: 'required',
    };    
    const validation = new Validator(data,rules);
    if(validation.fails()){
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }        
   
    
    moment.createFromInputFallback = function(config) {config._d = new Date(config._i);}; //important

    let SelectSql = "Select therapist_schedule.day_number,therapist_schedule.schedule From users_master JOIN therapist_schedule ON users_master.id = therapist_schedule.therapist_id WHERE users_master.unic_id = '"+req.query.id+"' ";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {


        if(result1.length > 0){            

           	var dayArray = {"0":"sunday", "1":"monday", "2":"tuesday", "3":"wednesday", "4":"thrusday", "5":"friday", "6":"saturday"}; //day array

            for(var i=0; i<result1.length; i++){
                var item = {};
                if(result1[i].schedule.length > 0 && currentWeekDay <= result1[i].day_number){
                	
                    var fridayDataVal = JSON.parse(result1[i].schedule);                
                    console.log("fridayDataVal-------", fridayDataVal);
                    for(var s=0; s<fridayDataVal.length; s++){              
                    	         
                        var dayName = dayArray[result1[i].day_number]; //---get day name
                        var startDate = moment().day(dayName).week(data.week_number).format("YYYY-MM-DD");//---get start date
                        //---get start and end date time  
                        var startDateTime = startDate +' '+ fridayDataVal[s].to;
                        var endDateTime = startDate +' '+ fridayDataVal[s].from;

                        startDateTimeValue= moment(startDateTime).format("YYYY-MM-DD HH:mm a");
                        endDateTimeValue= moment(endDateTime).format("YYYY-MM-DD HH:mm a");

                        startDateTimeCheck= moment(startDateTime).format("HH");
                        endDateTimeCheck= moment(endDateTime).format("HH");
                        
                        //---get start and end date time
                        if(startDateTimeCheck<12){
                            getStartHour = moment(startDateTime).format("HH");
                        }else{
                            getStartHour = startDateTimeCheck;
                        }

                        if(endDateTimeCheck<12){
                            getEndHour = moment(endDateTime).format("HH"); 
                        }else{
                            getEndHour = endDateTimeCheck;
                        }                                                                        
                                                                
                        //---get start hour and end hour               
               			
                            for(let hour = getStartHour; hour <= getEndHour; hour++) {

                                startHourTitle = moment({hour}).format("hh:mm A"); //---final start hour
                                endHourTitle = moment({hour,minute: 30}).format("hh:mm A"); //---final
                            
                                startHourFirst = moment({hour}).format("HH:mm:ss"); //---final start hour
                                endHourFirst = moment({hour,minute: 30}).format("HH:mm:ss"); //---final end hour                                
                                //startHourSecond = moment({hour,minute: 30}).format("hh:mm A"); //---final start hour                           
                                endHourSecond = moment({hour}).add(1, 'hour').format("HH:mm:ss") //---final  end hour                                                         
                                if(hour < getEndHour){ 

                                    var dateTimeJson =  {'available':true,
                                                        //'title':startHourFirst,
                                                        'title':startHourTitle,
                                                        'start':startDate+' '+startHourFirst,
                                                        'end':startDate+' '+endHourFirst,
                                                        'className':['avl-bg-cal','cal-text-cent'],
                                                        'backgroundColor':'#bac866',
                                                        'borderColor':'#bac866',
                                                        'textColor':'#fff',
                                                    }; 
                                    var dateTimeSecondJson =  {'available':true,
                                                                //'title':endHourFirst,
                                                                'title':endHourTitle,
                                                                'start':startDate+' '+endHourFirst,
                                                                'end':startDate+' '+endHourSecond,
                                                                'className':['avl-bg-cal','cal-text-cent'],
                                                                'backgroundColor':'#bac866',
                                                                'borderColor':'#bac866',
                                                                'textColor':'#fff',
                                                    };

                                    var finalJson = JSON.stringify(dateTimeJson);
                                    finalJson = JSON.parse(finalJson);
                                    var finalSecondJson = JSON.stringify(dateTimeSecondJson);
                                    finalSecondJson = JSON.parse(finalSecondJson);

                                    schedule.push(finalJson);      
                                    schedule.push(finalSecondJson); 
                                }                                                                             
                            }
                        

                        
                        
                    }  
                }
            }
                                    
            response.msg = constants.WEEK_SCHEDULE;
            response.statusCode = 200;            
            response.result = schedule;
            res.statusCode = 200;
            res.send(response);
        }else{
            res.statusCode = 400;
            response.statusCode = 400;
            response.msg = constants.RECORD_NOT_FOUND;            
            response.result = [];
            res.send(response);
        }
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
}
module.exports = weekSchedule;
