const logger = require("./../../../config/winstonConfig");
const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const userMasterModel = require("../../../models/users_master");
const promoCodeModel = require("../../../models/promocode");
const groupCodeModel = require("../../../models/group_code");
const requestModel = require("../../../models/request");
const userVideoPlanModel = require("../../../models/user_video_plan");
const ratingModel = require("../../../models/rating");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require("moment");

const request = {
  /**
   * find all request
   */
  findAll: async (data) => {
    requestModel.belongsTo(userMasterModel, {
      foreignKey: "therapist_id",
    });
    let response = {};
    let promise = [];
    let pending_where = {
      customer_id: data.user_id,
      deleted_at: null,
      status: "pending",
    };
    let confirmed_where = {
      customer_id: data.user_id,
      deleted_at: null,
      status: "wip",
    };
    let completed_where = {
      customer_id: data.user_id,
      deleted_at: null,
      status: "completed",
      request_delete: "no",
    };
    let cancelled_where = {
      customer_id: data.user_id,
      deleted_at: null,
      status: "cancel",
      request_delete: "no",
    };
    promise.push(
      // pending request
      requestModel
        .findAll({
          where: pending_where,
          attributes: [
            "id",
            "request_number",
            "category",
            "therapy_type",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: [
                "first_name",
                "last_name",
                "unic_id",
                "about_me",
                "profile_image",
                "mobile_number",
                "avg_rating",
                "total_rating",
              ],
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
                if (result[i].therapy_type == "social_worker") {
                  result[i].therapy_type = constants.SOCIAL_WORKER_TYPE;
                } else if (result[i].therapy_type == "registered_councillor") {
                  result[i].therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
                } else if (
                  result[i].therapy_type == "counselling_psychologist"
                ) {
                  result[i].therapy_type =
                    constants.COUNSELLING_PSYCHOLOGIST_TYPE;
                } else if (result[i].therapy_type == "clinical_psychologist") {
                  result[i].therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
                } else {
                  result[i].therapy_type = constants.DEFAULT_TYPE;
                }
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
            "category",
            "therapy_type",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: [
                "first_name",
                "last_name",
                "unic_id",
                "about_me",
                "profile_image",
                "mobile_number",
                "avg_rating",
                "total_rating",
              ],
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
                if (result[i].therapy_type == "social_worker") {
                  result[i].therapy_type = constants.SOCIAL_WORKER_TYPE;
                } else if (result[i].therapy_type == "registered_councillor") {
                  result[i].therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
                } else if (
                  result[i].therapy_type == "counselling_psychologist"
                ) {
                  result[i].therapy_type =
                    constants.COUNSELLING_PSYCHOLOGIST_TYPE;
                } else if (result[i].therapy_type == "clinical_psychologist") {
                  result[i].therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
                } else {
                  result[i].therapy_type = constants.DEFAULT_TYPE;
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
            "category",
            "therapy_type",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: [
                "first_name",
                "last_name",
                "unic_id",
                "about_me",
                "profile_image",
                "mobile_number",
                "avg_rating",
                "total_rating",
              ],
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
                if (result[i].therapy_type == "social_worker") {
                  result[i].therapy_type = constants.SOCIAL_WORKER_TYPE;
                } else if (result[i].therapy_type == "registered_councillor") {
                  result[i].therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
                } else if (
                  result[i].therapy_type == "counselling_psychologist"
                ) {
                  result[i].therapy_type =
                    constants.COUNSELLING_PSYCHOLOGIST_TYPE;
                } else if (result[i].therapy_type == "clinical_psychologist") {
                  result[i].therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
                } else {
                  result[i].therapy_type = constants.DEFAULT_TYPE;
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
            "category",
            "therapy_type",
            "status",
            "apointment_date_time",
            "price",
          ],
          include: [
            {
              model: userMasterModel,
              attributes: [
                "first_name",
                "last_name",
                "unic_id",
                "about_me",
                "profile_image",
                "mobile_number",
                "avg_rating",
                "total_rating",
              ],
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
                if (result[i].therapy_type == "social_worker") {
                  result[i].therapy_type = constants.SOCIAL_WORKER_TYPE;
                } else if (result[i].therapy_type == "registered_councillor") {
                  result[i].therapy_type = constants.REGISTERED_COUNCILLOR_TYPE;
                } else if (
                  result[i].therapy_type == "counselling_psychologist"
                ) {
                  result[i].therapy_type =
                    constants.COUNSELLING_PSYCHOLOGIST_TYPE;
                } else if (result[i].therapy_type == "clinical_psychologist") {
                  result[i].therapy_type = constants.CLINICAL_PSYCHOLOGIST_TYPE;
                } else {
                  result[i].therapy_type = constants.DEFAULT_TYPE;
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
      foreignKey: "therapist_id",
    });
    requestModel.hasMany(ratingModel, {
      foreignKey: "job_id",
    });
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
      customer_id: data.user_id,
      deleted_at: null,
    };
    return await requestModel
      .findOne({
        attributes: [
          "id",
          "request_number",
          "category",
          "therapy_type",
          "status",
          "apointment_date_time",
          "price",
          "question_answer",
          "payment_status",
          "customer_id",
          "therapist_id",
          "created_by",
          "survey_question",
        ],
        where: where,
        include: [
          {
            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "mobile_number",
              "years_experience",
              "qualification",
              "about_me",
              "unic_id",
              "user_type",
              "profile_image",
              "avg_rating",
              "total_rating",
              "therapy_type",
              "device_type",
              "notification_key",
            ],
            model: userMasterModel,
          },
          {
            attributes: ["rating", "review"],
            model: ratingModel,
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
   * find month request
   */
  findMonthRequest: async (data) => {
    requestModel.belongsTo(userMasterModel, {
      foreignKey: "therapist_id",
    });
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
    where.customer_id = data.user_id;
    where.request_delete = "no";
    where.deleted_at = null;
    where.status = {
      [Op.ne]: "draft",
    };

    //sequelize.fn("month", sequelize.col("fromDate")), fromMonth;
    return await requestModel
      .findAll({
        // attributes: [
        //   "id",
        //   "request_number",
        //   "therapy_type",
        //   "status",
        //   "apointment_date_time",
        //   "price",
        // ],
        where: where,
        include: [
          {
            attributes: [
              "id",
              "first_name",
              "last_name",
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
      customer_id: data.user_id,
    };
    return await requestModel
      .findOne({
        where: where,
        attributes: ["id"],
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
      customer_id: data.user_id,
    };
    return await requestModel
      .update(
        { request_delete: "yes" },
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
   * cancel request
   */
  cancelRequest: async (data) => {
    let where = {
      id: data.id,
      customer_id: data.user_id,
    };
    return await requestModel
      .update(
        { status: "cancel" },
        {
          where: where,
        }
      )
      .then(async (update_result) => {
        return update_result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: cancel request query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check last order
   */
  checkLastOrderCount: async (date) => {
    let where = {
      [Op.and]: [
        Sequelize.literal(
          "DATE_FORMAT(requests.created_at,'%Y-%m-%d') = '" + date + "' "
        ),
      ],
    };
    return await requestModel
      .count({
        where: where,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: count current order query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check referral code
   */
  checkReferralCode: async (referralcodeinfo) => {
    // let user_id = referralcodeinfo.customer_id;
    // let where = {};
    // if (referralcodeinfo.referral_code != "") {
    //   if (referralcodeinfo.is_my_code == "yes") {
    //     where.id = user_id;
    //     where.benefit_i_referral_used = "no";
    //   } else {
    //     where.referral_code = referralcodeinfo.referral_code;
    //     where.benefit_referral_used = "no";
    //   }
    //   return await userMasterModel
    //     .findOne({
    //       attributes: [
    //         "id",
    //         "benefit_i_referral_used",
    //         "benefit_referral_used",
    //       ],
    //       where: where,
    //     })
    //     .then(async (result) => {
    //       result = JSON.stringify(result);
    //       result = JSON.parse(result);
    //       return result;
    //     })
    //     .catch(async (err) => {
    //       logger.log("error", "DB error: referral code query failed.", err);
    //       return "result_failed";
    //     });
    // }

    const referralreply = {
      msg: "error on promocode",
      msg1: "",
      success: 0,
      id: 0,
    };
    var user_id = referralcodeinfo.customer_id;
    var promises = [];
    if (referralcodeinfo.referral_code == "") {
      referralreply.discount_amount = 0;
      referralreply.msg = "no referral code used";
      referralreply.id = 0;
      referralreply.msg1 = "";
      referralreply.success = 1;
      return referralreply;
    } else {
      if (referralcodeinfo.is_my_code == "yes") {
        var referralCodeSql =
          "SELECT id,benefit_i_referral_used,benefit_referral_used FROM users_master WHERE id='" +
          user_id +
          "' AND benefit_i_referral_used='no' ";
      } else {
        var referralCodeSql =
          "SELECT id,benefit_i_referral_used,benefit_referral_used FROM users_master WHERE referral_code = '" +
          referralcodeinfo.referral_code +
          "' AND benefit_referral_used='no' ";
      }
      promises.push(
        dbConnection
          .query(referralCodeSql, {
            type: dbConnection.QueryTypes.SELECT,
          })
          .then(function (referralCodeResult) {
            referralInfo = referralCodeResult;
          })
      );
      return Promise.all(promises)
        .then(function (result) {
          if (referralInfo.length > 0) {
            referralreply.success = 1;
            referralreply.id = referralInfo[0].id;
            referralreply.msg = "";
            referralreply.msg1 = "Click Pay Now to complete booking.";
            return referralreply;
          } else {
            referralreply.msg = "Reffreal code not found";
            referralreply.msg1 = "";
            return referralreply;
          }
        })
        .catch(function (err) {
          referralreply.success = 0;
          return referralreply;
        });
    }
  },

  /**
   * check group code
   */
  checkGroupCode: async (groupcodeinfo) => {
    let groupreply = {
      msg: "error on groupcode",
      is_group_code_applied: false,
      msg1: "",
      success: 0,
      id: 0,
    };
    var user_id = groupcodeinfo.customer_id;
    var promises = [];
    let countUsedGroupSql =
      "SELECT count(*) AS total_session FROM requests WHERE customer_id = '" +
      user_id +
      "' && status IN ('pending','wip')"; //
    let groupCodeSql =
      "SELECT id,code,free_session FROM group_code WHERE code = '" +
      groupcodeinfo.group_code +
      "' ";
    // set promises
    promises.push(
      dbConnection
        .query(countUsedGroupSql, {
          type: dbConnection.QueryTypes.SELECT,
        })
        .then(function (countUsedGroupResult) {
          countUsedGroupInfo = countUsedGroupResult;
        }),
      dbConnection
        .query(groupCodeSql, {
          type: dbConnection.QueryTypes.SELECT,
        })
        .then(function (groupCodeResult) {
          allGroupCodeInfo = groupCodeResult;
        })
    );
    return Promise.all(promises)
      .then(function (result) {
        if (allGroupCodeInfo.length > 0) {
          var remaingSession =
            allGroupCodeInfo[0].free_session -
            countUsedGroupInfo[0].total_session;
          if (remaingSession > 0) {
            groupreply.success = 1;
            groupreply.msg = "";
            groupreply.is_group_code_applied = true;
            return groupreply;
          } else {
            groupreply.success = 1;
            groupreply.msg = "";
            groupreply.is_group_code_applied = false;
            return groupreply;
          }
        } else {
          groupreply.success = 1;
          groupreply.msg = "";
          groupreply.is_group_code_applied = false;
          return groupreply;
        }
      })
      .catch(function (err) {
        groupreply.success = 0;
        return groupreply;
      });
  },

  /**
   * check promo code
   */
  checkPromocode: async (promocodeinfo) => {
    // let promoreply = {
    //   message: "error on promocode",
    //   msg1: "",
    //   success: 0,
    // };
    // // let response = {};
    // let promise = [];
    // let user_id = data.customer_id;
    // if (data.promo_code != "") {
    //   promise.push(
    //     promocodeModel
    //       .findOne({
    //         where: {
    //           code: data.promo_code,
    //         },
    //       })
    //       .then(async (result) => {
    //         result = JSON.stringify(result);
    //         result = JSON.parse(result);
    //         promoreply.promocodeInfo = result;
    //       }),
    //     requestModel
    //       .findAll({
    //         attributes: [
    //           [Sequelize.fn("COUNT", Sequelize.col("id")), "total_count"],
    //         ],
    //         where: {
    //           promo_code: data.promo_code,
    //         },
    //       })
    //       .then(async (result) => {
    //         result = JSON.stringify(result);
    //         result = JSON.parse(result);
    //         promoreply.usedPromoInfo = 0;
    //         if (result[0].total_count) {
    //           response.usedPromoInfo = result[0].total_count;
    //         }
    //       }),
    //     requestModel
    //       .findAll({
    //         attributes: [
    //           [Sequelize.fn("COUNT", Sequelize.col("id")), "total_count"],
    //         ],
    //         where: {
    //           promo_code: data.promo_code,
    //           customer_id: user_id,
    //         },
    //       })
    //       .then(async (result) => {
    //         result = JSON.stringify(result);
    //         result = JSON.parse(result);
    //         promoreply.userUsedPromoInfo = 0;
    //         if (result[0].total_count) {
    //           response.userUsedPromoInfo = result[0].total_count;
    //         }
    //       })
    //     // requestModel
    //     //   .count({
    //     //     attributes: ["id"],
    //     //     where: {
    //     //       promo_code: data.promo_code,
    //     //     },
    //     //   })
    //     //   .then(async (result) => {
    //     //     result = JSON.stringify(result);
    //     //     result = JSON.parse(result);
    //     //     promoreply.usedPromoInfo = result;
    //     //   }),
    //     // requestModel
    //     //   .count({
    //     //     attributes: ["id"],
    //     //     where: {
    //     //       promo_code: data.promo_code,
    //     //       //   customer_id: user_id,
    //     //     },
    //     //     //  group: user_id,
    //     //   })
    //     //   .then(async (result) => {
    //     //     result = JSON.stringify(result);
    //     //     result = JSON.parse(result);
    //     //     promoreply.userUsedPromoInfo = result;
    //     //   })
    //   );
    //   return Promise.all(promise)
    //     .then(async function (final_result) {
    //       return promoreply;
    //     })
    //     .catch(async (err) => {
    //       logger.log("error", "DB error: check promo check query failed.", err);
    //       return "result_failed";
    //     });
    // }

    const promoreply = {
      msg: "error on promocode",
      msg1: "",
      success: 0,
    };
    var user_id = promocodeinfo.customer_id;
    var promises = [];
    if (promocodeinfo.promo_code == "") {
      promoreply.discount_amount = 0;
      promoreply.msg = "no promo code used";
      promoreply.msg1 = "";
      promoreply.success = 1;
      return promoreply;
    }
    if (promocodeinfo.promo_code != "") {
      let promoCodeSql =
        "Select * From promocode where code = '" +
        promocodeinfo.promo_code +
        "' ";
      let countUsedPromoSql =
        "Select count(id) as total_promo From requests where promo_code = '" +
        promocodeinfo.promo_code +
        "'";
      let countUserUsedPromoSql =
        "Select count(id) as total_promo From requests where promo_code = '" +
        promocodeinfo.promo_code +
        "' And customer_id = '" +
        user_id +
        "' ";
      // set promises
      promises.push(
        dbConnection
          .query(promoCodeSql, {
            type: dbConnection.QueryTypes.SELECT,
          })
          .then(function (promoCodeResult) {
            promocodeInfo = promoCodeResult;
          }),
        dbConnection
          .query(countUsedPromoSql, {
            type: dbConnection.QueryTypes.SELECT,
          })
          .then(function (countUsedPromoResult) {
            usedPromoInfo = countUsedPromoResult;
          }),
        dbConnection
          .query(countUserUsedPromoSql, {
            type: dbConnection.QueryTypes.SELECT,
          })
          .then(function (countUserUsedPromoResult) {
            userUsedPromoInfo = countUserUsedPromoResult;
          })
      );
      return Promise.all(promises)
        .then(function (result) {
          if (promocodeInfo.length > 0) {
            if (promocodeInfo[0].status == "inactive") {
              promoreply.msg = "Promo code is inactive";
              promoreply.msg1 = "";
              return promoreply;
            }
            var currentDate = moment().format("YYYY-MM-DD 00:00:00");
            var valdiFromDate = moment(promocodeInfo[0].valid_from).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            if (valdiFromDate > currentDate) {
              promoreply.msg = "This promocode is not available yet.";
              promoreply.msg1 = "";
              return promoreply;
            }
            var valdiTillDate = moment(promocodeInfo[0].valid_till).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            if (valdiTillDate < currentDate) {
              promoreply.msg = "This promocode has been expired.";
              promoreply.msg1 = "";
              return promoreply;
            }
            if (promocodeInfo[0].max_uses <= usedPromoInfo[0].total_promo) {
              promoreply.msg = "The limit of this promocode has expired.";
              promoreply.msg1 = "";
              return promoreply;
            }

            if (
              promocodeInfo[0].max_uses_per_person <=
              userUsedPromoInfo[0].total_promo
            ) {
              promoreply.msg = "The limit of this promocode has expired.";
              promoreply.msg1 = "";
              return promoreply;
            }
            if (promocodeInfo[0].discount_type == "percent") {
              promoreply.success = 1;
              promoreply.discount_amount =
                (promocodeinfo.total_amount *
                  promocodeInfo[0].discount_amount) /
                100;
              promoreply.msg =
                "Congratulations! Your promocode '" +
                promocodeInfo[0].code +
                "' has been applied.";
              promoreply.msg1 = "Click Pay Now to complete booking.";
              return promoreply;
            } else {
              promoreply.success = 1;
              promoreply.discount_amount = promocodeInfo[0].discount_amount;
              promoreply.msg =
                "Congratulations! Your promocode '" +
                promocodeInfo[0].code +
                "' has been applied.";
              promoreply.msg1 = "Click Pay Now to complete booking.";
              return promoreply;
            }
          } else {
            promoreply.msg = "Promo code not found";
            promoreply.msg1 = "";
            return promoreply;
          }
        })
        .catch(function (err) {
          promoreply.success = 0;
          return promoreply;
        });
    }
  },

  /**
   * insert request
   */
  insertRequest: async (data) => {
    return await requestModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: insert request query failed.", err);
        return "result_failed";
      });
  },

  /**
   * insert plan
   */
  insertPlan: async (data) => {
    return await userVideoPlanModel
      .create(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: insert user video plan query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * update user table
   */
  updateUserInfo: async (data) => {
    // let updatereferralCodeSql = "";
    // if (is_my_code == "yes") {
    //   updatereferralCodeSql =
    //     "UPDATE users_master SET benefit_i_referral_used='yes' WHERE id=:id";
    // }
    // if (req.body.is_my_code == "no") {
    //   updatereferralCodeSql =
    //     "UPDATE users_master SET benefit_referral_used='yes' WHERE id=:id";
    // }
    // if (updatereferralCodeSql != "") {
    //   dbConnection.query(updatereferralCodeSql, {
    //     type: dbConnection.QueryTypes.UPDATE,
    //     replacements: { id: referralres.id },
    //   });
    // }
    // return await requestModel
    //   .create(data)
    //   .then(async (result) => {
    //     return result;
    //   })
    //   .catch(async (err) => {
    //     logger.log("error", "DB error: insert request query failed.", err);
    //     return "result_failed";
    //   });
  },

  /**
   * get request info
   */
  getRequestInfo: async (request_number) => {
    let SelectSql =
      "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email AS therapist_email, therapist.device_type AS therapist_device_type, therapist.notification_key AS therapist_notification_key From requests LEFT JOIN users_master AS customer  ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist  ON requests.therapist_id = therapist.id WHERE requests.request_number = :request_number";
    return await dbConnection
      .query(SelectSql, {
        type: dbConnection.QueryTypes.SELECT,
        replacements: { request_number: request_number },
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
      customer_id: data.user_id,
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
        logger.log("error", "DB error: therapist list query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update request
   */
  updateRequest: async (data) => {
    return await requestModel
      .update(
        { apointment_date_time: data.schedule_date },
        {
          where: {
            id: data.id,
          },
        }
      )
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: request update query failed.", err);
        return "result_failed";
      });
  },

  /**
   * get request data during edit
   */
  findOneRequest: async (data) => {
    // requestModel.belongsTo(userMasterModel, {
    //   as: "customer",
    //   foreignKey: "customer_id",
    // });
    // requestModel.belongsTo(userMasterModel, {
    //   as: "therapist",
    //   foreignKey: "therapist_id",
    // });
    // return await requestModel
    //   .findOne({
    //     attributes: [
    //       "id",
    //       "status",
    //       "customer_id",
    //       "therapist_id",
    //       "apointment_date_time",
    //       "price",
    //     ],
    //     include: [
    //       {
    //         attributes: ["id", "first_name"],
    //         model: userMasterModel,
    //         required: true,
    //         as: "customer",
    //       },
    //       {
    //         attributes: [
    //           "id",
    //           "first_name",
    //           "email",
    //           "device_type",
    //           "notification_key",
    //         ],
    //         model: userMasterModel,
    //         required: true, // redundant
    //         as: "therapist",
    //       },
    //     ],
    //   })
    //   .then(function (result) {
    //     result = JSON.stringify(result);
    //     result = JSON.parse(result);
    //     return result;
    //   })
    //   .catch(async (err) => {
    //     logger.log("error", "DB error: check promo check query failed.", err);
    //     return "result_failed";
    //   });
    let SelectSql =
      "SELECT requests.id,requests.status,requests.customer_id,requests.therapist_id,requests.apointment_date_time,requests.price,customer.first_name AS customer_first_name,customer.last_name AS customer_last_name,therapist.first_name AS therapist_first_name,therapist.last_name AS therapist_last_name,therapist.email AS therapist_email, therapist.notification_key AS therapist_notification_key, therapist.device_type AS therapist_device_type FROM requests LEFT JOIN users_master AS customer ON requests.customer_id = customer.id LEFT JOIN users_master AS therapist ON requests.therapist_id = therapist.id WHERE requests.id = :id";
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
      updated_at: moment().format("YYYY-MM-DD HH:mm:00"),
    };
    return await requestModel
      .update(updatedData, {
        where: {
          id: data.id,
          customer_id: data.user_id,
        },
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
   * customerOwnDetail
   */
  customerOwnDetail: async (data) => {
    requestModel.belongsTo(userMasterModel, {
      foreignKey: "therapist_id",
    });
    let where = {
      id: data.id,
      customer_id: data.user_id,
      deleted_at: null,
    };
    return await requestModel
      .findOne({
        attributes: [
          "id",
          "request_number",
          "therapy_type",
          "status",
          "apointment_date_time",
          "price",
          "payment_status",
          "customer_id",
          "therapist_id",
          "apointment_date_time",
        ],
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
        logger.log(
          "error",
          "DB error: therapist own detail query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * update request duplicate request
   */
  updateStatusDuplicateRequest: async (data) => {
    let updatedData = {
      status: data.status,
    };
    if (data.status === "confirm") {
      updatedData.payment_status == data.payment_status;
      updatedData.group_code = data.group_code;
      updatedData.status = "wip";
    }
    return await requestModel
      .update(updatedData, {
        where: {
          id: data.id,
          customer_id: data.user_id,
        },
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
};

// export module to use on other files
module.exports = request;
