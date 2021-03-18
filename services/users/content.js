const logger = require("./../../config/winstonConfig");
const contentModel = require("./../../models/page");

const content = {
  /**
   * find one
   */
  findOne: async (data) => {
    return await contentModel
      .findOne({
        attributes: ["id", "title", "content"],
        where: {
          type: data.type,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:find content query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = content;
