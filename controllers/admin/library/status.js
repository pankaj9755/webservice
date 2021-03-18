const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

var changeStatus = (req, res) => {
  let response = {};
  let id = req.body.id ? req.body.id : "";
  let status = req.body.status ? req.body.status : "";
  if (!id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  if (!status) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.STATUS_VALIDATION;
    return res.send(response);
  }
  if (status != "active" && status != "inactive") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.INVALID_STATUS;
    return res.send(response);
  }
  var data = {
    id: id,
    status: status,
  };
  let select_query =
    "SELECT id FROM libraries WHERE id = :id AND deleted_at IS NULL";
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
      let update_query = "UPDATE libraries SET status = :status WHERE id = :id";
      dbConnection
        .query(update_query, {
          replacements: data,
          type: dbConnection.QueryTypes.UPDATE,
        })
        .then((update_result) => {
          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.SUCCESS_STATUS_CODE;
          response.message = "Status changes successfully.";
          return res.send(response);
        })
        .catch((err) => {
          res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
          response.message = constants.SOMETHING_WENT_WRONG;
          return res.send(response);
        });
    })
    .catch((err) => {
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = changeStatus;
