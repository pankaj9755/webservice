// Questions list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

list = (req, res) => {
  let live_video_id = req.query.live_video_id ? req.query.live_video_id : "";
  let response = {};
  if (!live_video_id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  let select_query =
    "SELECT support_chat.id, support_chat.live_video_id, support_chat.user_id, support_chat.message, support_chat.created_at, users_master.first_name, users_master.last_name, users_master.profile_image FROM support_chat JOIN users_master ON users_master.id = support_chat.user_id WHERE live_video_id = :live_video_id ORDER BY support_chat.id DESC";
  dbConnection
    .query(select_query, {
      replacements: { live_video_id: live_video_id },
      type: dbConnection.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length > 0) {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = "Support chat list";
        response.result = result;
        return res.send(response);
      } else {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        return res.send(response);
      }
    })
    .catch((err) => {
      console.error("Error in support chat list.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = list;
