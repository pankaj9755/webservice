// Create new group code.
const constants = require('./../../../config/adminConstants');
const dbConnection = require('./../../../config/connection');
const moment = require('moment');

AddGroupCode = (req, res) => {
	let response = {};
	let title = req.body.title ? req.body.title : "";
	let code = req.body.code ? req.body.code : "";
	let freeSession = req.body.freeSession ? req.body.freeSession : '';
	let therapist_id_array = req.body.therapist_id_array ? JSON.parse(req.body.therapist_id_array) : '';

	if (title == '') {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.TITLE_VALIDATION;
		return res.send(response);
	} else if (code == '') {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.CODE_VALIDATION;
		return res.send(response);
	} else if (freeSession == '') {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.FREE_SESSION;
		return res.send(response);
	} else if (therapist_id_array == '') {
		res.statusCode = constants.VALIDATION_STATUS_CODE;
		response.status = constants.VALIDATION_STATUS_CODE;
		response.message = constants.THERAPIST_ID;
		return res.send(response);
	} else {
		let data = { title: title, code: code.toUpperCase(), freeSession: freeSession, created_at: moment().format('YYYY-MM-DD HH:mm:ss') };

		let query1 = "INSERT INTO group_code(title, code, free_session, created_at) VALUES (:title, :code, :freeSession, :created_at)";

		let query2 = 'INSERT INTO therapist_group_code(group_code_id, therapist_id) VALUES ?';

		dbConnection.query(query1, { replacements: data, type: dbConnection.QueryTypes.INSERT })
		.then(result => {
			let group_code_id = result[0];
			let insert_data = [];
			
			therapist_id_array.forEach(element => {
				insert_data.push([group_code_id, element]);
			});
			
			dbConnection.query(query2, { replacements: [insert_data], type: dbConnection.QueryTypes.INSERT })
			.then(result => {
				res.statusCode = constants.SUCCESS_STATUS_CODE;
				response.status = constants.SUCCESS_STATUS_CODE;
				response.message = constants.ADD_GROUP_CODE;
				return res.send(response);
			}).catch(err => {
				console.error("Error into add_group_code.js: ", err);
				res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
				response.message = constants.SOMETHING_WENT_WRONG;
				return res.send(response);
			});
		});

	}
}
module.exports = AddGroupCode;
