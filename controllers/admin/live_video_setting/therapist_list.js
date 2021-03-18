// Questions list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

therapistList = (req, res) => {
  let response = {};
  let select_query =
    "SELECT id, first_name, last_name FROM users_master WHERE status = 'active' AND deleted_at IS NULL AND user_type='therapist' ORDER BY id DESC";
  dbConnection
    .query(select_query, {
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length > 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = "Therapist list";
        response.result = result;
        return res.send(response);
      } else {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        return res.send(response);
      }
    })
    .catch((err) => {
      console.error("Error in therapist list.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = therapistList;
