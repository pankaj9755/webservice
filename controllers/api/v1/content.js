const constants = require("./../../../config/constants");
const validators = require("./../../../validators/users/content");
const services = require("./../../../services/users/content");
const logger = require("./../../../config/winstonConfig");

content = async (req, res) => {
  let type = req.params.type ? req.params.type : "";
  const response = {
    message: constants.SOMETHING_WENT_WRONG,
  };
  let data = {
    type,
  };
  // check validation error
  let validator_result = await validators.getContent(data);
  if (!validator_result.validate) {
    res.statusCode = 422;
    response.message = validator_result.message;
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
    delete response.message;
    response.result = result;
    res.statusCode = 200;
    return res.json(response);
  } catch (err) {
    logger.log("error", "try-catch: content type.detail failed.", err);
    res.statusCode = 500;
    return res.json(response);
  }
};
module.exports = content;
