var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

var addLibrary = (req, res) => {
  var response = {};
  let title = req.body.title ? req.body.title : "";
  let topic = req.body.topic ? req.body.topic : "";
  let description = req.body.description ? req.body.description : "";
  let type = req.body.type ? req.body.type : "";
  let file = req.body.file ? req.body.file : "";
  let thumbnail = req.body.thumbnail ? req.body.thumbnail : "";

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
  if (!file) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.FILE_VALIDATION;
    return res.send(response);
  }
  if (type == "video" && !thumbnail) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.THUMBNAIL_FILE_VALIDATION;
    return res.send(response);
  }

  var data = {
    topic: topic,
    title: title,
    description: description,
    type: type,
    file: file,
    thum_img: thumbnail
  };
  var query =
    "INSERT INTO libraries SET topic = :topic, title = :title, description = :description, type = :type, file = :file, thum_img = :thum_img";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = "Library added successfully";
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error into library add.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = addLibrary;
