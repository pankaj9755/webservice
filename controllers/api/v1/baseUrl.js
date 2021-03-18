/**
 * base url API
 */
const constants = require("./../../../config/constants");
const validators = require("./../../../validators/users/base_url");
const baseUrlController = {
  base_url: async (req, res) => {
    let app_version = req.query.app_version ? req.query.app_version : "";
    let device_type = req.query.device_type ? req.query.device_type : "";
    let response = {};
    let current_app_version_iphone = "1.0.5";
    let current_app_version_android = "1.1.1";
    var data = {
      app_version,
      device_type,
    };
    var checkValidator = await validators.baseUrl(data);
    if (!checkValidator.validate) {
      res.statusCode = 422;
      response.message = checkValidator.message;
      return res.json(response);
    }
    
    response.base_url = constants.BASE_URL;
    response.chat_url = constants.CHAT_URL;
    response.app_version = current_app_version_iphone;
    response.image_urls = {
      customer: constants.BASEURL + "public/uploads/user/customer/",
      therapist: constants.BASEURL + "public/uploads/user/therapist/",
      id_proof: constants.BASEURL + "public/uploads/user/id_proof/",
      library: constants.BASEURL + "public/uploads/library/",
      assessment: constants.BASEURL + "public/uploads/assessments/",
      exercise: constants.BASEURL + "public/uploads/exercise/",
       exercise_thumbnail:
        constants.BASEURL + "public/uploads/exercise/thumbnail/",
      library_thumbnail:
        constants.BASEURL + "public/uploads/library/thumbnail/",
      emoji: constants.BASEURL + "public/uploads/emoji/",
    };
    
		response.is_update = "no";
        response.update_message = "";
        let app_update_message =
          "We have noticed that you are using an older version of our app. We recommend you upgrade to the latest version.";
        
        if (device_type == "android") {
          response.app_version = current_app_version_android;
        }
        if (app_version != current_app_version_iphone && device_type == "iOS") {
          response.is_update = "FORCEFULLY"; //NO/OPTIONAL/FORCEFULLY
          response.update_message = app_update_message;
        }
        console.log('app_version',app_version);
        if (app_version != current_app_version_android && device_type == "android") {
          //response.is_update = "FORCEFULLY"; //NO/OPTIONAL/FORCEFULLY
          response.update_message = app_update_message;
        }
        
        
    res.statusCode = 200;
    return res.json(response);
  },
};
module.exports = baseUrlController;
