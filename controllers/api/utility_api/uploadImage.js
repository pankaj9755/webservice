const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
var _ = require('lodash');
var moment = require('moment-timezone');
var Busboy = require('busboy');
var fs = require('fs');

var imageUploadPath = ""

uploadImages = function(req, res) {
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
	var d = new Date();
	todayDt = parseInt(d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate());
	todayTime = d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
	var busboy = new Busboy({
	    headers: req.headers
	});
	var newFileName = '';

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		file.on('data', function(data) {
	      //console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
	    });
	    file.on('end', function() {
	      console.log('File [' + fieldname + '] Finished');
	    });
	    var mimeType = filename.split('.');
	    newFileName = req.headers.user_type+'_IMG_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
	    
	    if (req.headers.user_type == 'customer') {
	    	saveTo = constants.CUSTOMER_IMAGE_UPLOAD_PATH+"/"+newFileName;
	    }else if(req.headers.user_type == 'therapist'){
	    	saveTo = constants.THERAPIST_IMAGE_UPLOAD_PATH+"/"+newFileName
	    }else if(req.headers.user_type == 'id_proof'){
	    	saveTo = constants.ID_UPLOAD_PATH+"/"+newFileName
	    }else{
	    	saveTo = '';
	    }
	    if( typeof saveTo != 'undefined' && saveTo != ''){
	        file.pipe(fs.createWriteStream(saveTo));
	    }
	});

	busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
	    
	    console.log('Field [' + fieldname + ']: value: ' + newFileName);
	    
	});
	busboy.on('finish', function() {
		console.log('------------------oo');
		if(typeof saveTo == 'undefined' || saveTo == ''){
			console.log('------------------oo11');
			res.statusCode = 500;
			response.msg = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
		}

		if(typeof newFileName == 'undefined' || newFileName == ''){
			res.statusCode = 500;
			response.msg = constants.SOMETHING_WENT_WRONG;
            return res.send(response);
		}

		response.msg = constants.PROFILE_UPDATE_SUCCESS;
        response.image = newFileName;
        res.statusCode = 200;
        res.send(response);
	});
	req.pipe(busboy);
}
module.exports = uploadImages;