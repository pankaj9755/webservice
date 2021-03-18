var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");

var addExercise = (req, res) => {
  var response = {};
  let title = req.body.title ? req.body.title : "";
  let description = req.body.description ? req.body.description : "";
  let type = req.body.type ? req.body.type : "";
  let file = req.body.file ? req.body.file : "";
  let thumbnail_image = req.body.thumbnail_image ? req.body.thumbnail_image : "";
  let moods_id_array = req.body.moods_id_array ? JSON.parse(req.body.moods_id_array) : '';

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
  if (!file) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.FILE_VALIDATION;
    return res.send(response);
  }
  if (!moods_id_array) {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.MOOD_ID_VALIDATION;
    return res.send(response);
  }

  const data = {
    title: title,
    description: description,
    type: type,
    file: file,
    thum_img: thumbnail_image
  };

  const query1 =
    "INSERT INTO exercises SET title = :title, description = :description, type = :type, file = :file, thum_img = :thum_img";

  const query2 = "INSERT INTO exercise_moods(exercise_id, mood_id) VALUES ?";

  dbConnection
    .query(query1, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then((result) => {
      const exercise_id = result[0];
      let insert_data = [];

      moods_id_array.forEach(element => {
        insert_data.push([exercise_id, element]);
      });

      dbConnection
        .query(query2, { type: dbConnection.QueryTypes.INSERT, replacements: [insert_data] })
        .then(result => {
          res.statusCode = constants.SUCCESS_STATUS_CODE;
          response.status = constants.SUCCESS_STATUS_CODE;
          response.message = "Exercise added successfully";
          return res.send(response);
        })
        .catch((err) => {
          console.error("Error into exercises add.js: " + err);
          res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
          response.message = constants.SOMETHING_WENT_WRONG;
          return res.send(response);
        });
    });
};
module.exports = addExercise;
