const constants = require("./../../../config/adminConstants");
const dbConnection = require("./../../../config/connection");

EditPermission = (req, res) => {
  let response = {};
  let id = req.body.id ? req.body.id : "";
  let permission = req.body.permission ? req.body.permission : "";
  if (id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.GROUP_CODE_ID;
    return res.send(response);
  } else if (permission == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = "Permission is required";
    return res.send(response);
  } else {
    let select_query =
      "SELECT id FROM group_code WHERE id = :id AND deleted_at IS NULL";
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
        var query =
          "UPDATE group_code SET permission = :permission WHERE id = :id";
        dbConnection
          .query(query, {
            replacements: { permission: permission, id: id },
            type: dbConnection.QueryTypes.UPDATE,
          })
          .then((result) => {
            res.statusCode = constants.SUCCESS_STATUS_CODE;
            response.status = constants.SUCCESS_STATUS_CODE;
            response.message = "Permission updated successfully";
            return res.send(response);
          })
          .catch((err) => {
            console.error("Error into Permission update.js: " + err);
            res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
            response.message = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
          });
      });
  }
};
module.exports = EditPermission;
