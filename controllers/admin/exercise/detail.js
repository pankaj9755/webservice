const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

var findOne = (req, res) => {
  let response = {};
  let id = req.query.id ? req.query.id : "";
  if (!id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  let query =
    "SELECT id, title, description, type, file, status, thum_img FROM exercises WHERE id = :id AND deleted_at IS NULL";
  const query1 = "SELECT exercise_moods.mood_id, moods.title AS mood_title FROM moods LEFT JOIN exercise_moods ON moods.id = exercise_moods.mood_id WHERE exercise_moods.exercise_id = :id";

  dbConnection
    .query(query, {
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

      dbConnection
        .query(query1, {
          type: dbConnection.QueryTypes.SELECT,
          replacements: { id: id }
        })
        .then(result1 => {
          let moods_id = [];
          let moods_info = [];

          result1.forEach(element => {
            moods_id.push(element.mood_id);
          });

          result1.forEach(element => {
            moods_info.push({ title: element.mood_title });
          });

          result[0].moods_id = moods_id;
          result[0].moods_info = moods_info;

          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.SUCCESS_STATUS_CODE;
          response.message = "Exercise detail";
          response.result = result[0];
          return res.send(response);
        });
    })
    .catch((err) => {
      console.error("Error in exercises.detail.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = findOne;
