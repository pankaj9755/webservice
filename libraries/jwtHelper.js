/**
 * Please ensure you generae the private.key and public,key before
 * using this library to genreate key files please visite file 
 * craeteKeyPair.js and package.json and run command form their.
 * `npm run key-gen` or whatever you create to key pair files.
 */
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require("dotenv").config();

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '..', 'keys', 'private.pem'));
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '..', 'keys', 'public.pem'));

/**
 * helper function for auth
 */
const jwtAuth = {



    JWTSighing: async (payload,TokenExpiryTime=18000) => {
        try {
            const keyid = crypto
                .createHash('sha256')
                .update(RSA_PUBLIC_KEY)
                .digest('hex');

            const signOptions = {
                algorithm: 'RS256',
                issuer: process.env.JWT_ISSUER,
                //expiresIn: process.env.JWT_EXPIRES_IN,
                expiresIn:TokenExpiryTime, // for i hours = 60 * 60,
                //issuer:'iss',
                subject: payload.email,
                audience: process.env.JWT_AUDIENCE,
               // audience:'aud',
                keyid,
            }

            const token = await jwt.sign(payload, RSA_PRIVATE_KEY, signOptions);
           
            //const token = await jwt.sign(payload, signOptions);

            return {
                expiresIn: process.env.JWT_EXPIRES_IN,
                token,
                status: true
            };

        } catch (err) {
            
            return {
                expiresIn: process.env.JWT_EXPIRES_IN,
                token: '',
                status: false
            };
        }
    },

    JWTVerify: async (token) => {
        try {
            const verify = await jwt.verify(token, RSA_PUBLIC_KEY);
            
            return {
                status: true,
                verify,
            };
        } catch (err) {
			//console.log('err at jwthelper',err);
            return {
                status: false,
                verify: {},
            };
        }
    }
}

// export
module.exports = jwtAuth;
