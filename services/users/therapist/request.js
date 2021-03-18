const logger = require("./../../../config/winstonConfig");
const dbConnection = require("./../../../config/connection");
const userMasterModel = require("../../../models/users_master");
const userVideoPlanModel = require("../../../models/user_video_plan");
const requestModel = require("../../../models/request");
var UtilityHelper = require("./../../../libraries/UtilityHelper")();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require("moment");

const request = {
  /**
   * find all request
   */
  findAll: async (data) => {
    requestModel.belongsTo(userMasterModel, {
      foreignKey: "customer_id",
    });
    let response = {};
    let promise = [];
    let pending_where = {
      therapist_id: data.user_id,
      deleted_at: null,
      status: "pending",
    };
    let confirmed_where = {
      therapist_id: data.user_id,
      deleted_at: null,
      status: "wip",
    };
    let completed_where = {
      therapist_id: data.user_id,
      deleted_at: null,
      status: "completed",
      request_therapist_delete: "no",
    };
    let cancelled_where = {
      therapist_id: data.user_id,
      deleted_at: null,
      status: "cancel",
      request_therapist_delete: "no",
    };
    promise.push(
      // pending request
      requestModel
        .findAll({
          where: pending_where,
          attributes: [
            "id",
            "request_number",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: ["first_name","last_name", "profile_image", "mobile_number"],
            },
          ],
          order: [[data.order, data.direction]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                if (
                  result[i].users_master &&
                  result[i].users_master.mobile_number
                ) {
                  result[
                    i
                  ].users_master.mobile_number = UtilityHelper.decrypted(
                    result[i].users_master.mobile_number
                  );
                }
               // result[i].apointment_date_time = moment(result[i].apointment_date_time,).utcOffset(120).format("YYYY-MM-DDTHH:mm:00.000[Z]");
              })(i);
            }
          }
          response.pending = result;
        }),
      // confirmed request
      requestModel
        .findAll({
          where: confirmed_where,
          attributes: [
            "id",
            "request_number",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: ["first_name", "last_name","profile_image", "mobile_number"],
            },
          ],
          order: [[data.order, data.direction]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                if (
                  result[i].users_master &&
                  result[i].users_master.mobile_number
                ) {
                  result[
                    i
                  ].users_master.mobile_number = UtilityHelper.decrypted(
                    result[i].users_master.mobile_number
                  );
                }
              })(i);
            }
          }
          response.confirmed = result;
        }),
      //completed request
      requestModel
        .findAll({
          where: completed_where,
          attributes: [
            "id",
            "request_number",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: ["first_name", "last_name","profile_image", "mobile_number"],
            },
          ],
          order: [[data.order, data.direction]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                if (
                  result[i].users_master &&
                  result[i].users_master.mobile_number
                ) {
                  result[
                    i
                  ].users_master.mobile_number = UtilityHelper.decrypted(
                    result[i].users_master.mobile_number
                  );
                }
              })(i);
            }
          }
          response.completed = result;
        }),
      //cancelled request
      requestModel
        .findAll({
          where: cancelled_where,
          attributes: [
            "id",
            "request_number",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: ["first_name", "last_name","profile_image", "mobile_number"],
            },
          ],
          order: [[data.order, data.direction]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                if (
                  result[i].users_master &&
                  result[i].users_master.mobile_number
                ) {
                  result[
                    i
                  ].users_master.mobile_number = UtilityHelper.decrypted(
                    result[i].users_master.mobile_number
                  );
                }
              })(i);
            }
          }
          response.cancelled = result;
        })
    );

    return Promise.all(promise)
      .then(async function (final_result) {
        //console.log(response);
        return response;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: verification check query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find one request
   */
  findOne: async (data) => {
    requestModel.belongsTo(userMasterModel, {
      foreignKey: "customer_id",
    });
    let id = "";
    if (data.request_id) {
      id = data.request_id;
    } else {
      id = data.id;
    }
    let where = {
      [Op.or]: [
        {
          id: {
            [Op.eq]: data.id,
          },
        },
        {
          request_number: {
            [Op.eq]: data.id,
          },
        },
      ],
      therapist_id: data.user_id,
      deleted_at: null,
    };
    if (data.request_type) {
      where.status = data.request_type;
    }
    return await requestModel
      .findOne({
        attributes: [
          "id",
          "request_number",
          "status",
          "apointment_date_time",
          "price",
          "question_answer",
          "payment_status",
          "customer_id",
          "therapist_id",
          "created_by",
          "therapy_type",
          "promo_code",
          "discount_promo_code",
          "referral_code",
          "referral_code_amount",
          "score",
          "survey_question"
        ],
        where: where,
        include: [
          {
            attributes: [
              "id",
              "first_name",
              "last_name",
              "country_code",
              "mobile_number",
              "email",
              "about_me",
              "user_type",
              "profile_image",
              "lattitude",
              "longitude",
              "kin_name",
              "kin_number",
              "device_type",
              "notification_key",
              
            ],
            model: userMasterModel,
          },
        ],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: therapist detail query failed.", err);
        return "result_failed";
      });
  },

  /**
   * find one therapist
   */
  findMonthRequest: async (data) => {
    let where = {};
    where = {
      [Op.and]: [
        Sequelize.literal(
          "MONTH(apointment_date_time) = '" +
            data.month +
            "' AND YEAR(apointment_date_time) = '" +
            data.year +
            "' "
        ),
      ],
    };
    where.therapist_id = data.user_id;
    where.request_therapist_delete = "no";
    where.deleted_at = null;
    where.status = {
      [Op.ne]: "draft",
    };
    return await requestModel
      .findAll({
        // attributes: [
        //   "id",
        //   "request_number",
        //   "therapy_type",
        //   "status",
        //   "apointment_date_time",
        //   "price",
        //   "discount_promo_code",
        // ],
        where: where,
        include: [
          {
            attributes: [
              "id",
              "first_name",
              "mobile_number",
              "about_me",
              "user_type",
              "profile_image",
            ],
            model: userMasterModel,
          },
        ],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: therapist list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check exist id
   */
  checkExistId: async (data) => {
    let where = {
      id: data.id,
      therapist_id: data.user_id,
    };
    return await requestModel
      .findOne({
        attributes: ["id"],
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: rewust check exist id query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * delete request
   */
  deleteRequest: async (data) => {
    let where = {
      id: data.id,
      therapist_id: data.user_id,
    };
    return await requestModel
      .update(
        { request_therapist_delete: "yes" },
        {
          where: where,
        }
      )
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: delete request query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get request info
   */
  getRequestInfo: async (request_number) => {
    let SelectSql =
      "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email AS therapist_email From requests LEFT JOIN users_master AS customer  ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist  ON requests.therapist_id = therapist.id WHERE requests.request_number = :order_number";
    return await dbConnection
      .query(SelectSql, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: { order_number: request_number },
      })
      .then(function (requestsData) {
        return requestsData;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check promo check query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check exist record
   */
  checkExistRecord: async (data) => {
    let where = {
      id: data.id,
      therapist_id: data.user_id,
      deleted_at: null,
    };
    return await requestModel
      .findOne({
        // attributes: ["id"],
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:find duplicate data query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get request data during edit
   */
  findOneRequest: async (data) => {
    let SelectSql =
      "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email AS therapist_email From requests LEFT JOIN users_master AS customer  ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist  ON requests.therapist_id = therapist.id WHERE requests.id = :id";
    return await dbConnection
      .query(SelectSql, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: { id: data.id },
      })
      .then(function (result) {
        return result[0];
      })
      .catch(async (err) => {
        logger.log("error", "DB error: check promo check query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update request
   */
  updateStatus: async (data) => {
    let updatedData = {
      status: data.status,
      update_at: moment().format("YYYY-MM-DD HH:mm:00"),
    };
    let where = {
      id: data.id,
      therapist_id: data.user_id,
    };
    return await requestModel
      .update(updatedData, {
        where: where,
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: request update query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get user video plan
   */
  getUserVideoPlan: async (data) => {
    return await userVideoPlanModel
      .findOne({
        attributes: [
          "id",
          "invoice_id",
          "user_id",
          "plan_id",
          "amount",
          "seconds",
          "used_seconds",
          "payment_status",
          "status",
        ],
        where: {
          invoice_id: data.request_number,
          status: "active",
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: therapist list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get therapist info
   */
  getTherapistInfo: async (user_id) => {
    return await userMasterModel
      .findOne({
        attributes: [
          "id",
          "first_name",
          "last_name",
          "country_code",
          "mobile_number",
          "email",
          "profile_image",
        ],
        where: {
          id: user_id,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: therapist detail query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = request;
