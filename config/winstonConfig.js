var winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

var transportDailyRotate = new DailyRotateFile({
    filename: "./logs/%DATE%-error.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
});

const logger = winston.createLogger({
    format: combine(label({
        label: process.env.APP_NAME,
    }), timestamp(), prettyPrint()),
    transports: [new winston.transports.Console(), transportDailyRotate]
});

// export module router so that it can be called on other modules.
module.exports = logger;
