// nodejs packages
const express = require("express");
const app = express();
const parser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");

// configuration files
const logger = require("./config/winstonConfig");
const morganConfig = require("./config/morganConfig");
const expressMonitorConfig = require("./config/expressMonitorConfig");

// helper libraries
const basic_auth = require("./libraries/basicAuth");

require("dotenv").config();

/*****************************/
/**** For HTTPS use only. ****/
/*****************************/
// const https = require('https');
// var fs = require("fs");
// const pkey = fs.readFileSync('/etc/letsencrypt/live/example.com/privkey.pem');
// const pcert = fs.readFileSync('/etc/letsencrypt/live/example.com/fullchain.pem');
// let options = {
//      key: pkey,
//      cert: pcert
//    };

// get port defined on .env file
var port = process.env.NODE_PORT;

// express monitor
// Set '' to config path to avoid middleware serving the html page (path must be a string not equal to the wanted route)
const statusMonitor = require("express-status-monitor")(expressMonitorConfig);
app.use(statusMonitor.middleware); // use the "middleware only" property to manage websockets
app.get("/status", basic_auth, statusMonitor.pageRoute); // use the pageRoute property to serve the dashboard html page

/******************************************************************/
/**** START For logging the request to create apache like log. ****/
/******************************************************************/
// setup the logger
app.use(morgan("combined", { stream: morganConfig }));

/************************************************/
/**** START For Parser request and response. ****/
/************************************************/
// json parser to send response in json format
app.use(parser.json({ type: "application/json" }));
app.use(parser.json({ limit: "10mb" }));
app.use(parser.urlencoded({ limit: "10mb", extended: true })); // parse application/x-www-form-urlencoded

/********************************/
/**** START For compression. ****/
/********************************/
app.use(compression());

/*****************************************/
/**** START For Cross origin request. ****/
/*****************************************/
// add cors to express app
app.use(cors());
// configuration for CORS
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN
  );
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS"
  );
  next();
});

// // cors with whitelist and extra ristrications on API
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }
// app.use(cors(corsOptions));

app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
/************************/
/**** add route file ****/
/************************/
app.use(require("./routes/apiRoutes"));
app.use(require("./routes/adminApiRoutes"));
app.use(require("./routes/v1/apiRoutes"));

/**************************************************/
/**** default path if no route found on server ****/
/**************************************************/
app.use((req, res, next) => {
  // respond with json with set status code 404.
  logger.log("error", "Invalid route Called.");
  res.status(404);
  if (req.accepts("json")) {
    res.json({
      error: "Invalid page. Please go back and request Again.",
    });
    return;
  }
});

/****************************/
/**** for HTTPS use only ****/
/****************************/
// var appHttps = https.createServer(options, app);
// appHttps.listen(port, () => {
//     console.log(`Your server running at ${port}`);
// });

app.listen(port, () => {
  console.log(`Your server running at ${port}`);
}); /*************************************************************************/

// //app.listen(8080, '172.31.15.236');

/*****************************/
/**** for Normal use only ****/
/*****************************/ /**** export module router so that it can be called on other modules. ****/
/**** For Test Cases ****/
/*************************************************************************/
module.exports = app;
