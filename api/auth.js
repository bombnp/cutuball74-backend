const oauth2orize = require('oauth2orize');
const user = require('./user.js');
const jwt = require('jsonwebtoken');
const config = require('./config.js');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


jwtOpt = {}
jwtOpt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOpt.secretOrKey = config.secret;
jwtOpt.issuer = "CUTUBall OAuth API";


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


function buildJwtStrategy(db) {
  return new JwtStrategy(jwtOpt, function (jwtPayload, done) {
    user.getUserFromId(jwtPayload.sub, db, function (err, user) {
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
}


function buildServer(db) {
    const server = oauth2orize.createServer();
    // User credential exchange
    server.exchange(oauth2orize.exchange.password(
      function (client, username, password, scope, done) {
        user.getUserFromId(username, db, function (err, user) {
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

    return server;
}

module.exports = {buildServer, buildJwtStrategy};
