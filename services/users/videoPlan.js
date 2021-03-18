const logger = require("./../../config/winstonConfig");
const userVideoPlanModel = require("./../../models/user_video_plan");
const userMasterModel = require("./../../models/users_master");
//const requestModel = require("./../../models/request");
const videoPlanModel = require("./../../models/video_plan");
const liveVideoSettingModel = require("./../../models/live_video_setting");
const dbConnection = require("./../../config/connection");

const videoPlan = {
  /**
   * get all plan
   */
  getAllPlan: async () => {
    return await videoPlanModel
      .findAll({
        attributes: [
          "id",
          "title",
          "price",
          "description",
          "number_of_minutes",
        ],
        where: {
          status: "active",
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:check plan query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check exist plan
   */
  checkExistPlan: async (data) => {
    return await userVideoPlanModel
      .findOne({
        attributes: ["id", "used_seconds", "seconds"],
        where: {
          user_id: data.user_id,
          id: data.plan_id,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:check plan query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update plan
   */
  updatePlan: async (data) => {
    return await userVideoPlanModel
      .update(
        { used_seconds: data.used_seconds },
        {
          where: {
            user_id: data.user_id,
            id: data.plan_id,
          },
        }
      )
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:update plan query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find one request
   */
  findOneRequest: async (data) => {
    let requestsSql =
      "SELECT requests.id AS requests_id,uc.id AS customer_id,uc.first_name AS customer_first_name,ut.id AS therapist_id,ut.first_name AS therapist_first_name,requests.therapy_type,requests.apointment_date_time,requests.request_number  FROM requests LEFT JOIN users_master AS uc ON uc.id=requests.customer_id LEFT JOIN users_master AS ut ON ut.id=requests.therapist_id WHERE requests.id=:id";
    return await dbConnection
      .query(requestsSql, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: {
          id: data.request_id,
        },
      })
      .then(function (requestsData) {
        return requestsData[0];
      })
      .catch(async (err) => {
        logger.log("error", "DB error:find one request query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update lat long
   */
  updateLatLong: async (data) => {
    let updateData = {
      lattitude: data.lattitude,
      longitude: data.longitude,
    };
    return await userMasterModel
      .update(updateData, {
        where: {
          id: data.user_id,
        },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:update lat long query failed.", err);
        return "result_failed";
      });
  },

  /**
   * live video setting info
   */
  getLiveVideoSettingData: async (data) => {
    let Sql = "SELECT lVS.is_live,lVS.stream_id,LV.url,LV.id FROM live_video_setting AS lVS LEFT JOIN live_video AS LV ON LV.stream_id=lVS.stream_id";
    return await dbConnection
      .query(Sql, {
        type: dbConnection.QueryTypes.SELECT,
        
      })
      .then(function (result) {
        
        result = result[0];
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:live video setting info failed.", err);
        return "result_failed";
      });
  },

  /**
   * check plan
   */
  checkPlan: async (data) => {
    let selectSql =
      "SELECT seconds, used_seconds, user_video_plan.id, requests.id AS request_id FROM requests JOIN user_video_plan ON user_video_plan.invoice_id =  requests.request_number AND user_video_plan.status = 'active' WHERE requests.id = :id AND (requests.therapist_id = :user_id OR requests.customer_id = :user_id)";
    return await dbConnection
      .query(selectSql, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: {
          user_id: data.user_id,
          id: data.id,
        },
      })
      .then(function (planInfo) {
        return planInfo[0];
      });
  },
};

// export module to use on other files
module.exports = videoPlan;
