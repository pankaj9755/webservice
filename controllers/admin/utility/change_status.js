// Change status.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

ChangeStatus = (req, res) => {
  var response = {};
  var id = req.query.id ? req.query.id : "";
  var status = req.query.status ? req.query.status : "";
  var type = req.query.type;
  var tableName = "";

  if (id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    res.send(response);
  }

  if (status == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.STATUS_VALIDATION;
    res.send(response);
  }

  switch (type) {
    case "user":
      tableName = "users_master";
      break;
    case "question":
      tableName = "questions";
      break;
    case "promoCode":
      tableName = "promocode";
      break;
    case "video_plan":
      tableName = "video_plan";
      break;
    case "groupCode":
      tableName = "group_code";
      break;
    case "library":
      tableName = "libraries";
      break;
    case "assessment":
      tableName = "assessments";
      break;
    case "exercise":
      tableName = "exercises";
      break;
    case "survey_question":
      tableName = "survey_questions";
      break;
    case "mood":
      tableName = "moods";
      break;
    case "assessment_question":
      tableName = "assessment_questions";
      break;
  }

  var query = "UPDATE " + tableName + " SET status = :status WHERE id = :id";
  dbConnection
    .query(query, {
      replacements: { tableName: tableName, id: id, status: status },
      type: dbConnection.QueryTypes.UPDATE,
    })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = constants.STATUS_ON_CHANGE.replace("STATUS", status);
      response.result = status;
      res.send(response);
    })
    .catch((err) => {
      console.error("Error in change_status.js " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      res.send(response);
    });
};
module.exports = ChangeStatus;
