// Delete question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");
const moment = require("moment");

deleteSurveyQuestion = (req, res) => {
  let response = {};
  let id = req.body.id ? req.body.id : "";
  if (id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  // Current date.
  let datetime = moment().format("YYYY-MM-DD HH:mm:ss");
  let data = { deleted_at: datetime, id: id };
  let query =
    "UPDATE survey_questions SET deleted_at = :deleted_at WHERE id = :id";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.DELETE_QUESTION;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into delete survey question.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = deleteSurveyQuestion;
