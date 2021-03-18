var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
const fs = require("fs");

var editAssessment = (req, res) => {
  var response = {};
  let id = req.body.id ? req.body.id : "";
  let title = req.body.title ? req.body.title : "";
  let description = req.body.description ? req.body.description : "";
  let image = req.body.image ? req.body.image : "";
  if (!id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
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
  let select_query =
    "SELECT id, image FROM assessments WHERE id = :id AND deleted_at IS NULL";
  dbConnection
    .query(select_query, {
      replacements: { id: id },
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length <= 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        return res.send(response);
      }
      var data = {
        id: id,
        title: title,
        description: description,
      };
      var query =
        "UPDATE assessments SET title = :title, description = :description ";
      if (image) {
        query += " , image = :image";
        data.image = image;
      }
      query += " WHERE id = :id";
      dbConnection
        .query(query, {
          replacements: data,
          type: dbConnection.QueryTypes.UPDATE,
        })
        .then((update_result) => {
          // delete previous image
          if (image && result[0].image) {
            fs.unlink(
              constants.IMAGE_UPLOAD_PATH + "assessment/" + result[0].image,
              (err) => {}
            );
          }
          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.SUCCESS_STATUS_CODE;
          response.message = constants.ASSESSMENT_UPDATE_SUCCESS;
          return res.send(response);
        })
        .catch((err) => {
          console.error("Error into assessment update.js: " + err);
          res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
          response.message = constants.SOMETHING_WENT_WRONG;
          return res.send(response);
        });
    })
    .catch((err) => {
      console.error("Error into assessment select.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = editAssessment;
