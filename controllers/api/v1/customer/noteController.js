const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/note");
const services = require("./../../../../services/users/customer/note");
const logger = require("./../../../../config/winstonConfig");
require("dotenv").config();
var moment = require("moment");

const noteController = {
  /**
   * note list
   */
  list: async (req, res) => {
    let user_id = res.locals.userData.id;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      const data = {
        user_id,
        order,
        direction,
      };
      // get all contents form database query
      let result = await services.findAll(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: nodeController.list query failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * note list
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    //check validation
    let validator_data = await validators.idValidation(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
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
        "try-catch: nodeController.find one query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * create note
   */
  create: async (req, res) => {
    let description = req.body.description ? req.body.description : "";
    let note_date = req.body.note_date ? req.body.note_date : "";
    let event_id = req.body.event_id ? req.body.event_id : null;
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      description: description,
      user_id: user_id,
      event_id: event_id,
      note_date: note_date,
    };
    // check validation error
    let validator_result = await validators.createNote(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // add note
      let result = await services.createNote(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.statusCode = 200;
      response.result = result;
      response.message = constants.NOTE_CREATED_SUCESSFULL;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: noteController.create failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * update note
   */
  update: async (req, res) => {
    let id = req.body.id ? req.body.id : "";
    let description = req.body.description ? req.body.description : "";
    let event_id = req.body.event_id ? req.body.event_id : "";
    let note_date = req.body.note_date ? req.body.note_date : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id: id,
      description: description,
      note_date: note_date,
      event_id: event_id,
      user_id: user_id,
    };
    // check validation error
    let validator_result = await validators.updateNote(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let exitResult = await services.findOne(data);
      if (exitResult === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (!exitResult) {
        res.statusCode = 400;
        response.message = constants.RECORD_NOT_FOUND;
        return res.json(response);
      }
      let updateResult = await services.updateNote(data);
      if (updateResult === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // send response
      response.statusCode = 200;
      res.statusCode = 200;
      response.message = constants.NOTE_UPDATED_SUCESSFULL;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: noteController.update booking failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * delete note
   */
  delete: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      user_id,
    };
    //check validation
    let validator_data = await validators.idValidation(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
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
      let delete_result = await services.deleteNote(data);
      if (delete_result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.NOTE_DELETED_SUCESSFULL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: noteController.delete request query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};

// export module to use it on other files
module.exports = noteController;
