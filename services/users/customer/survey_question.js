const logger = require("./../../../config/winstonConfig");
const surveyQuestionModel = require("../../../models/survey_question");
const requestModel = require("../../../models/request");
const groupCodeModel = require("../../../models/group_code");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const survey_question = {
  /**
   * find all survey question
   */
  findAll: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
      group_code_id: null,
    };
    console.log('data.group_code_id=====================',data.group_code_id);
    if (data.group_code_id) {
      where.group_code_id = data.group_code_id;
    }
    return await surveyQuestionModel
      .findAndCountAll({
        where: where,
        attributes: [
          "id",
          "group_code_id",
          "question",
          "therapy_type",
          "question_type",
          "options",
        ],
        order: [[data.order, data.direction]],
        limit: data.limit,
        offset: data.offset,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: assessment list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find one survey question
   */
  findOne: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
      id: data.id,
      group_code_id: null,
    };
    if (data.group_code_id) {
      where.group_code_id = data.group_code_id;
    }
    return await surveyQuestionModel
      .findOne({
        where: where,
        attributes: [
          "id",
          "group_code_id",
          "question",
          "therapy_type",
          "question_type",
          "options",
        ],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: assessment query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check group code id
   */
  getGroupCodeId: async (group_code) => {
    return await groupCodeModel
      .findOne({
        where: {
          code: group_code,
        },
        attributes: ["id"],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: get group code query failed.", err);
        return "result_failed";
      });
  },

  /**
   * add survey question
   */
  addSurveyQuestion: async (data) => {
    let updateData = {
      survey_question: data.question_answer,
    };

    return await requestModel
      .update(updateData, {
        where: {
          id: data.request_id,
          therapist_id: data.user_id,
        },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: survey question update query failed.",
          err
        );
        return "result_failed";
      });
  },
  /**
   * Therapist survey question
   */
  therapistSuerveuQuestion: async (data) => {
    let where = {
      status: "active",
      deleted_at: null,
      group_code_id: null,
    };
  
    if (data.group_code_id) {
	  where.group_code_id = data.group_code_id;
    }
    return await surveyQuestionModel
      .findAndCountAll({
        where: where,
        attributes: [
          "id",
          "group_code_id",
          "question",
          "therapy_type",
          "question_type",
          "options",
        ],
        order: [[data.order, data.direction]],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: assessment list query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = survey_question;
