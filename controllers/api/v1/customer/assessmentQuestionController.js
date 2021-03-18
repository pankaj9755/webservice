const constants = require("./../../../../config/constants");
const validators = require("./../../../../validators/users/customer/assessment_question");
var UtilityHelper = require("./../../../../libraries/UtilityHelper")();
var EmailHelper = require("./../../../../libraries/EmailHelper")();
const services = require("./../../../../services/users/customer/assessment_question");
const logger = require("./../../../../config/winstonConfig");
var moment = require("moment");

const assessmentQuestionController = {
  /**
   * assessment question list
   */
  list: async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      limit,
      offset,
      order,
      direction,
    };
    try {
      let result = await services.getAllAssessmentQuestion(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (let i = 0; i < result.length; i++) {
        (function (i) {
          var validJson = UtilityHelper.IsJsonString(result[i].options);
          if (validJson) {
            result[i].options = JSON.parse(result[i].options);
          } else {
            result[i].options = [];
          }
        })(i);
      }
      delete response.message;
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: assessmentController.question list failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * assessment question list group by
   */
  allAssessmentQuestion: async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let order = "id";
    let direction = "DESC";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      limit,
      offset,
      order,
      direction,
    };
    try {
      let result = await services.getAllAssessmentQuestion(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (result.length <= 0) {
        response.message = constants.RECORD_NOT_FOUND;
        res.statusCode = 400;
        return res.json(response);
      }
      for (let i = 0; i < result.length; i++) {
        (function (i) {
          var validJson = UtilityHelper.IsJsonString(result[i].options);
          if (validJson) {
            result[i].options = JSON.parse(result[i].options);
          } else {
            result[i].options = [];
          }
        })(i);
      }
      let key = "category";
      let reposne_result = await services.groupByData(key, result);
      delete response.message;
      response.result = reposne_result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log(
        "error",
        "try-catch: assessmentController.question list failed.",
        err
      );
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * add assessment question
   */
  add: async (req, res) => {
    let question_answer = req.body.question_answer
      ? req.body.question_answer
      : "";
    let email = req.body.email ? req.body.email : "";
    let score = req.body.score ? req.body.score : 0;
    let category = req.body.category ? req.body.category.toLowerCase() : "";
    let user_id = res.locals.userData.id;
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      question_answer: question_answer,
      user_id: user_id,
      email: email,
    };
    // check validation error
    let validator_result = await validators.addAssessmentQuestion(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      let result = await services.addAssessmentQuestion(data);
      if (result === "result_failed") {
        res.statusCode = 500;
        return res.json(response);
      }
      if (process.env.MAIL_SEND.toString() === "true") {
        question_answer = JSON.parse(question_answer);
        var htmlText = "";
        var scorehtmlText = "";
        var categoryHtml = "";
        if(score>0){
			scorehtmlText += '<p style="font-family:arial"><b>Score: </b>'+score+'</p>';
        }
        if (question_answer.length > 0) {
          for (let i = 0; i < question_answer.length; i++) {
            (function (i) {
              htmlText +=
                "<b>Que: " +
                question_answer[i].question +
                "</b>" +
                "<br/>" +
                "Ans: " +
                question_answer[i].answer +
                "<br/><br/>";
            })(i);
          }
        }
        if(category=='depression'){
        categoryHtml +='<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
          "<tbody> " +
          "<tr>" +
          '<th style="border-bottom:1px solid black">Score'+
          "</th>"+
          '<th style="border-bottom:1px solid black">Symptom severity'+
          "</th>"+
           '<th style="border-bottom:1px solid black">Comments'+
          "</th>"+
          "</tr>"+
          "<tr>" +
          '<td style="border-bottom:1px solid black">0-4'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Minimal or none'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Monitor stress triggers'+
          "</td>"+
           "</tr>" +
           "<tr>" +
          '<td style="border-bottom:1px solid black">5-9'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Mild'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Mild level of depressive symptoms - consider supportive counselling sessions '+
          "</td>"+
           "</tr>" +
           "<tr>" +
          '<td style="border-bottom:1px solid black">10-14'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Moderate'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Significant level of depressive symptoms - counselling sessions are recommended '+
          "</td>"+
           "</tr>" +
           "<tr>" +
          '<td style="border-bottom:1px solid black">15-19'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Moderately severe'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Significantly high level of depressive symptoms - consult with a mental health care practitioner.'+
          "</td>"+
           "</tr>" +
           "<tr>" +
          '<td style="border-bottom:1px solid black">20-27'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Severe'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Severe level of depressive symptoms- consult with a mental health practitioners'+
          "</td>"+
           "</tr>" +
           "</tbody>" +
          "</table>";
         categoryHtml +='<p style="font-family:arial"><b>ACTIONS: </b></p>';
         categoryHtml +='<ul style="font-family:arial"><li>This tool should be used for screening and monitoring symptom severity and cannot replace a clinical assessment and diagnosis.</li>';
         categoryHtml +='<li>For more information please contact a therapist of your choice to get a better understanding of this screening assessment</li></ul>'
        }
        if(category=='anxiety'){
        categoryHtml +='<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
          "<tbody> " +
          "<tr>" +
          '<th style="border-bottom:1px solid black">Score'+
          "</th>"+
          '<th style="border-bottom:1px solid black">Symptom severity'+
          "</th>"+
           '<th style="border-bottom:1px solid black">Comments'+
          "</th>"+
          "</tr>"+
          "<tr>" +
          '<td style="border-bottom:1px solid black">5-9'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Low'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Monitor'+
          "</td>"+
           "</tr>" +
           "<tr>" +
          '<td style="border-bottom:1px solid black">10*-14'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Mild'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Book a Session with a therapists '+
          "</td>"+
           "</tr>" +
           "<tr>" +
          '<td style="border-bottom:1px solid black">>15'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Moderate'+
          "</td>"+
          '<td style="border-bottom:1px solid black">Contact your mental health care practitioner '+
          "</td>"+
           "</tr>" +
           "</tbody>" +
          "</table>";
         categoryHtml +='<p style="font-family:arial"><b>ACTIONS: </b></p>';
         categoryHtml +='<ul style="font-family:arial"><li>This tool should be used for screening and monitoring symptom severity and cannot replace a clinical assessment and diagnosis.</li>';
         categoryHtml +='<li>For more information please contact a therapist of your choice to get a better understanding of this screening assessment</li></ul>';
        }
        var logoImage = constants.BASEURL + "public/images/email_logo.png";
        var content =
          '<table style="margin: 0px auto; max-width: 440px; font-family: arial;" border="0" width="509" cellspacing="15" cellpadding="0" bgcolor="#f0f4f5">' +
          "<tbody>" +
          '<tr bgcolor="#ffffff">' +
          "<td>" +
          '<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
          "<tbody> " +
          "<tr>" +
          "<td>" +
          "<img style='width:70px;text-align: center;' alt='Syked' src='" +
          logoImage +
          "'></td>" +
          "</td>" +
          "</tr>" +
          "</tbody>" +
          "</table>" +
          "</td>" +
          "</tr>" +
          '<tr bgcolor="#ffffff">' +
          "<td>" +
          '<table style="border-color: gray;" border="0" cellspacing="0" cellpadding="15">' +
          "<tbody>" +
          "<tr>" +
          "<td>" +
          "<h5>Hello, "+
          "</h5>" +
          "<p>"+scorehtmlText+
          "</p>"+categoryHtml+
          '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">' +
          htmlText +
          "</p>" +
          "</td>" +
          "</tr>" +
          "</tbody>" +
          "</table>" +
          "</td>" +
          "</tr>" +
          "</tbody>" +
          "</table>";

        let userEmailOption = {
          subject: "Assessment Report",
          body: content,
          email: email,
        };
        EmailHelper.sendEmail(userEmailOption, function (mailResutl) {
          console.log("mail sent");
        });
      }
      response.message = constants.ASSESSMENT_QUESTION_ADDED_SUCESSFULL;
      //result.question_answer = JSON.parse(result.question_answer);
      response.result = result;
      res.statusCode = 200;
      return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: assessmentController.add failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = assessmentQuestionController;
