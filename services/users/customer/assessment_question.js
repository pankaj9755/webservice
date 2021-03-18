const logger = require("./../../../config/winstonConfig");
const assessmentQuestionModel = require("../../../models/assessment_question");
const userAssessmentQuestionModel = require("../../../models/user_assessment_question");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const assessment_question = {
  /**
   * find all assessment question
   */
  getAllAssessmentQuestion: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
    };
    return await assessmentQuestionModel
      .findAll({
        where: where,
        attributes: ["id", "category", "question", "question_type", "options"],
        order: [[data.order, data.direction]],
        // limit: data.limit,
        // offset: data.offset,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: assessment question list query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * make group by data
   */
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

  /**
   * find one assessment
   */
  addAssessmentQuestion: async (data) => {
    return await userAssessmentQuestionModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: assessment question add query failed.",
          err
        );
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = assessment_question;
