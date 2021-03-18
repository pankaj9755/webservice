const logger = require("./../../../config/winstonConfig");
const userMasterModel = require("../../../models/users_master");
const therapistScheduleModel = require("../../../models/therapist_schedule");
const requestModel = require("../../../models/request");
const groupCodeModel = require("../../../models/group_code");
const therapistGroupCodeModel = require("../../../models/therapist_group_code");
const questionModel = require("../../../models/question");
const ratingModel = require("../../../models/rating");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const therapist = {
  /**
   * find all therapist
   */
  findAll: async (data) => {
    userMasterModel.hasMany(therapistGroupCodeModel, {
      foreignKey: "therapist_id",
    });
    therapistGroupCodeModel.belongsTo(groupCodeModel, {
      foreignKey: "group_code_id",
    });
    let where = {
      user_type: "therapist",
      therapy_profile_status: "verify",
      deleted_at: null,
    };
    if (data.user_id != "") {
      where.id = {
        [Op.ne]: data.user_id,
      };
    }
    if(data.score!=""){
		console.log('data.score========121212sss====',data.score);
		if(data.score>=0 && data.score<=10){
			where.therapy_type = "social_worker";
		}
		if(data.score>=11 && data.score<=20){
			where.therapy_type = "registered_councillor";
		}
		if(data.score>=21 && data.score<=40){
			//where.therapy_type = "counselling_psychologist";
			where.therapy_type = {
				[Op.in]: ['counselling_psychologist','registered_councillor']
			};
		}
		if(data.score>=41){
			where.therapy_type = "clinical_psychologist";
		}

	}
	console.log('data.score============',data.score);
	console.log('where',where);
    if (data.used_group_code) {
      return await userMasterModel
        .findAndCountAll({
          where: where,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "unic_id",
            "profile_image",
            "therapy_type",
            "avg_rating",
            "total_rating",
          ],
          include: [
            {
              attributes: ["group_code_id"],
              model: therapistGroupCodeModel,
              include: {
                attributes: ["code"],
                model: groupCodeModel,
                where: {
                  code: [data.used_group_code],
                },
              },
            },
          ],
          order: [
            ["avg_rating", "DESC"],
            ["total_rating", "DESC"],
          ],
          limit: data.limit,
          offset: data.offset,
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
    } else {
      return await userMasterModel
        .findAndCountAll({
          where: where,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "unic_id",
            "profile_image",
            "therapy_type",
            "avg_rating",
            "total_rating",
            
          ],
          order: [
            ["avg_rating", "DESC"],
            ["total_rating", "DESC"],
          ],
          limit: data.limit,
          offset: data.offset,
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
    }
  },
  /**
   * find one therapist
   */
  findOne: async (data) => {
    userMasterModel.hasMany(ratingModel, {
      foreignKey: "therapist_id",
    });
    ratingModel.belongsTo(userMasterModel, {
      foreignKey: "customer_id",
    });
    let where = {
      id: data.id,
      user_type: "therapist",
      therapy_profile_status: "verify",
      deleted_at: null,
    };
    return await userMasterModel
      .findOne({
        where: where,
        attributes: [
          "id",
          "first_name",
          "last_name",
          "mobile_number",
          "country_code",
          "email",
          "unic_id",
          "profile_image",
          "gender",
          "qualification",
          "years_experience",
          "therapy_type",
          "about_me",
          "hpcsa_no",
          "avg_rating",
          "total_rating",
        ],
        include: [
          {
            attributes: ["id", "rating", "review", "type", "created_at"],
            model: ratingModel,
            include: {
              attributes: [
                "id",
                "profile_image",
                "first_name",
                [Sequelize.literal("'Anonymous'"), "first_name"],
                [Sequelize.literal(" '' "), "last_name"],
              ],
              where: {
                deleted_at: null,
              },
              model: userMasterModel,
            },
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
   * therapist week schedule
   */
  findWeekchedule: async (data) => {
    userMasterModel.hasMany(therapistScheduleModel, {
      foreignKey: "therapist_id",
    });
    return await userMasterModel
      .findOne({
        attributes: ["id"],
        where: {
          unic_id: data.id,
        },
        include: [
          {
            attributes: ["day_number", "schedule"],
            where: {
              is_open: "yes",
            },
            model: therapistScheduleModel,
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
          "DB error: therapist week schedule query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * find request
   */
  findRequest: async (data) => {
    let where = {
      therapist_id: data.id,
      status: ["pending", "wip"],
      [Op.and]: [
        Sequelize.literal(
          "apointment_date_time >= '" +
            data.startRequestDate +
            "' AND apointment_date_time <= '" +
            data.endRequestDate +
            "' "
        ),
      ],
    };
    return await requestModel
      .findAll({
        where: where,
        attributes: ["id", "apointment_date_time"],
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: therapist week schedule query failed.",
          err
        );
        return "result_failed";
      });
  },

  /**
   * find question list
   */
  findQuestion: async (data) => {
    let where = {
      therapy_type: data.therapy_type,
    };
    return await questionModel
      .findAll({
        where: where,
        attributes: [
          "id",
          "question",
          "therapy_type",
          "question_type",
          "options",
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
   * find all question ansert list
   */
  findQuestionAnswer: async (data) => {
    let response = {};
    let promise = [];
    let general_public_where = {
      therapy_type: "general_public",
      status: "active",
      deleted_at: null,
    };
    let student_where = {
      therapy_type: "student",
      status: "active",
      deleted_at: null,
    };
    let mediacl_aid_where = {
      therapy_type: "medical_aid",
      status: "active",
      deleted_at: null,
    };
    let employee_where = {
      therapy_type: "employee",
      status: "active",
      deleted_at: null,
    };
    promise.push(
      // general public
      questionModel
        .findAll({
          where: general_public_where,
          attributes: [
            "id",
            "question",
            "therapy_type",
            "question_type",
            "options",
          ],
          order: [["id", "DESC"]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                result[i].options = JSON.parse(result[i].options);
              })(i);
            }
          }
          response.general_public = result;
        }),
      // student
      questionModel
        .findAll({
          where: student_where,
          attributes: [
            "id",
            "question",
            "therapy_type",
            "question_type",
            "options",
          ],
          order: [["id", "DESC"]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                result[i].options = JSON.parse(result[i].options);
              })(i);
            }
          }
          response.student = result;
        }),
      // mediacl aid
      questionModel
        .findAll({
          where: mediacl_aid_where,
          attributes: [
            "id",
            "question",
            "therapy_type",
            "question_type",
            "options",
          ],
          order: [["id", "DESC"]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                result[i].options = JSON.parse(result[i].options);
              })(i);
            }
          }
          response.medical_aid = result;
        }),
      // employee
      questionModel
        .findAll({
          where: employee_where,
          attributes: [
            "id",
            "question",
            "therapy_type",
            "question_type",
            "options",
          ],
          order: [["id", "DESC"]],
        })
        .then(async (result) => {
          result = JSON.stringify(result);
          result = JSON.parse(result);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              (function (i) {
                result[i].options = JSON.parse(result[i].options);
              })(i);
            }
          }
          response.employee = result;
        })
    );
    return Promise.all(promise)
      .then(async function (final_result) {
        return response;
      })
      .catch(async (err) => {
        logger.log("error", "DB error: verification check query failed.", err);
        return "result_failed";
      });
  },

  /**
   * check question answer exist or not
   */
  checkQuestionAnswer: async (user_id) => {
    return await requestModel
      .findOne({
        attributes: ["id","score","question_answer"],
        where: {
          customer_id: user_id,
          created_by: "customer",
        },
        order: [["id", "DESC"]],
        limit: 1,
        offset: 0,
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log(
          "error",
          "DB error: check question answer query failed.",
          err
        );
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = therapist;
