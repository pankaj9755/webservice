const auth = require('http-auth');
require("dotenv").config();

/**
 * basic auth for pages
 */
const basic = auth.basic({
    realm: 'Secured Area'
}, (user, pass, callback) => {
    callback(user === process.env.BASIC_AUTH_USERNAME && pass === process.env.BASIC_AUTH_PASSWORD);
});

// basic auth check
const basic_auth = auth.connect(basic)

module.exports = basic_auth;