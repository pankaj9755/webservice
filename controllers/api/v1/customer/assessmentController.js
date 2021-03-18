const constants = require("./../../../../config/constants");
const services = require("./../../../../services/users/customer/assessment");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");

const assessmentController = {
  /**
   * assessment list
   */
  list: async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      const data = {
        limit,
        offset,
        order,
        direction,
      };
      // get all contents form database query
      let result = await services.findAll(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.rows.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: assessmentController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * assessment detail
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      const data = {
        id,
      };
      // get all contents form database query
      let result = await services.findOne(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!result) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: assessmentController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = assessmentController;
