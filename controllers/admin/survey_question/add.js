// Add new question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

addSurveyQuestion = (req, res) => {
  let response = {};
  let question = req.body.question ? req.body.question : "";
  let therapy_type = req.body.therapy_type ? req.body.therapy_type : "";
  let question_type = req.body.question_type ? req.body.question_type : "";
  let options = req.body.options ? req.body.options : null;
  let group_code_id = req.body.group_code_id ? req.body.group_code_id : null;
  if (question == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.QUESTION_VALIDATION;
    return res.send(response);
  }
  if (therapy_type == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.THERAPY_TYPE_VALIDATION;
    return res.send(response);
  }
  if (question_type == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.QUESTION_TYPE_VALIDATION;
    return res.send(response);
  }
  if (options) {
    options = JSON.stringify([options]);
  }
  let data = {
    question: question,
    therapy_type: therapy_type,
    question_type: question_type,
    options: options,
    group_code_id: group_code_id,
  };
  let query =
    "INSERT INTO survey_questions SET group_code_id = :group_code_id, question = :question, therapy_type = :therapy_type, question_type = :question_type, options = :options";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.ADD_QUESTION;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into add survey question.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = addSurveyQuestion;
