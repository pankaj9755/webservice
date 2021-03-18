/**
 * token middleware file
 */
const constants = require("./../config/adminConstants"),
  jwtAuth = require("./../libraries/jwtHelper");
// deviceModel = require('./../models/deviceModel');

const tokenMiddleware = async (req, res, next) => {
  const token = req.headers.token ? req.headers.token : "";
  let response = {
    message: constants.TOKEN_VALIDATION,
  };
  if (
    token === "" &&
    req.route.path == "/v1/customer/therapists" &&
    req.route.methods.get
  ) {
    next();
  } else if (
    token === "" &&
    req.route.path == "/v1/customer/therapists/:id" &&
    req.route.methods.get
  ) {
    next();
  } else if (
    token === "" &&
    req.route.path == "/v1/customer/questions" &&
    req.route.methods.get
  ) {
    next();
  } else if (
    token === "" &&
    req.route.path == "/v1/customer/all-question-answer-list" &&
    req.route.methods.get
  ) {
    next();
  }
   else if (
    token === "" &&
    req.route.path == "/v1/customer/exercises" &&
    req.route.methods.get
  )
   {
    next();
  } else if (
    token === "" &&
    req.route.path == "/v1/customer/exercises/:id" &&
    req.route.methods.get
  ) {
    next();
  } else if (
    token === "" &&
    req.route.path == "/v1/user/top-rated-theripist" &&
    req.route.methods.get
  ) {
    next();
  } else {
    if (token === "") {
      res.statusCode = 422;
      response.message = constants.TOKEN_VALIDATION;
      return res.json(response);
    } else {
      // get token
      const jwtData = await jwtAuth.JWTVerify(token);
      if (jwtData.status === false) {
        res.statusCode = 401;
        response.message = "Please re-login to renew your session.";
        response.status = 401;
        response.is_logout = true;
        return res.send(response);
      }
      //res.locals.userData = decoded;
      res.locals.userData = jwtData.verify;
      let user_id = res.locals.userData.id;
      let query_data = {
        user_id: user_id,
        token: token,
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
};

// export data to use in other files
module.exports = tokenMiddleware;
