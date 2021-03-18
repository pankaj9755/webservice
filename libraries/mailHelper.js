const transporter = require('./../config/mailConfig');

mailNodeMailer = {

    /**
     * send normal mail to the given address.
     * 
     */
    normalMailSender: async (
        to,
        subject,
        htmlMessage,
        replyTo = process.env.EMAIL_FROM_EMAIL,
        attachments = []) => {
        try {
            // crreate mail option to send mail.
            const mailOptions = {
                from: '"' + process.env.EMAIL_FROM_NAME + '" <' + process.env.EMAIL_FROM_EMAIL + '>', // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: htmlMessage, // html body
                replyTo: replyTo,
            };

            // check if any attachment exist or not
            if (attachments.length() > 0) {
                mailOptions.attachments = attachments;
            }

            // send mail with defined transport object.
            smtpTransport.sendMail(mailOptions, (err, response) => {
                if (err) {
                    logger.log('info', 'Failed to send normal mail.', err);
                    return 'normal_text_mail_sender';
                }
                return response;
                // if you don't want to use this transport object anymore, uncomment following line
                // smtpTransport.close(); // shut down the connection pool, no more messages
            });
        } catch (err) {
            logger.log('info', 'try_catch: Failed to send mail.', err);
            return 'normal_text_mail_sender';
        }
    },

    /**
     * Tempate mail with nodemailer.
     */
    sendTemplateMail: async (template_name) => {
        const mailOptions = {
            from: '"' + process.env.EMAIL_FROM_NAME + '" <' + process.env.EMAIL_FROM_EMAIL + '>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: htmlMessage, // html body
            replyTo: replyTo,
        };

        await smtpTransport.send({
            template: 'mars',
            message: {
                to: 'elon@spacex.com'
            },
            locals: {
                name: 'Elon'
            }
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }
}

// send mail with defined transport object
