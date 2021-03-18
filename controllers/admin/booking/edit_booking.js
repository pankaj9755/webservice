// Edit video plans list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var moment = require('moment');
EditBooking = (req, res) => {
	var response = {};
	var id = req.body.id ? req.body.id : "";
	var timeoffset = req.body.timeoffset ?req.body.timeoffset:120;
	

	if (id == "") {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.statusCode = constants.VALIDATION_STATUS_CODE;
		response.msg = constants.ID_VALIDATION;
		res.send(response);
	}

	var schedule_date = moment(req.body.schedule_date).utc().format("YYYY-MM-DD HH:mm:00");

	
    var data ={id:id,schedule_date:schedule_date};
    var query =  "UPDATE requests SET apointment_date_time=:schedule_date WHERE id=:id";

	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.statusCode = constants.SUCCESS_STATUS_CODE;
		response.msg = constants.EDIT_BOOK_SUCCESS;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_book_paid.js: "+ err);
		res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		response.msg = constants.SOMETHING_WENT_WRONG;
		response.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
		res.send(response);
	});
}
module.exports = EditBooking;
