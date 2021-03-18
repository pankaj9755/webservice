const logger = require("./../../../config/winstonConfig");
const dbConnection = require("./../../../config/connection");
const userNoteModel = require("../../../models/user_note");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require("moment");

const request = {
  /**
   * find all request
   */
  findAll: async (data) => {
    return await userNoteModel
      .findAll({
        where: {
          user_id: data.user_id,
        },
        order: [['id', 'DESC']],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: note list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find one
   */
  findOne: async (data) => {
    let where = {
      id: data.id,
      user_id: data.user_id,
    };
    return await userNoteModel
      .findOne({
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: find one query failed.", err);
        return "result_failed";
      });
  },

  /**
   * insert note
   */
  createNote: async (data) => {
    return await userNoteModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: insert note query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update note
   */
  updateNote: async (data) => {
    let updateData = {
      description: data.description,
      note_date: data.note_date,
      event_id: data.event_id,
    };
    return await userNoteModel
      .update(updateData, {
        where: {
          id: data.id,
          user_id: data.user_id,
        },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: note update query failed.", err);
        return "result_failed";
      });
  },

  /**
   * delete note
   */
  deleteNote: async (data) => {
    let where = {
      id: data.id,
      user_id: data.user_id,
    };
    return await userNoteModel
      .destroy({
        where: where,
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: delete note query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = request;
