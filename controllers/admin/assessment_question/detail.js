// Get question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

detail = (req, res) => {
  let response = {};
  let id = req.query.id ? req.query.id : "";
  if (id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  let query =
    "SELECT id, category, question, question_type, options, status, created_at FROM assessment_questions WHERE id = :id AND deleted_at IS NULL";
  dbConnection
    .query(query, {
      replacements: { id: id },
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length > 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = "Assessment questions details.";
        response.result = result[0];
        return res.send(response);
      } else {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        return res.send(response);
      }
    })
    .catch((err) => {
      console.error("Error assessment question in detail.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = detail;
