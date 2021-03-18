// Edit question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

editSurveyQuestion = (req, res) => {
  let response = {};
  let question_id = req.body.id ? req.body.id : "";
  let question = req.body.question ? req.body.question : "";
  let therapy_type = req.body.therapy_type ? req.body.therapy_type : "";
  let question_type = req.body.question_type ? req.body.question_type : "";
  let options = req.body.options ? req.body.options : null;
  let group_code_id = req.body.group_code_id ? req.body.group_code_id : null;
  if (question_id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
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
    id: question_id,
    group_code_id: group_code_id,
  };
  let query =
    "UPDATE survey_questions SET  group_code_id = :group_code_id, question = :question, therapy_type = :therapy_type, question_type = :question_type, options = :options WHERE id = :id";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.EDIT_QUESTION;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into edit_question.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = editSurveyQuestion;
