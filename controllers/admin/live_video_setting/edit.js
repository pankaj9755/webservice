// Edit question.
const constants = require("../../../config/adminConstants");
const dbConnection = require("../../../config/connection");

updateLiveVideoSettingInfo = (req, res) => {
  let response = {};
  let id = req.body.id ? req.body.id : "";
  let therapist_id = req.body.therapist_id ? req.body.therapist_id : "";
  let url = req.body.url ? req.body.url : null;
  let stream_id = req.body.stream_id ? req.body.stream_id : null;
  let is_live = req.body.is_live ? req.body.is_live : "";
  if (id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  if (therapist_id == "") {
    res.statusCode = constants.VALIDATION_STATUS_CODE;
    response.status = constants.VALIDATION_STATUS_CODE;
    response.message = constants.ID_VALIDATION;
    return res.send(response);
  }
  let data = {
    id: id,
    therapist_id: therapist_id,
    url: url,
    stream_id: stream_id,
    is_live: is_live,
  };
  let query =
    "UPDATE live_video_setting SET therapist_id = :therapist_id, url = :url, stream_id = :stream_id, is_live = :is_live WHERE id = :id";
  dbConnection
    .query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then((result) => {
		//insert into 
		
			 let selectQry = "SELECT * FROM live_video WHERE stream_id = :stream_id";
			  dbConnection
				.query(selectQry, { replacements: {stream_id:stream_id}, type: dbConnection.QueryTypes.SELECT })
				.then((selectQryresult) => {
					console.log('is_live=================',is_live);
					console.log('data=========',data);
					if(selectQryresult.length==0 && is_live){
						let insertquery =
								"INSERT INTO live_video SET url = :url, stream_id = :stream_id, is_live = :is_live";
							  dbConnection
								.query(insertquery, { replacements: data, type: dbConnection.QueryTypes.INSERT })
								.then((insertresult) => {
									
									 res.statusCode = constants.SUCCESS_STATUS_CODE;
									 response.status = constants.SUCCESS_STATUS_CODE;
									 response.result = {id:insertresult[0]};
									 response.message = "Record update successfully.";
									 return res.send(response);
								}).catch((err) => {
								  console.error("Error into insert live video setting.js: " + err);
								  res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
								  response.message = constants.SOMETHING_WENT_WRONG;
								  return res.send(response);
								});
					}else{
						res.statusCode = constants.SUCCESS_STATUS_CODE;
						response.status = constants.SUCCESS_STATUS_CODE;
						response.result = {id:selectQryresult[0].id};
						response.message = "Record update successfully.";
						return res.send(response);
					 
					}
					
				}).catch((err) => {
				  console.error("Error into select live video setting.js: " + err);
				  res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
				  response.message = constants.SOMETHING_WENT_WRONG;
				  return res.send(response);
				});
		
		
     
    })
    .catch((err) => {
      console.error("Error into update live video setting.js: " + err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.message = constants.SOMETHING_WENT_WRONG;
      return res.send(response);
    });
};
module.exports = updateLiveVideoSettingInfo;
