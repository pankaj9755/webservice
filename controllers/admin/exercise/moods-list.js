const constants = require("./../../../config/adminConstants");
const dbConnection = require("./../../../config/connection");

const list = (req, res) => {
  let response = {};

  let query =
    "SELECT id, title, code, image, status, created_at FROM moods WHERE deleted_at IS NULL AND status = 'active'";

  dbConnection
    .query(query, { type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      if (result.length > 0) {
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = "Moods List";
        response.result = result;
        res.send(response);
      } else {
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        response.result = result;
        res.send(response);
      }
    })
    .catch(err => {
      console.error("Error in moods-list.js: ", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      res.send(response);
    });
};
module.exports = list;
