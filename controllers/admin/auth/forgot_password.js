var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
md5 = require('md5'),
_ = require('lodash');
var nodemailer = require('nodemailer');

ForgotPassword = function(req, res) {
    var email = req.body.email ? req.body.email : "";

    if (email == "") {
        var response = {
            "status": constants.VALIDATION_STATUS_CODE,
            "message": constants.EMAIL_VALIDATION
        };
        res.status(response.status).json(response);
    } else {
        var user_exist_sql = "SELECT * FROM admin WHERE email = '" + email + "'";
          
        dbConnection.query(user_exist_sql, { type: dbConnection.QueryTypes.SELECT })
        .then(function(result) {
            if (result.length > 0) {
                var otp_code = _.random(1000000000, 9999999999);
                var update_sql = "UPDATE admin SET remember_token = '" + otp_code +"' WHERE id = '" + result[0].id + "'";

                dbConnection.query(update_sql, { type: dbConnection.QueryTypes.UPDATE })
                .then(function(update_result) {
                    send_email_user(result[0].first_name, email, otp_code, result[0].id, function() {
                        console.log('mail sent.');
                    });
                    
                    var response = {
                        "status": constants.SUCCESS_STATUS_CODE,
                        "message": constants.PASSWORD_RESET_MESSAGE
                    };
                    res.json(response);
                   
                }).catch(function(err) {
                    console.log(
                        ' -- check forgot password Query failed err.message: ' +
                        err.message);
                    // response  to send
                    var response = {
                        'code': constants.SOMETHING_WENT_WRONG_STATUS_CODE,
                        'error': constants.SOMETHING_WENT_WRONG
                    };
                    res.json(response);
                });
            } else {
                var response = {
                    "status": constants.RECORD_NOT_FOUND_STATUS_CODE,
                    "message": constants.EMAIL_NOT_REGISTER
                };
                res.json(response);
            }
        });
    }
};
module.exports = ForgotPassword;

function send_email_user(user_name, email, token, user_id,) {
    
    var FrogotURL = constants.BASEURL+'forgot-password/'+user_id+'/'+token;

    console.log("FrogotURL : "+FrogotURL);

    var mainMsg =
        '<table style="margin: 0px auto; max-width: 440px; font-family: arial;" border="0" width="509" cellspacing="15" cellpadding="0" bgcolor="#f0f4f5">' +
        '<tbody>' +
        '<tr bgcolor="#ffffff">' +
        '<td>' +
        '<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
        '<tbody> ' +
        '<tr>' +
        '<td> Syked' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '<tr bgcolor="#ffffff">' +
        '<td>' +
        '<table style="border-color: gray;" border="0" cellspacing="0" cellpadding="15">' +
        '<tbody>' +
        '<tr>' +
        '<td>' +
        '<h5>Hello ' + user_name + ',</h5>' +
        '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Someone recently requested a password change for your Skillpo account. If this was you, please click the link below and folow the instructions to create a new password here.</p>' +
        '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><a href="'+FrogotURL+'">CLICK HERE</a></p>' +
        '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Thank you !<br />MR Hector Team.</p>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';
    //Mail to user 

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: process.env.MAIL_PASSWORD // generated ethereal password
        }
    });
    let mailOptions = {
        from: '' + process.env.MAIL_FROM_NAME + ' <' + process.env.MAIL_FROM_EMAIL + '>', // sender address
        to: email, // list of receivers
        //to:"kapil@idealittechno.com",
        subject: 'Forgot Password', // Subject line
        html: mainMsg // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    //end mail
}
