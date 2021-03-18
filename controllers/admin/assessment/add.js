var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

var addAssessment = (req, res) => {
  var response = {};
  let title = req.body.title ? req.body.title : "";
  let description = req.body.description ? req.body.description : "";
  let image = req.body.image ? req.body.image : "";
  if (!title) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TITLE_VALIDATION;
    return res.send(response);
  }
  if (!description) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.DESCRIPTION_VALIDATION;
    return res.send(response);
  }
  if (!image) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.FILE_VALIDATION;
    return res.send(response);
  }
  var data = {
    title: title,
    description: description,
    image: image,
  };
  var query =
    "INSERT INTO assessments SET title = :title, description = :description, image = :image";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = "Assessments added successfully";
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into assessments add.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = addAssessment;
