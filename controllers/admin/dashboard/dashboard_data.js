// Dashboard data.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

Dashboard = (req, res) => {
	var response = {};
	var data = {};
	var promises = [];

	var query1 = "SELECT COUNT(*) AS total_register_users FROM users_master WHERE user_type='customer' AND deleted_at IS NULL";
	var query2 = "SELECT COUNT(*) AS total_register_therapist FROM users_master WHERE user_type='therapist' AND deleted_at IS NULL";
	var query3 = "SELECT COUNT(*) AS total_bookings FROM requests WHERE deleted_at IS NULL";
	var query4 = "SELECT COUNT(*) AS new_bookings FROM requests WHERE apointment_date_time > NOW()";
	var query5 = "SELECT COUNT(*) AS past_booking FROM requests WHERE apointment_date_time < NOW()";

	promises.push(
		dbConnection.query(query1, { type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.total_users = result[0].total_register_users;
		})
		.catch(err => {
			console.error("Error in dashboard_data.js into query1: " + err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		dbConnection.query(query2, { type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.total_therapist = result[0].total_register_therapist;
		})
		.catch(err => {
			console.error("Error in dashboard_data.js into query2: " + err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		dbConnection.query(query3, { type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.total_bookings = result[0].total_bookings;
		})
		.catch(err => {
			console.error("Error in dashboard_data.js into query3: " + err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		dbConnection.query(query4, { type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.new_booking = result[0].new_bookings;
		})
		.catch(err => {
			console.error("Error in dashboard_data.js into query4: " + err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),

		dbConnection.query(query5, { type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			data.past_booking = result[0].past_booking;
		})
		.catch(err => {
			console.error("Error in dashboard_data.js into query5: " + err);
			res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
			response.message = constants.SOMETHING_WENT_WRONG;
			res.send(response);
		}),
	);

	Promise.all(promises).then(function (result) {
		res.statusCode = constants.SUCCESS_STATUS_CODE;
		response.status = constants.SUCCESS_STATUS_CODE;
		response.message = "Dashboard data.";
		response.result = data;
		res.send(response);
	});
}
module.exports = Dashboard;