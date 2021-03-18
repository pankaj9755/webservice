const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const UtilityHelper = require('./../../../libraries/UtilityHelper')();
const Validator = require('validatorjs');
var moment = require('moment');
weekSchedule = (req,res) => {

    var currentWeekDay = moment().weekday(); //current week number;
    var schedule = [];
    var requestArray = [];
   
    const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
        week_number:req.query.week_number,
        id:req.query.id,
        timeoffset:req.query.timeoffset,
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

    let SelectSql = "Select users_master.id,therapist_schedule.day_number,therapist_schedule.schedule From users_master JOIN therapist_schedule ON users_master.id = therapist_schedule.therapist_id WHERE users_master.unic_id = '"+req.query.id+"' AND is_open='yes' ";
    dbConnection.query(SelectSql, { 
        type: dbConnection.QueryTypes.SELECT,
    }).then(function(result1) {

        if(result1.length > 0){
			var currentWeekNumber = moment().format('w')
        	var dayArray = {"0":"sunday", "1":"monday", "2":"tuesday", "3":"wednesday", "4":"thrusday", "5":"friday", "6":"saturday"}; //day array
        	var startRequestDate = moment().day("sunday").week(data.week_number).format("YYYY-MM-DD 00:00:00");
        	console.log("---startRequestDate--"+startRequestDate);
        	var endRequestDate = moment().day("satirday").week(data.week_number).format("YYYY-MM-DD 23:59:59");
        	console.log("---endRequestDate--"+endRequestDate);

        	let RequestSelectSql = "SELECT id,apointment_date_time FROM requests WHERE therapist_id='"+result1[0].id+"' And apointment_date_time >= '"+startRequestDate+"' AND apointment_date_time <= '"+endRequestDate+"' AND status NOT IN ('draft','cancel','completed')";

		    dbConnection.query(RequestSelectSql, { 
		        type: dbConnection.QueryTypes.SELECT,
		    }).then(function(requestResult) { 

		    	if(requestResult.length > 0){
					
		    		for(var r=0; r<requestResult.length; r++){
						
		    			var appointmentDate = moment(requestResult[r].apointment_date_time).utcOffset(Number(data.timeoffset)).format("YYYY-MM-DD HH:mm:ss");
		    				
						//console.log('requestResult[r].apointment_date_time',requestResult[r].apointment_date_time);
						//console.log('appointmentDate',appointmentDate);
							
						requestArray.push(appointmentDate); //request appointment date push
		    		}			    		
		    	}    	

	            for(var i=0; i<result1.length; i++){
	                var item = {};
	                console.log("currentWeekNumber-------", currentWeekNumber);
	                if(result1[i].schedule.length > 0 && (currentWeekDay <= result1[i].day_number || data.week_number!=currentWeekNumber)){
	                	
	                    var fridayDataVal = JSON.parse(result1[i].schedule);                
	                    
	                    for(var s=0; s<fridayDataVal.length; s++){              
	                    	         
	                        var dayName = dayArray[result1[i].day_number]; //---get day name
	                        var startDate = moment().day(dayName).week(data.week_number).format("YYYY-MM-DD");//---get start date
	                        //---get start and end date time  
	                        var startDateTime = startDate +' '+ fridayDataVal[s].to;
	                        var endDateTime = startDate +' '+ fridayDataVal[s].from;
	                        // subtract 60 mintues means 6-7 Pm not avaliable at 7 pm 
	                        var endDateTime = moment(endDateTime).subtract('60','minutes').format("YYYY-MM-DD HH:mm:00");
							
	                        startDateTimeValue= moment(startDateTime).format("YYYY-MM-DD HH:mm a");//formate change
	                        endDateTimeValue= moment(endDateTime).format("YYYY-MM-DD HH:mm a");//formate change

	                        startHourCheck = moment(startDateTime).format("HH");//get hour 
	                        endHourCheck = moment(endDateTime).format("HH");//get hour 
	                        startMinuteCheck = moment(startDateTime).format("mm");//get minute                   
	                        endMinuteCheck = moment(endDateTime).format("mm");//get minute             
	                        	                      	                     

	                        if(startHourCheck<12){
	                            getStartHour = moment(startDateTime).format("HH");
	                        }else{
	                            getStartHour = startHourCheck;
	                        }
	             
	                        if(endHourCheck<12 && startMinuteCheck>0){                        
	                        	getEndHour = moment(endDateTime).format("HH"); 
	                            endBreakHour = moment(endDateTime).add(-1, 'hour').format("HH");       	
	                        }else if(endHourCheck<12){                        	
	                        	getEndHour = moment(endDateTime).format("HH");
	                        }else if(endHourCheck>12 && startMinuteCheck>0 && endMinuteCheck>0){
	                        	getEndHour = endHourCheck;
	                            endBreakHour = moment(endDateTime).format("HH");
	                        }else if(endHourCheck>12 && endMinuteCheck>0){
	                        	getEndHour = endHourCheck;
	                            endBreakHour = moment(endDateTime).format("HH");
	                        }else if(endHourCheck>12 && startMinuteCheck>0){
	                        	getEndHour = endHourCheck;
	                            endBreakHour = moment(endDateTime).add(-1, 'hour').format("HH");
	                        }else{                        	
	                            getEndHour = endHourCheck;                           
	                        }	                     

	                        //---get start hour and end hour               
	               			for(let hour = getStartHour; hour <= getEndHour; hour++) {

	                        	
								startHourTitle = moment({hour}).format("hh:mm A"); //---final start hour
	                            endHourTitle = moment({hour}).add(1, 'hour').format("hh:mm A"); //---final
	                        	startHourFirst = moment({hour}).format("HH:mm:ss");//---final start hour
	                            endHourFirst = moment({hour}).add(1, 'hour').format("HH:mm:ss");//---final end hour     
	                        	var sValFirst = startDate+' '+startHourFirst;	
                            	if(requestArray.length>0 && requestArray.includes(sValFirst)) { //check this request appointment available or not in array
                            		availabilityFirst = false;
                            		classNameFirst = ['book-bg-cal'];
                            		backgroundColorFirst = '#d8d2d2';
                            		borderColorFirst = '#d8d2d2';
                            		textColorFirst = '#000';
                            	}else{
                            		availabilityFirst = true;
                            		classNameFirst = ['avl-bg-cal','cal-text-cent'];
                            		backgroundColorFirst = '#bac866';
                            		borderColorFirst = '#bac866';
                            		textColorFirst = '#000';
                            	}	                            	
                            	var dateTimeJson =  {'available':availabilityFirst,	                 
                            						'title':startHourTitle,
                                                    'start':startDate+' '+startHourFirst,
                                                    'end':startDate+' '+endHourFirst,
                                                    'className':classNameFirst,
                                                    'backgroundColor':backgroundColorFirst,
                                                    'borderColor':borderColorFirst,
                                                    'textColor':textColorFirst,
                                                };
                                                
                                                
								//~ var finalJson = JSON.stringify(dateTimeJson);
		                             //~ finalJson = JSON.parse(finalJson);
		                             //~ schedule.push(finalJson); //First json push
		                             // now to 5 hours later not show therpist 
		                        let afterTwelveHours = moment().add(5, 'hour').valueOf();
								let dbDateTimeValue = moment(startDate+' '+startHourFirst).valueOf();
								 console.log('dbDateTimeValue: ', dbDateTimeValue);
								var finalJson = JSON.stringify(dateTimeJson);
								finalJson = JSON.parse(finalJson);
								if (dbDateTimeValue > afterTwelveHours) {
								  schedule.push(finalJson); //First json push
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
	        }).catch(function(err) {
		        res.statusCode = 500;
		        res.msg = err;
		        console.log(err);
		        res.send(response);
		    });
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
