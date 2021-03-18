// Get group code details.
var constants = require("./../../../config/adminConstants");
var dbConnection = require("./../../../config/connection");

GroupCode = (req, res) => {
  let response = {};
  let data = {};
  let group_code_id = req.query.id ? req.query.id : "";

  if (group_code_id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.GROUP_CODE_ID;
    return res.send(response);
  } else {
    const query1 =
      "SELECT id, title, code, free_session, expiry_date, permission FROM group_code WHERE id = :id AND deleted_at IS NULL";
    const query2 =
      "SELECT therapist_id FROM therapist_group_code WHERE group_code_id = :id";

    dbConnection
      .query(query1, {
        replacements: { id: group_code_id },
        type: dbConnection.QueryTypes.SELECT,
      })
      .then((result) => {
        if (result.length > 0) {
          result.forEach((element) => {
            data.id = element.id;
            data.title = element.title;
            data.code = element.code;
            data.free_session = element.free_session;
            data.permission = element.permission;
            data.expiry_date = element.expiry_date;
          });

          dbConnection
            .query(query2, {
              replacements: { id: group_code_id },
              type: dbConnection.QueryTypes.SELECT,
            })
            .then((result) => {
              let therapistId = [];
              result.forEach((element) => {
                therapistId.push(element.therapist_id);
              });
              data.therapist_id = therapistId;

              res.statusCode = constants.SUCCESS_STATUS_CODE;
              response.status = constants.SUCCESS_STATUS_CODE;
              response.message = "Group-Code Details.";
              response.result = data;
              res.send(response);
            })
            .catch((err) => {
              console.error("Error in get_group_code_details.js: ", err);
              res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
              response.message = constants.SOMETHING_WENT_WRONG;
              res.send(response);
            });
        } else {
          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
          response.message = constants.RECORD_NOT_FOUND;
          response.result = data;
          res.send(response);
        }
      })
      .catch((err) => {
        console.error("Error in get_group_code_details.js: ", err);
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        response.message = constants.SOMETHING_WENT_WRONG;
        res.send(response);
      });
  }
};
module.exports = GroupCode;
