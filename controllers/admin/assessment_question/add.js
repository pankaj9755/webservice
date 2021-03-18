// Add new question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

addAssessmentQuestion = (req, res) => {
  let response = {};
  let question = req.body.question ? req.body.question : "";
  let question_type = req.body.question_type ? req.body.question_type : "";
  let category = req.body.category ? req.body.category : "";
  let options = req.body.options ? req.body.options : null;
  if (category == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.CATEGORY_VALIDATION;
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
  };
  let query =
    "INSERT INTO assessment_questions SET category = :category, question = :question, question_type = :question_type, options = :options";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.ADD_QUESTION;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into add assessment question.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = addAssessmentQuestion;
