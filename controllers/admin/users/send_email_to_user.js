// Send email to user.
var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var nodemailer = require("nodemailer");

SendMailToUser = (req, res) => {
  var response = {};
  var to_user_email = req.body.to_user ? req.body.to_user : "";
  var subject = req.body.subject ? req.body.subject : "";
  var message = req.body.message ? req.body.message : "";
  var fullName = req.body.first_name + " " + req.body.last_name;

  if (to_user_email == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.TO_USER_EMAIL_VALIDATION;
    res.send(response);
  }

  if (subject == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.SUBJECT_VALIDATION;
    res.send(response);
  }

  if (message == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.MESSAGE_VALIDATION;
    res.send(response);
  }

  SendMail(to_user_email, subject, message, fullName, function (result) {
    console.log("Mail sent.", result);
  });

  res.statusCode = constants.SUCCESS_STATUS_CODE;
  response.status = constants.SUCCESS_STATUS_CODE;
  response.message = constants.EMAIL_SUCCESS;
  res.send(response);
};
module.exports = SendMailToUser;

function SendMail(to_email, subject, message, fullName) {
  var logoImage = constants.BASEURL + "public/images/white_logo.png";
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
    "'>" +
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
    "<h5>Hello, " +
    fullName +
    "</h5>" +
    '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">' +
    message +
    "</p>" +
    "</td>" +
    "</tr>" +
    "</tbody>" +
    "</table>" +
    "</td>" +
    "</tr>" +
    "</tbody>" +
    "</table>";

  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  let mailOptions = {
    from:
      "" +
      process.env.MAIL_FROM_NAME +
      " <" +
      process.env.MAIL_FROM_EMAIL +
      ">", // sender address
    to: to_email, // list of receivers
    // to:"jitendra.mankare@idealittechno.com",
    subject: subject, // Subject line
    html: content, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
}
