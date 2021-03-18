// Questions list.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

List = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let offset = req.query.offset ? parseInt(req.query.offset) : 0;
  let therapy_type = req.query.therapy_type ? req.query.therapy_type : "";
  let search = req.query.search ? req.query.search : "";
  let status = req.query.status ? req.query.status : "";
  let group_code_id = req.query.group_code_id ? req.query.group_code_id : "";
  let response = {};
  let select_replacements = {
    limit: limit,
    offset: offset,
    status: status,
    therapy_type: therapy_type,
    group_code_id: group_code_id,
    search: "%" + search + "%",
  };
  let count_replacements = {
    status: status,
    therapy_type: therapy_type,
    group_code_id: group_code_id,
    search: "%" + search + "%",
  };
  let select_query =
    "SELECT id, group_code_id, question, therapy_type, status, created_at FROM survey_questions WHERE deleted_at IS NULL";
  let count_query =
    "SELECT COUNT(*) AS total FROM survey_questions WHERE deleted_at IS NULL";
  if (status != "") {
    select_query += " AND status = :status";
    count_query += " AND status = :status";
  }
  if (therapy_type != "") {
    select_query += " AND therapy_type = :therapy_type";
    count_query += " AND therapy_type = :therapy_type";
  }
  if (search != "") {
    select_query += " AND question LIKE :search ";
    count_query += " AND question LIKE :search ";
  }
  select_query += " ORDER BY id DESC LIMIT :offset, :limit";
  dbConnection
    .query(select_query, {
      type: dbConnection.QueryTypes.SELECT,
      replacements: select_replacements,
    })
    .then((result) => {
      if (result.length > 0) {
        dbConnection
          .query(count_query, {
            type: dbConnection.QueryTypes.SELECT,
            replacements: count_replacements,
          })
          .then((count_result) => {
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
            response.count = count_result[0].total;
            response.status = constants.SUCCESS_STATUS_CODE;
            response.message = "Survey Questions List";
            response.result = data;
            return res.send(response);
          });
      } else {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        return res.send(response);
      }
    })
    .catch((err) => {
      console.error("Error in Survey questions_list.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = List;
