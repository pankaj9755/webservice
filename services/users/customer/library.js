const logger = require("./../../../config/winstonConfig");
const libraryModel = require("../../../models/library");
const libraryCommentModel = require("../../../models/library_comment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const library = {
  /**
   * find all library
   */
  findAll: async () => {
    let where = {
      status: "active",
      deleted_at: null,
    };
    return await libraryModel
      .findAll({
        where: where,
        attributes: [
          "id",
          "topic",
          "title",
          "description",
          "file",
          "thum_img",
          "type",
          "created_at",
        ],
        order: [["id", "DESC"]],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: library list query failed.", err);
        return "result_failed";
      });
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
    return await libraryModel
      .findOne({
        where: where,
        attributes: [
          "id",
          "topic",
          "title",
          "description",
          "file",
          "thum_img",
          "type",
          "created_at",
        ],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: library query failed.", err);
        return "result_failed";
      });
  },

  /**
   * add comment on library
   */
  postComment: async (data) => {
    return await libraryCommentModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:post comment query failed.", err);
        return "result_failed";
      });
  },

  groupByData: async (key, array) => {
    var result = [];
    for (var i = 0; i < array.length; i++) {
      var added = false;
      for (var j = 0; j < result.length; j++) {
        if (result[j][key] == array[i][key]) {
          result[j].items.push(array[i]);
          added = true;
          break;
        }
      }
      if (!added) {
        var entry = { items: [] };
        entry[key] = array[i][key];
        entry.items.push(array[i]);
        result.push(entry);
      }
    }
    return result;
  },
};

// export module to use on other files
module.exports = library;
