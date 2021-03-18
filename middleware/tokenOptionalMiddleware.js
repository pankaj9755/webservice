/**
 * token middleware file
 */
const constants = require('./../config/adminConstants'),
    jwtAuth = require('./../libraries/jwtHelper');
    // deviceModel = require('./../models/deviceModel');

const tokenOptionalMiddleware = async (req, res, next) => {
    const token = req.headers.token ? req.headers.token : '';

    let response = {
        message: constants.TOKEN_VALIDATION
    };
    if (token === '') {
       res.locals.userData = {
			"id": 0,
			"user_id": 0
		};
		next();
    } else {

        // get token
       const jwtData = await jwtAuth.JWTVerify(token);
	   if (jwtData.status === false) {
			res.statusCode = 401;
			response.message = 'Please re-login to renew your session.';
            response.status = 401;
			return res.send(response);
		}
		
		//res.locals.userData = decoded;
		res.locals.userData = jwtData.verify;
        

		let user_id = res.locals.userData.id;
		let query_data = {
			user_id: user_id,
			token: token
		};

		next();
		

        // get device data
        /*const deviceData = await deviceModel.getDevices(query_data)

        // ckeck if query failed or device data empty
        if (deviceData === 'result_failed') {
            res.statusCode = 500;
            return await res.json(response);
        }

        // check for logout status
        if (deviceData[0].logout === 'no') {
            // continue to route controller
            next();
        } else {
            res.statusCode = 401;
            response.message = 'Please re-login to renew your session.';
            res.send(response);
        }*/
    }

}

// export data to use in other files
module.exports = tokenOptionalMiddleware;
