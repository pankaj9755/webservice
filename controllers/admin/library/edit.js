var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
const fs = require("fs");

var editLibrary = (req, res) => {
  var response = {};
  let id = req.body.id ? req.body.id : "";
  let topic = req.body.topic ? req.body.topic : "";
  let title = req.body.title ? req.body.title : "";
  let description = req.body.description ? req.body.description : "";
  let type = req.body.type ? req.body.type : "";
  let file = req.body.file ? req.body.file : "";
  let thumbnail = req.body.thumbnail ? req.body.thumbnail : "";

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
  if (!topic) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TOPIC_VALIDATION;
    return res.send(response);
  }
  if (!description) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.DESCRIPTION_VALIDATION;
    return res.send(response);
  }
  if (file) {
    if (!type) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.status = constants.VALIDATION_STATUS_CODE;
      response.message = constants.TYPE_VALIDATION;
      return res.send(response);
    }
    if (type != "image" && type != "video") {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.status = constants.VALIDATION_STATUS_CODE;
      response.message = constants.INVALID_TYPE;
      return res.send(response);
    }
  }
  let select_query =
    "SELECT id, file FROM libraries WHERE id = :id AND deleted_at IS NULL";
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
        topic: topic,
        title: title,
        description: description,
      };
      var query =
        "UPDATE libraries SET topic = :topic, title = :title, description = :description";
      if (file) {
        query += ", type = :type, file = :file";
        data.type = type;
        data.file = file;
      }
      if (thumbnail) {
        query += ", thum_img = :thum_img";
        data.thum_img = thumbnail;
      }
      query += " WHERE id = :id";
      dbConnection
        .query(query, {
          replacements: data,
          type: dbConnection.QueryTypes.UPDATE,
        })
        .then((update_result) => {
          // delete previous image
          if (file && result[0].file) {
            fs.unlink(
              constants.IMAGE_UPLOAD_PATH + "library/" + result[0].file,
              (err) => {}
            );
          }
          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.SUCCESS_STATUS_CODE;
          response.message = constants.LIBRARY_UPDATE_SUCCESS;
          return res.send(response);
        })
        .catch((err) => {
          console.error("Error into library update.js: " + err);
          res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
          response.message = constants.SOMETHING_WENT_WRONG;
          return res.send(response);
        });
    })
    .catch((err) => {
      console.error("Error into library select.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = editLibrary;
