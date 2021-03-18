const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

var topicList = (req, res) => {
  let response = {};
  let response_result = [];
  let query =
    "SELECT topic FROM libraries WHERE deleted_at IS NULL GROUP BY topic";
  dbConnection
    .query(query, {
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length <= 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        return res.send(response);
      }
      for (let i = 0; i < result.length; i++) {
        (function () {
          response_result.push(result[i].topic);
        })(i);
      }
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.status = constants.SUCCESS_STATUS_CODE;
      response.message = "topic list";
      response.result = response_result;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error in topic.list.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = topicList;
