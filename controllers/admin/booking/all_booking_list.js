// Get all booking list data.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");
const UtilityHelper = require("../../../libraries/UtilityHelper")();
const moment = require("moment");

bookingData = (req, res) => {
  let response = {};
  let status = req.query.status ? req.query.status : "";
  let therapy_type = req.query.therapy_type ? req.query.therapy_type : "";
  const replacement_data = {
    status: status,
    therapy_type: therapy_type,
  };

  let Select =
    "SELECT req_tbl.request_number, CONCAT(UCASE(LEFT(user_tbl2.first_name, 1)), SUBSTRING(user_tbl2.first_name, 2), ' ', UCASE(LEFT(user_tbl2.last_name, 1)), SUBSTRING(user_tbl2.last_name, 2)) AS therapist_name, CONCAT(UCASE(LEFT(user_tbl1.first_name, 1)), SUBSTRING(user_tbl1.first_name, 2), ' ', UCASE(LEFT(user_tbl1.last_name, 1)), SUBSTRING(user_tbl1.last_name, 2)) AS customer_name, req_tbl.therapy_type, IFNULL(req_tbl.promo_code, '') AS promo_code, IFNULL(req_tbl.group_code, '') AS group_code, req_tbl.apointment_date_time, req_tbl.status FROM requests AS req_tbl LEFT JOIN users_master AS user_tbl1 ON req_tbl.customer_id = user_tbl1.id LEFT JOIN users_master AS user_tbl2 ON req_tbl.therapist_id = user_tbl2.id WHERE req_tbl.deleted_at IS NULL";

  if (status != "") {
    Select += " AND req_tbl.status = :status";
  }

  if (therapy_type != "") {
    Select += " AND req_tbl.therapy_type = :therapy_type";
  }

  Select += " ORDER BY req_tbl.id DESC";

  dbConnection
    .query(Select, {
      type: dbConnection.QueryTypes.SELECT,
      replacements: replacement_data
    })
    .then((result) => {
      if (result.length > 0) {
        result.forEach((element) => {
          switch (element.therapy_type) {
            case "marriage_counseling":
              element.therapy_type = "Marriage Counseling";
              break;
            case "online_therapy":
              element.therapy_type = "Online Therapy";
              break;
            case "teen_counseling":
              element.therapy_type = "Teen Counseling";
              break;
            case "social_worker":
              element.therapy_type = "Social Worker";
              break;
            case "registered_councillor":
              element.therapy_type = "Registered Counsellor";
              break;
            case "counselling_psychologist":
              element.therapy_type = "Counselling Psychologist";
              break;
            case "clinical_psychologist":
              element.therapy_type = "Clinical Psychologist";
              break;
          } // End switch case.

          switch (element.status) {
            case "wip":
              element.status = "Accepted";
              break;
            case "completed":
              element.status = "Completed";
              break;
            case "cancel":
              element.status = "Cancel";
              break;
            case "draft":
              element.status = "Draft";
              break;
            case "pending":
              element.status = "Pending";
              break;
          } // End switch case.
        }); // End forEach loop.

        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.SUCCESS_STATUS_CODE;
        response.message = "All request list";
        response.result = result;
        res.send(response);
      } else {
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        response.status = constants.RECORD_NOT_FOUND_STATUS_CODE;
        response.message = constants.RECORD_NOT_FOUND;
        res.send(response);
      }
    })
    .catch((err) => {
      console.error("Error in all_booking_list.js: ", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      res.send(response);
    });
};
module.exports = bookingData;
