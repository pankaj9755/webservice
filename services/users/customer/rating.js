const logger = require("./../../../config/winstonConfig");
const userMasterModel = require("../../../models/users_master");
const therapistScheduleModel = require("../../../models/therapist_schedule");
const requestModel = require("../../../models/request");
const questionModel = require("../../../models/question");
const ratingModel = require("../../../models/rating");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const review = {
  /**
   * find one review
   */
  checkExistRating: async (data) => {
    let where = {
      customer_id: data.user_id,
      job_id: data.request_id,
    };
    return await ratingModel
      .findOne({
        attributes: ["id", "job_id"],
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:exist rating find query failed.", err);
        return "result_failed";
      });
  },

  /**
   * add review
   */
  addRating: async (data) => {
    let insertData = {
      rating: data.rating,
      review: data.review,
      job_id: data.request_id,
      customer_id: data.user_id,
      therapist_id: data.therapist_id,
    };
    return await ratingModel
      .create(insertData)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: add review query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update rating
   */
  updateRating: async (data) => {
    let updateData = {
      rating: data.rating,
      review: data.review,
    };
    return await ratingModel
      .update(updateData, {
        where: {
          job_id: data.request_id,
          customer_id: data.user_id,
        },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: update review query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get average review rating
   */
  getAverageRating: async (data) => {
    let where = {
      therapist_id: data.therapist_id,
    };
    return await ratingModel
      .findOne({
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("rating")), "avg_rating"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total_rating"],
        ],
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:exist rating find query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update user rating
   */
  updateUserRating: async (data) => {
    let updateData = {
      avg_rating: data.avg_rating,
      total_rating: data.total_rating,
    };
    return await userMasterModel
      .update(updateData, {
        where: {
          id: data.therapist_id,
        },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: update user rating query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = review;
