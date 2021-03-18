var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

var addMoods = (req, res) => {
  var response = {};
  let title = req.body.title ? req.body.title : "";
  let code = req.body.code ? req.body.code : "abcd";
  let image = req.body.image ? req.body.image : null;
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
    code: code,
    title: title,
    image: image,
  };
  let select_query =
    "SELECT id FROM moods WHERE code = :code AND deleted_at IS NULL";
  dbConnection
    .query(select_query, {
      replacements: { code: code },
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length > 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = "This code already exists.";
        return res.send(response);
      } else {
        var query =
          "INSERT INTO moods SET title = :title, code = :code, image = :image";
        dbConnection
          .query(query, {
            replacements: data,
            type: dbConnection.QueryTypes.INSERT,
          })
          .then((result) => {
            res.statusCode = constants.SUCCESS_STATUS_CODE;
            response.status = constants.SUCCESS_STATUS_CODE;
            response.message = "Moods added successfully";
            return res.send(response);
          })
          .catch((err) => {
            console.error("Error into Moods add.js: " + err);
            res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
            response.message = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
          });
      }
    });
};
module.exports = addMoods;
