const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/rating");
const services = require("./../../../../services/users/customer/rating");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");

const reviewController = {
  /**
   * add review
   */
  addRating: async (req, res) => {
    let request_id = req.body.request_id ? req.body.request_id : "";
    let rating = req.body.rating ? req.body.rating : "";
    let review = req.body.review ? req.body.review : null;
    let therapist_id = req.body.therapist_id ? req.body.therapist_id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      request_id,
      rating,
      review,
      therapist_id,
      user_id,
    };
    //check validation
    let validator_data = await validators.addReview(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let exist_result = await services.checkExistRating(data);
      if (exist_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!exist_result) {
        let insert_result = await services.addRating(data);
        if (insert_result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
      } else {
        let update_result = await services.updateRating(data);
        if (update_result === "result_failed") {
          res.statusCode = 500;
          return res.json(response);
        }
      }
      let result = await services.getAverageRating(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      let avg_rating = result.avg_rating;
      avg_rating = Number.parseFloat(avg_rating).toFixed(1);
      let user_data = {
        avg_rating: avg_rating,
        total_rating: result.total_rating,
        therapist_id: therapist_id,
      };
      let user_result = await services.updateUserRating(user_data);
      if (user_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // add content data to response as result
      response.message = constants.RATING_ADDED_SUCCESSFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: reviewController.add review failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = reviewController;
