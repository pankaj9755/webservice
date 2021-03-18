// Questions list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

list = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let offset = req.query.offset ? parseInt(req.query.offset) : 0;
  let search = req.query.search ? req.query.search : "";
  let is_live = req.query.is_live ? req.query.is_live : "";
  let response = {};
  let promises = [];
  let replacements = {
    limit: limit,
    offset: offset,
    is_live: is_live,
    search: "%" + search + "%",
  };
  let data = {};
  let replacements_cnt = {
    is_live: is_live,
    search: "%" + search + "%",
  };
  let query =
    "SELECT id, url, stream_id, is_live, created_at FROM live_video WHERE 1 ";
  let que_cnt = "SELECT COUNT(id) AS total FROM live_video WHERE 1 ";
  if (search != "") {
    query += " AND (url LIKE :search OR stream_id LIKE :search) ";
    que_cnt += " AND (url LIKE :search OR stream_id LIKE :search) ";
  }
  if (is_live != "") {
    query += " AND is_live = :is_live ";
    que_cnt += " AND is_live = :is_live ";
  }
  query += " ORDER BY id DESC LIMIT :offset, :limit";
  promises.push(
    dbConnection
      .query(query, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: replacements,
      })
      .then((result) => {
        if (result.length > 0) {
          data.records = result;
        } else {
          data.records = [];
        }
      }),
    dbConnection
      .query(que_cnt, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: replacements_cnt,
      })
      .then((result) => {
        data.count = result[0].total;
      })
  );
  Promise.all(promises)
    .then((result) => {
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      if (data.count > 0) {
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = "Live video List";
      } else {
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
      }
      response.count = data.count;
      response.result = data.records;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error in live video list.js: ", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      res.send(response);
    });
};
module.exports = list;
