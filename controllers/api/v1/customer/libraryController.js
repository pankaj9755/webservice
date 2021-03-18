const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/library");
const services = require("./../../../../services/users/customer/library");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");
const requestservices = require("./../../../../services/users/customer/request");


const libraryController = {
  /**
   * library list for app
   */
  list: async (req, res) => {
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
      let result = await services.findAll();
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (let i = 0; i < result.length; i++) {
        (function (i) {
          if (result[i].type == "video") {
            if (result[i].file) {
              var fileName = result[i].file;
              var newFile = fileName.split(".");
              // result[i].thumb_video = newFile[0] + "_1" + ".jpg";
            }
          }
        })(i);
      }
      let key = "topic";
      let reposne_result = await services.groupByData(key, result);
      console.log(reposne_result);
      delete response.message;
      
      response.is_permission = false;
      console.log('res.locals.userData',res.locals.userData);
      console.log('used_group_code=============================',used_group_code);
      if(used_group_code=="" || used_group_code==null || used_group_code==undefined){
		  var haveSession = await requestservices.checkHaveRequest(user_id);
		  if (haveSession) {
			  response.is_permission = true;
		  }
	  }else{
		response.is_permission = true;
	  }
      response.is_permission = true;
      response.result = reposne_result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: libraryController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * library list for website
   */
  libraryList: async (req, res) => {
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
      let result = await services.findAll();
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (let i = 0; i < result.length; i++) {
        (function (i) {
          if (result[i].type == "video") {
            if (result[i].file) {
              var fileName = result[i].file;
              var newFile = fileName.split(".");
              // result[i].thumb_video = newFile[0] + "_1" + ".jpg";
            }
          }
        })(i);
      }
      // add content data to response as result
      delete response.message;
      response.result = result;
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
        "try-catch: libraryController.list query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * library detail
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
        "try-catch: libraryController.detail query failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * library post comment
   */
  postComment: async (req, res) => {
    let name = req.body.name ? req.body.name : "Anonymous";
    let comment = req.body.comment ? req.body.comment : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      user_id: user_id,
      name: name,
      comment: comment,
    };
    //check validation
    let validator_data = await validators.postComment(data);
    if (!validator_data.validate) {
      res.statusCode = 422;
      response.message = validator_data.message;
      return res.json(response);
    }
    try {
      let result = await services.postComment(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      response.message = constants.COMMENT_ADDED_SUCCSESFUL;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: libraryController.post comment failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = libraryController;
