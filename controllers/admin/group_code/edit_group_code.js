// Edit group code.
const constants = require("./../../../config/adminConstants");
const dbConnection = require("./../../../config/connection");
const moment = require("moment");

EditGroupCode = (req, res) => {
  let response = {};
  let promises = [];
  let group_code_id = req.body.group_code_id ? req.body.group_code_id : "";
  let title = req.body.title ? req.body.title : "";
  let code = req.body.code ? req.body.code : "";
  let freeSession = req.body.freeSession ? req.body.freeSession : "";
  let expiry_date = req.body.expiry_date ? req.body.expiry_date : null;
  let therapist_id_array = req.body.therapist_id_array
    ? JSON.parse(req.body.therapist_id_array)
    : "";
  if (group_code_id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.GROUP_CODE_ID;
    return res.send(response);
  } else if (title == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TITLE_VALIDATION;
    return res.send(response);
  } else if (code == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.CODE_VALIDATION;
    return res.send(response);
  } else if (freeSession == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.FREE_SESSION;
    return res.send(response);
  } else if (therapist_id_array == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.THERAPIST_ID;
    return res.send(response);
  } else {
    let data = {
      id: group_code_id,
      title: title,
      code: code.toUpperCase(),
      freeSession: freeSession,
      expiry_date: expiry_date,
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    let query1 =
      "UPDATE group_code SET title = :title, code = :code, free_session = :freeSession, expiry_date = :expiry_date, updated_at = :updated_at WHERE id = :id";
    let query2 = "DELETE FROM therapist_group_code WHERE group_code_id = :id";
    let query3 =
      "INSERT INTO therapist_group_code(group_code_id, therapist_id) VALUES ?";

    let insert_data = [];
    therapist_id_array.forEach((element) => {
      insert_data.push([group_code_id, element]);
    });

    promises.push(
      dbConnection.query(query1, {
        replacements: data,
        type: dbConnection.QueryTypes.UPDATE,
      }),
      dbConnection.query(query2, {
        replacements: { id: group_code_id },
        type: dbConnection.QueryTypes.DELETE,
      }),
      dbConnection.query(query3, {
        replacements: [insert_data],
        type: dbConnection.QueryTypes.INSERT,
      })
    );

    Promise.all(promises)
      .then((result) => {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = constants.EDIT_GROUP_CODE;
        return res.send(response);
      })
      .catch((err) => {
        console.error("Error into edit_group_code.js: ", err);
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        response.message = constants.SOMETHING_WENT_WRONG;
        return res.send(response);
      });
  }
};
module.exports = EditGroupCode;
