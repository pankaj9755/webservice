// Edit question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

editAssessmentQuestion = (req, res) => {
  let response = {};
  let question_id = req.body.id ? req.body.id : "";
  let question = req.body.question ? req.body.question : "";
  let category = req.body.category ? req.body.category : "";
  let question_type = req.body.question_type ? req.body.question_type : "";
  let options = req.body.options ? req.body.options : null;
  if (category == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.CATEGORY_VALIDATION;
    return res.send(response);
  }
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
    category: category,
    question: question,
    question_type: question_type,
    options: options,
    id: question_id,
  };
  let query =
    "UPDATE assessment_questions SET category = :category, question = :question, question_type = :question_type, options = :options WHERE id = :id";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.EDIT_QUESTION;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into edit assessment question.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = editAssessmentQuestion;
