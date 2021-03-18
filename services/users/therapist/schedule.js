const logger = require("./../../../config/winstonConfig");
const scheduleModel = require("../../../models/therapist_schedule");
const Sequelize = require("sequelize");
var moment = require("moment");
const Op = Sequelize.Op;

const schedule = {
  /**
   * schedule list
   */
  findSchedule: async (data) => {
    return await scheduleModel
      .findAll({
        attributes: [
          "id",
          "therapist_id",
          "day_number",
          "schedule",
          [
            Sequelize.literal(
              'CASE WHEN is_open = "yes" THEN true ELSE false END'
            ),
            "is_open",
          ],
        ],
        where: {
          therapist_id: data.user_id,
        },
        order:[
			 ['day_number', 'ASC'],
        ]
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        return result;
      })
      .catch(async (err) => {
        logger.log("error", "DB error:get schedule query failed.", err);
        return "result_failed";
      });
  },

  /**
   * update and add schedule
   */
  updateSchedule: async (data) => {
    let inputDataVal = data.input_data;
    let user_id = data.user_id;
    let promise = [];
    return await scheduleModel
      .findOne({
        where: {
          therapist_id: user_id,
        },
      })
      .then(async (result) => {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        if (result) {
          if (inputDataVal.length > 0) {
            for (var i = 0; i < inputDataVal.length; i++) {
              if (inputDataVal[i].schedule.length > 0) {
                var scheduleData = inputDataVal[i].schedule;
                var scheduleArray = [];
                for (var j = 0; j < scheduleData.length; j++) {
                  var toSchedule = scheduleData[j].to;
                  var originalToSchedule = moment(toSchedule, "hh:mm a");
                  var toScheduleFinalVal = originalToSchedule.format(
                    "HH:mm:00"
                  );
                  var fromSchedule = scheduleData[j].from;
                  var originalFromSchedule = moment(fromSchedule, "hh:mm a");
                  var fromScheduleFinalVal = originalFromSchedule.format(
                    "HH:mm:00"
                  );
                  if (
                    toScheduleFinalVal != "Invalid date" ||
                    fromScheduleFinalVal != "Invalid date"
                  ) {
                    scheduleArray.push({
                      from: fromScheduleFinalVal,
                      to: toScheduleFinalVal,
                    });
                  }
                }
                var schedule = JSON.stringify(scheduleArray);
              } else {
                var schedule = JSON.stringify([{ from: "14:00:00", to: "09:00:00" }]);
              }
              if (inputDataVal[i].is_open == 1) {
                inputDataVal[i].is_open = "yes";
              } else {
                inputDataVal[i].is_open = "no";
              }
              var updateData = {
                is_open: inputDataVal[i].is_open,
                schedule: schedule,
              };
              var where = {
                day_number: inputDataVal[i].day_number,
                therapist_id: user_id,
                // id: inputDataVal[i].id,
              };
              // set promise for update
              promise.push(
                scheduleModel
                  .update(updateData, {
                    where: where,
                  })
                  .then(async (result) => {})
              );
            }
          }
        } else {
          for (var i = 0; i < inputDataVal.length; i++) {
            if (inputDataVal[i].schedule.length > 0) {
              var scheduleData = inputDataVal[i].schedule;
              var scheduleArray = [];
              for (var j = 0; j < scheduleData.length; j++) {
                var toSchedule = scheduleData[j].to;
                var originalToSchedule = moment(toSchedule, "hh:mm a");
                var toScheduleFinalVal = originalToSchedule.format("HH:mm:00");
                var fromSchedule = scheduleData[j].from;
                var originalFromSchedule = moment(fromSchedule, "hh:mm a");
                var fromScheduleFinalVal = originalFromSchedule.format(
                  "HH:mm:00"
                );
                if (
                  toScheduleFinalVal != "Invalid date" ||
                  fromScheduleFinalVal != "Invalid date"
                ) {
                  scheduleArray.push({
                    from: fromScheduleFinalVal,
                    to: toScheduleFinalVal,
                  });
                }
              }
              var schedule = JSON.stringify(scheduleArray);
            } else {
              var schedule = "";
            }
            if (inputDataVal[i].is_open == 1) {
              inputDataVal[i].is_open = "yes";
            } else {
              inputDataVal[i].is_open = "no";
            }
            var insertData = {
              open_time: "00:00:00",
              close_time: "00:00:00",
              is_open: inputDataVal[i].is_open,
              day_number: inputDataVal[i].day_number,
              therapist_id: user_id,
              schedule: schedule,
            };
            // set promise for update
            promise.push(
              scheduleModel.create(insertData).then(async (result) => {})
            );
          }
        }
        return Promise.all(promise)
          .then(async function (final_result) {
            return final_result;
          })
          .catch(async (err) => {
            logger.log("error", "DB error: schedule check query failed.", err);
            return "result_failed";
          });
      })
      .catch(async (err) => {
        logger.log("error", "DB error:get schedule query failed.", err);
        return "result_failed";
      });
  },
};

// export module to use on other files
module.exports = schedule;
