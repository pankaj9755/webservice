const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/mood");
const services = require("./../../../../services/users/customer/mood");
const logger = require("./../../../../config/winstonConfig");
const noteServices = require("./../../../../services/users/customer/note");
var moment = require("moment");

const moodController = {
  /**
   * mood list
   */
  list: async (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    try {
      const data = {
        // limit,
        //   offset,
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
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: moodController.list query failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * add mood
   */
  addMood: async (req, res) => {
    let mood_id = req.body.mood_id ? req.body.mood_id : "";
    let note = req.body.note ? req.body.note : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      mood_id,
      note,
      user_id,
    };
    // check validation error
    let validator_result = await validators.addMood(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let result = await services.addMood(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      // ad into note table
      let notedata = {
		   description: note,
		  user_id: user_id,
		  event_id: 0,
		  note_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
	  }; 
      let resultnote = await noteServices.createNote(notedata);
      
      
      response.message = constants.MOOD_ADDED_SUCCSESFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: moodController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = moodController;
