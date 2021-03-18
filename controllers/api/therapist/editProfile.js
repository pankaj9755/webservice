const constants = require("./../../../config/constants");
const dbConnection = require("./../../../config/connection");
const Validator = require('validatorjs');
const UtilityHelper = require('./../../../libraries/UtilityHelper')();

editProfile = (req,res) => {
    
	const response = {
        'msg': constants.SOMETHING_WENT_WRONG,
    };
    const data = {
    	first_name:req.body.first_name,
    	last_name:req.body.last_name,
    	gender:req.body.gender,
    	qualification:req.body.qualification,
    	therapy_type:req.body.therapy_type,
    	address:req.body.address,
    	profile_image:req.body.profile_image,
    	about_me:req.body.about_me,
    	id_proof:req.body.id_proof,
        lat:req.body.lat,
        lng:req.body.lng,
        year_experience:req.body.year_experience,
        hpcsa_no:req.body.hpcsa_no,
    };
    const rules = {
        gender: 'required',qualification: 'required',
        therapy_type: 'required',address: 'required',
       // profile_image: 'required',//id_proof: 'required',
        first_name: 'required',last_name: 'required',
        about_me:'required',year_experience:'required'
    };
    const validation = new Validator(data,rules);
    if(validation.fails()){
        
        res.statusCode = 422;
        response.msg = 'Validation error';
        response.errors = validation.errors.errors;
        return res.send(response);
    }
    var user_id = res.locals.userData.id;
    
    if(res.locals.userData.user_type != 'therapist'){
        response.msg = constants.INVALID_USER_TYPE;
        res.statusCode = 400;
        return res.send(response);
    }

    var qualification = JSON.stringify(data.qualification);

    let UpdateSql = "Update users_master set first_name = :first_name, last_name = :last_name,"
    UpdateSql += " gender = :gender, qualification= :qualification, therapy_type= :therapy_type,"
    UpdateSql += " address = :address, profile_image= :profile_image, id_proof= :id_proof,"
    if(data.lat != '' && data.lng != ''){
        UpdateSql += " lattitude = :lat , longitude = :lng , ";
    }

    UpdateSql += " about_me = :about_me, years_experience = :years_experience,hpcsa_no =:hpcsa_no where id = :user_id and deleted_at is null";
    dbConnection.query(UpdateSql, { 
        type: dbConnection.QueryTypes.UPDATE,
        replacements: {
            first_name: data.first_name,
            last_name: data.last_name,
            gender:data.gender,
            qualification:qualification,
            therapy_type:data.therapy_type,
            address:data.address,
            profile_image:data.profile_image?data.profile_image:"",
            about_me:data.about_me,
            id_proof:data.id_proof?data.id_proof:'',
            user_id:user_id,
            lat:data.lat,
            lng:data.lng,
            years_experience:data.year_experience,
            hpcsa_no:data.hpcsa_no
        }

    }).then(function(result1) {
    	if(result1){
    		response.msg = constants.PROFILE_UPDATE_SUCCESS;
            res.statusCode = 200;
            res.send(response);
    	}
    }).catch(function(err) {
        res.statusCode = 500;
        res.msg = err;
        console.log(err);
        res.send(response);
    });
}
module.exports = editProfile;
