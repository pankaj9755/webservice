var fs = require("fs");
var path = require("path");
var rfs = require("rotating-file-stream");

/*******************************************************************/
/**** START For logging the request to create apache like logs. ****/
/*******************************************************************/

// create logs directroy
var logDirectory = path.join(__dirname, "./../logs");
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

function generator(time) {
    function pad(num) {
        return (num > 9 ? "" : "0") + num;
    }
   
    if(!time)
        return "file.log";
 
    var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day    = pad(time.getDate());
    var hour   = pad(time.getHours());
    var minute = pad(time.getMinutes());
 
    return month + "/" + month +
        day + "-" + process.env.APP_NAME + "-access.log";
}

var date = new Date();

// create a rotating write stream
var accessLogStream = rfs(generator(date), {
    // size:     '10M',
    interval: "1d", // rotate daily
    path: logDirectory
});

module.exports = accessLogStream;