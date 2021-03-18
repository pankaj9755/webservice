var constants = require("../../../config/adminConstants");
var dbConnection = require("../../../config/connection");
var _ = require("lodash");
var moment = require("moment-timezone");
var Busboy = require("busboy");
var fs = require("fs");
var im = require("imagemagick");
var ffmpeg = require("ffmpeg");

upload = function (req, res) {
  var d = new Date();
  todayDt = parseInt(
    d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate()
  );
  todayTime = d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
  var busboy = new Busboy({
    headers: req.headers,
  });

  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    console.log(
      "File [" +
        fieldname +
        "]: filename: " +
        filename +
        ", encoding: " +
        encoding +
        ", mimetype: " +
        mimetype
    );
    file.on("data", function (data) {
      console.log(data);
    });
    file.on("end", function () {});
    var mimeType = filename.split(".");
    type = 1;
    newFileName =
      "IMG_" +
      parseInt(todayDt) +
      "_" +
      parseInt(todayTime) +
      "." +
      mimeType[1];

    if (req.headers.type == "user") {
      newFileName =
        "user_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/user/" + newFileName;
    } else if (req.headers.type == "admin") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/admin/" + newFileName;
    } else if (req.headers.type == "news") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/news/" + newFileName;
    } else if (req.headers.type == "library_image") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/library/" + newFileName;
    } else if (req.headers.type == "library_video") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/library/" + newFileName;
    } else if (req.headers.type == "assessment") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/assessment/" + newFileName;
    } else if (req.headers.type == "exercise_image") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/exercise/" + newFileName;
    } else if (req.headers.type == "exercise_video") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/exercise/" + newFileName;
    } else if (req.headers.type == "emoji") {
      newFileName =
        "IMG_" +
        parseInt(todayDt) +
        "_" +
        parseInt(todayTime) +
        "." +
        mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/emoji/" + newFileName;
    } else if (req.headers.type == "exercise_thumbnail") {
      newFileName = "IMG_" + parseInt(todayDt) + "_" + parseInt(todayTime) + "." + mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/exercise/thumbnail/" + newFileName;
    } else if (req.headers.type == "exercise_audio") {
      newFileName = "IMG_" + parseInt(todayDt) + "_" + parseInt(todayTime) + "." + mimeType[1];
      saveTo = constants.APP_PATH + "public/uploads/exercise/" + newFileName;
    } else if (req.headers.type == "library_thumbnail") {
		newFileName = "IMG_" + parseInt(todayDt) + "_" + parseInt(todayTime) + "." + mimeType[1];
		saveTo = constants.APP_PATH + "public/uploads/library/thumbnail/" + newFileName;
    } else {
      saveTo = constants.APP_PATH + "public/uploads/" + newFileName;
    }
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on("field", function (
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    if (fieldname == "user_id") {
    }
  });

  busboy.on("finish", function () {
    /**
     * convert function args array : ['source image', '-resize', '25x120', 'destination image']
     * If you want you can force "-resize" to ignore the aspect ratio and distort the image so it always generates an image exactly the size specified. This is done by adding the character '!' to the size.
     */
    if (req.headers.type == "user") {
      im.convert(
        [
          saveTo,
          "-resize",
          "300x400!",
          constants.APP_PATH + "public/uploads/user/thumbnail/" + newFileName,
        ],
        function (err, stdout) {
          if (err) throw err;
        }
      );
    }

    if (req.headers.type == "library_video") {
      try {
        var process = new ffmpeg(saveTo);
        process.then(
          function (video) {
            // Callback mode
            video.fnExtractFrameToJPG(
              constants.APP_PATH + "public/uploads/library/thumbnail/",
              {
                frame_rate: 1,
                number: 1,
                file_name: newFileName,
              },
              function (error, files) {
                if (!error) console.log("Frames: " + files);
              }
            );
          },
          function (err) {
            console.log("Error: " + err);
          }
        );
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }
    }
    if (req.headers.type == "exercise_video") {
      try {
        var process = new ffmpeg(saveTo);
        process.then(
          function (video) {
            // video.fnAddWatermark(
            //   "/var/www/html/syked/public/images/email_logo.png",
            //   "/var/www/html/syked/public/uploads/exercise/thumbnail/" +
            //     newFileName,
            //   {
            //     position: "SE",
            //   },
            //   function (error, file) {
            //     if (!error) console.log("New video file: " + file);
            //   }
            // );
            // Callback mode
            video.fnExtractFrameToJPG(
              constants.APP_PATH + "public/uploads/exercise/thumbnail/",
              {
                frame_rate: 1,
                number: 1,
                file_name: newFileName,
              },
              function (error, files) {
                if (!error) console.log("Frames: " + files);
              }
            );
          },
          function (err) {
            console.log("Error: " + err);
          }
        );
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }
    }
    if (newFileName != "") {
      result = {};
      result.image = newFileName;
      res.json({
        status: constants.SUCCESS_STATUS_CODE,
        message: constants.IMAGE_UPLOAD_SUCCESS,
        result: result,
      });
    } else {
      res.status(constants.RECORD_NOT_FOUND_STATUS_CODE).json({
        status: constants.RECORD_NOT_FOUND_STATUS_CODE,
        message: constants.IMAGE_UPLOAD_FAIL,
      });
    }
  });
  req.pipe(busboy);
};
module.exports = upload;
