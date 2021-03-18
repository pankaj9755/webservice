const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

var findAll = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let offset = req.query.offset ? parseInt(req.query.offset) : 0;
  let search = req.query.search ? req.query.search : "";
  let status = req.query.status ? req.query.status : "";
  let response = {};
  let promises = [];
  let replacements = {
    limit: limit,
    offset: offset,
    status: status,
    search: search,
  };
  let data = {};
  let replacements_cnt = { status: status, search: search };
  let query =
    "SELECT id, title, description, image, status, created_at FROM assessments WHERE deleted_at IS NULL";
  let que_cnt =
    "SELECT COUNT(id) AS total FROM assessments WHERE deleted_at IS NULL";
  if (status != "") {
    query += " AND status = :status";
    que_cnt += " AND status = :status";
  }
  if (search != "") {
    query += " AND title LIKE '%" + search + "%'";
    que_cnt += " AND title LIKE '%" + search + "%'";
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
        response.message = "Assessment List";
      } else {
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
      }
      response.count = data.count;
      response.result = data.records;
      return res.send(response);
    })
    .catch((err) => {
      console.error("Error in assessments list.js: ", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      res.send(response);
    });
};
module.exports = findAll;
