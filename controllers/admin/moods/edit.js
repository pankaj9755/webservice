var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

var editMoods = (req, res) => {
  var response = {};
  let id = req.body.id ? req.body.id : "";
  let title = req.body.title ? req.body.title : "";
  let code = req.body.code ? req.body.code : "abcd";
  let image = req.body.image ? req.body.image : null;
  if (!id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  if (!code) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.CODE_VALIDATION;
    return res.send(response);
  }
  if (!title) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TITLE_VALIDATION;
    return res.send(response);
  }
  var data = {
    id: id,
    code: code,
    title: title,
  };
  let select_query =
    "SELECT id FROM moods WHERE code = :code AND id != :id AND deleted_at IS NULL";
  dbConnection
    .query(select_query, {
      replacements: data,
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length > 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = "This code already exists.";
        return res.send(response);
      } else {
        var query = "UPDATE moods SET title = :title, code = :code ";
        if (image) {
          query += " ,image = :image";
          data.image = image;
        }
        query += " WHERE id = :id";
        dbConnection
          .query(query, {
            replacements: data,
            type: dbConnection.QueryTypes.UPDATE,
          })
          .then((result) => {
            res.statusCode = constants.SUCCESS_STATUS_CODE;
            response.status = constants.SUCCESS_STATUS_CODE;
            response.message = "Moods updated successfully";
            return res.send(response);
          })
          .catch((err) => {
            console.error("Error into Moods update.js: " + err);
            res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
            response.message = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
          });
      }
    });
};
module.exports = editMoods;
