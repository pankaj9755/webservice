require("dotenv").config();
const fcm = require('fcm-notification');

/**
 * FCM configuriaton file
 */
const fcm_file_path = process.env.APP_BASE_PATH + 'keys/' + process.env.FCM_KEY_NAME;
const FCM = new fcm(fcm_file_path);

module.exports = FCM;
