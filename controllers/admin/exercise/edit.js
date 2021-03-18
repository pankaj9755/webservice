var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
const fs = require("fs");

var editExercise = (req, res) => {
  var response = {};
  let id = req.body.id ? req.body.id : "";
  let title = req.body.title ? req.body.title : "";
  let description = req.body.description ? req.body.description : "";
  let type = req.body.type ? req.body.type : "";
  let file = req.body.file ? req.body.file : "";
  let thumbnail_image = req.body.thumbnail_image ? req.body.thumbnail_image : "";
  let moods_id_array = req.body.moods_id_array ? JSON.parse(req.body.moods_id_array) : '';
  let promises = [];

  if (!id) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  if (!title) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TITLE_VALIDATION;
    return res.send(response);
  }
  if (!description) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.DESCRIPTION_VALIDATION;
    return res.send(response);
  }
  if (file) {
    if (!type) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.status = constants.VALIDATION_STATUS_CODE;
      response.message = constants.TYPE_VALIDATION;
      return res.send(response);
    }
    if (type != "image" && type != "video" && type != "audio") {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.status = constants.VALIDATION_STATUS_CODE;
      response.message = constants.INVALID_TYPE;
      return res.send(response);
    }
  }
  if (!moods_id_array) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.MOOD_ID_VALIDATION;
    return res.send(response);
  }
  
  let select_query =
    "SELECT id, file FROM exercises WHERE id = :id AND deleted_at IS NULL";
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
      var data = {
        id: id,
        title: title,
        description: description,
      };
      var query =
        "UPDATE exercises SET title = :title, description = :description";
      if (file) {
        query += ", type = :type, file = :file";
        data.type = type;
        data.file = file;
      }
      if (thumbnail_image) {
        query += ", thum_img = :thum_img";
        data.thum_img = thumbnail_image;
      }
      query += " WHERE id = :id";
      dbConnection
        .query(query, {
          replacements: data,
          type: dbConnection.QueryTypes.UPDATE,
        })
        .then((update_result) => {
          // delete previous image
          if (file && result[0].file) {
            fs.unlink(
              constants.IMAGE_UPLOAD_PATH + "exercise/" + result[0].file,
              (err) => {}
            );
          }

          const query1 = "DELETE FROM exercise_moods WHERE exercise_id = :id";
          const query2 = "INSERT INTO exercise_moods(exercise_id, mood_id) VALUES ?";

          let insert_data = [];

          moods_id_array.forEach(element => {
            insert_data.push([id, element]);
          });

          promises.push(
            dbConnection
              .query(query1, {
                type: dbConnection.QueryTypes.DELETE,
                replacements: { id: id }
              }),
            dbConnection
              .query(query2, {
                type: dbConnection.QueryTypes.INSERT,
                replacements: [insert_data]
              })
          );

          Promise.all(promises)
            .then(result => {
              res.statusCode = constants.SUCCESS_STATUS_CODE;
              response.status = constants.SUCCESS_STATUS_CODE;
              response.message = constants.EXERCISE_UPDATE_SUCCESS;
              return res.send(response);
            })
            .catch((err) => {
              console.error("Error into exercises update.js: " + err);
              res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
              response.message = constants.SOMETHING_WENT_WRONG;
              return res.send(response);
            });
        });
    })
    .catch((err) => {
      console.error("Error into exercises select.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = editExercise;
