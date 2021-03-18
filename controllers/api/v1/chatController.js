const constants = require("./../../../config/constants");
const validators = require("./../../../validators/users/chat");
const services = require("./../../../services/users/chat");
const logger = require("./../../../config/winstonConfig");
var moment = require("moment");
const request = require("request");

const chatController = {
  /**
   * chat list
   */
  list: async (req, res) => {
    let sender_id = req.query.sender_id ? req.query.sender_id : "";
    let receiver_id = req.query.receiver_id ? req.query.receiver_id : "";
    // let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    // let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      sender_id,
      receiver_id,
      // limit,
      // offset,
    };
    // check validation error
    let validator_result = await validators.list(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
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
      logger.log("error", "try-catch: chatController.list failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * support chat list
   */
  supportChatList: async (req, res) => {
    let live_video_id = req.query.live_video_id ? req.query.live_video_id : "";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let order = "id";
    let direction = "ASC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      live_video_id,
      limit,
      offset,
      order,
      direction,
    };
    // check validation error
    let validator_result = await validators.supportChatList(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      // get all contents form database query
      let result = await services.findAllSupportChat(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.rows.length <= 0) {
        response.result = [];
        response.message = "no message";
        res.statusCode = 200;
        return res.json(response);
      }
      delete response.message;

      // Set first name property as Anonymous.
      result.rows.forEach(element => {
        element.users_master.first_name = "Anonymous";
        element.users_master.last_name = "";
        element.users_master.profile_image = "";
      });
      
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: chatController.support chat list failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * live chat list
   */
  liveChatList: async (req, res) => {
    const response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    const data = {
      email: req.query.id,
    };
    var videoId =
      "Cg0KC0VFSWs3Z3dqZ0lNKicKGFVDYWtnc2IwdzdRQjBWSGRuQ2MtT1ZFQRILRUVJazdnd2pnSU0";
    getAllComments(videoId, null, 100, function (result) {
      response.message = "Live chat list.";
      response.statusCode = 200;
      res.statusCode = 200;
      response.result = result;
      return res.send(response);
    });
  },
};

// callback function
var getAllComments = function (
  videoId,
  pageToken = null,
  maxResults,
  callBack
) {
  var request = require("request");
  // var test_url =
  //   "https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=Cg0KC0VFSWs3Z3dqZ0lNKicKGFVDYWtnc2IwdzdRQjBWSGRuQ2MtT1ZFQRILRUVJazdnd2pnSU0&part=snippet,authorDetails&key=AIzaSyCaIluu8XKGLQEz_ZuljqAksXTZXGg0ZlU";
  var part = "snippet,authorDetails";
  var key = "AIzaSyCaIluu8XKGLQEz_ZuljqAksXTZXGg0ZlU";
  var test_url =
    "https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=" +
    videoId +
    "&part=" +
    part +
    "&key=" +
    key;
  request(test_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      callBack(body);
    } else {
      callBack(error);
    }
  });
};

module.exports = chatController;
