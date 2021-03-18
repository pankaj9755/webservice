const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

var deleteExercise = (req, res) => {
  let response = {};
  let id = req.body.id ? req.body.id : "";
  if (!id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  let select_query =
    "SELECT id FROM exercises WHERE id = :id AND deleted_at IS NULL";
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
      let data = {
        id: id,
        deleted_at: new Date(),
      };
      let soft_delete_query =
        "UPDATE exercises SET deleted_at = :deleted_at WHERE id = :id";
      dbConnection
        .query(soft_delete_query, {
          replacements: data,
          type: dbConnection.QueryTypes.UPDATE,
        })
        .then((result) => {
          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.SUCCESS_STATUS_CODE;
          response.message = "Exercise deleted successfully.";
          return res.send(response);
        })
        .catch((err) => {
          console.error("Error in exercises.delete.js: " + err);
          res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
          response.message = constants.SOMETHING_WENT_WRONG;
          return res.send(response);
        });
    })
    .catch((err) => {
      console.error("Error in exercises.select.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = deleteExercise;
