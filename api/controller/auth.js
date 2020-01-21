const oauth2orize = require('oauth2orize');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const user = require('../model/user.js');
const config = require('../config.js');
const { handleError } = require("../util/validation.js");


/** Common Config for JWTToken
  */
let jwtOpt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
  issuer: "CUTUBall OAuth API"
};


/** Generate JWT Token for user with 1 hr expiration.
  *
  * @param {Object} users
  */
function generateToken(user) {
  return jwt.sign(
    {},
    config.secret,
    {
      expiresIn: "1h",
      issuer: jwtOpt.issuer,
      subject: user.id
    }
  );
}


/** Passport jwtToken Strategy
  *
  * Transform JWTToken to User Object
  */
let jwtStrategy = new JwtStrategy(jwtOpt, function (jwtPayload, done) {
    user.getUserFromId(jwtPayload.sub, function (err, user) {
      if (err) {
        done(err, false);
        return;
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });


/** OAtuh2.0 Auth server
  *
  * This server has one endpoint for exchanging user, tel to token
  */
let authServer = oauth2orize.createServer();
// User credential exchange
authServer.exchange(oauth2orize.exchange.password(
    function (client, username, password, scope, done) {
      user.getUserFromId(username, function (err, user) {
        if (err) {
            done(err);
            return;
        }
        if (user && user.tel == password) {
            done(null, generateToken(user));
        } else {
            done(null, false);
        }
      })
    }
  ));

function checkAdminStatus(req, res, next) {
  let user = req.user;
  if(user.id != "admin")
    handleError(res, 403, "NOTADMIN", "User is not admin");
  else
    next();
}

module.exports = {authServer, jwtStrategy, checkAdminStatus};
