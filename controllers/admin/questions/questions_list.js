// Questions list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

QuestionsList = (req, res) => {
  var response = {};
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var status = req.query.status ? req.query.status : "";
  var therapy_type = req.query.therapy_type ? req.query.therapy_type : "";
  var search_value = req.query.value ? req.query.value : "";

  var replacements = {
    limit: limit,
    offset: offset,
    status: status,
    therapy_type: therapy_type,
    search_value: search_value,
  };
  var replacements_cnt = {
    status: status,
    therapy_type: therapy_type,
    search_value: search_value,
  };

  var query =
    "SELECT id, question, therapy_type, status, created_at FROM questions WHERE deleted_at IS NULL";
  var que_cnt =
    "SELECT COUNT(*) AS total FROM questions WHERE deleted_at IS NULL";

  if (status != "") {
    query += " AND status = :status";
    que_cnt += " AND status = :status";
  }

  if (therapy_type != "") {
    query += " AND therapy_type = :therapy_type";
    que_cnt += " AND therapy_type = :therapy_type";
  }

  if (search_value != "") {
    query += " AND question LIKE '%" + search_value + "%'";
    que_cnt += " AND question LIKE '%" + search_value + "%'";
  }

  query += " ORDER BY id DESC LIMIT :offset, :limit";

  dbConnection
    .query(query, {
      type: dbConnection.QueryTypes.SELECT,
      replacements: replacements,
    }) /*  */
    .then((result) => {
      if (result.length > 0) {
        dbConnection
          .query(que_cnt, {
            type: dbConnection.QueryTypes.SELECT,
            replacements: replacements_cnt,
          })
          .then((result_cnt) => {
            var data = [];
            result.forEach(function (element) {
              var therapy_type = "";
              switch (element.therapy_type) {
                case "student":
                  therapy_type = "Student";
                  break;
                case "medical_aid":
                  therapy_type = "Medical Aid";
                  break;
                case "employee":
                  therapy_type = "Employee";
                  break;
                case "general_public":
                  therapy_type = "General Public";
                  break;
              }
              data.push({
                id: element.id,
                question: element.question,
                therapy_type: therapy_type,
                status: element.status,
                created_at: element.created_at,
              });
            });
            res.statusCode = constants.SUCCESS_STATUS_CODE;
            response.count = result_cnt[0].total;
            response.status = constants.SUCCESS_STATUS_CODE;
            response.message = "Questions List";
            response.result = data;
            res.send(response);
          });
      } else {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        res.send(response);
      }
    })
    .catch((err) => {
      console.error("Error in questions_list.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      res.send(response);
    });
};
module.exports = QuestionsList;
