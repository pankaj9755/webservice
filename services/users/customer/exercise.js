const logger = require("./../../../config/winstonConfig");
const exerciseModel = require("../../../models/exercise");
const dbConnection = require("./../../../config/connection");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const exercise = {
  /**
   * find all library
   */
  findAll: async (data) => {
    let response = {};
     let SelectSql =
      "SELECT DISTINCT exercises.id, exercises.title, exercises.description, exercises.type, exercises.file, exercises.thum_img, exercises.created_at FROM exercises ";
      if(data.mood_id){
       SelectSql+= " JOIN exercise_moods ON exercise_moods.exercise_id = exercises.id AND exercise_moods.mood_id = '"+data.mood_id+"' ";
      }
      SelectSql+= " WHERE exercises.status = 'active' AND exercises.deleted_at IS NULL";
      
      if(data.direction){
      SelectSql+= " ORDER BY exercises.id "+data.direction+"";
      }
      
    return await dbConnection
      .query(SelectSql, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: { },
      })
      .then(function (exerciseData) {
        response.rows = exerciseData;
        return response;
      })
     .catch(async (err) => {
        logger.log("error", "DB error: exercise list query failed.", err);
        return "result_failed";
      })
  },

  /**
   * find one library
   */
  findOne: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
      id: data.id,
    };
    return await exerciseModel
      .findOne({
        where: where,
        attributes: [
          "id",
          "title",
          "description",
          "type",
          "file",
          "thum_img",
          "created_at",
        ],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: exercise query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = exercise;
