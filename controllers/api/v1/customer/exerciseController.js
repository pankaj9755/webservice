const constants = require("./../../../../config/constants");
const services = require("./../../../../services/users/customer/exercise");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");
const requestservices = require("./../../../../services/users/customer/request");

const excerciseController = {
  /**
   * exercise list
   */
  list: async (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let order = "id";
    let direction = "DESC";
    let mood_id = req.query.mood_id ?req.query.mood_id:"";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let user_id = '';
    let used_group_code = '';
    if (res.locals.userData) {
      user_id = res.locals.userData.id;
      used_group_code = res.locals.userData.used_group_code;
    };
    
    
    try {
      const data = {
        // limit,
        // offset,
        order,
        direction,
        mood_id,
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
      for (let i = 0; i < result.rows.length; i++) {
        (function (i) {
          if (result.rows[i].type == "video") {
            if (result.rows[i].file) {
              var fileName = result.rows[i].file;
              var newFile = fileName.split(".");
              // result.rows[i].thumb_video = newFile[0] + "_1" + ".jpg";
            }
          }
        })(i);
      }
      // check permission 
       response.is_permission = false;
       if(used_group_code=="" || used_group_code==null || used_group_code==undefined){
		  var haveSession = await requestservices.checkHaveRequest(user_id);
		  if (haveSession) {
			  response.is_permission = true;
		  }
	  }else{
		response.is_permission = true;
	  }
	  console.log('response.is_permission ============',response.is_permission);
      response.is_permission = true;
      // add content data to response as result
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: exerciseController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * exercise detail
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let user_id = '';
    let used_group_code = '';
    if (res.locals.userData) {
      user_id = res.locals.userData.id;
      used_group_code = res.locals.userData.used_group_code;
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
      if (result.type == "video") {
        if (result.file) {
          var fileName = result.file;
          var newFile = fileName.split(".");
          // result.thumb_video = newFile[0] + "_1" + ".jpg";
        }
      }
      delete response.message;
      response.result = result;
      // check permission 
       response.is_permission = false;
       if(used_group_code=="" || used_group_code==null || used_group_code==undefined){
		  var haveSession = await requestservices.checkHaveRequest(user_id);
		  if (haveSession) {
			  response.is_permission = true;
		  }
	  }else{
		response.is_permission = true;
	  }
      response.is_permission = true;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: exerciseController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = excerciseController;
