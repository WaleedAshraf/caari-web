var config = require('../config'),
  FacebookStrategy = require('passport-facebook').Strategy,
  models = require('../models'),
  logger = require('../logger.js');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.facebook_id);
  });

  passport.deserializeUser(function (id, done) {
    models.User.find({ where: { facebook_id: id } }).then(function (user) {
      done(null, user);
    }).catch(function (error) {
      logger.error("Error: " + error);
      return done(error, null);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: config.auth.facebookAuth.clientID,
    clientSecret: config.auth.facebookAuth.clientSecret,
    callbackURL: config.auth.facebookAuth.callbackURL
  }, function (token, refreshToken, profile, done) {
    console.log(profile);
    process.nextTick(function () {
      models.User.find({ where: { facebook_id: profile.id } }).then(function (fbUser) {
        if (fbUser) {
          // TODO: Handle case where there IS user, but no facebook user
          logger.info('user found' + fbUser.id);
          return done(null, fbUser);
        } else {
          // If there is no user found, then create one
          var newFBUser = {
            token: token,
            facebook_id: profile.id,
            name: profile.displayName         
          };

          if(profile.emails && profile.emails[0] && profile.emails[0].value){
            newFBUser.email = (profile.emails[0].value || '').toLowerCase();
          }

          // Create new Facebook user with token.
          models.User.create(newFBUser).then(function (newUser) {
            logger.info('new user created' + newUser.id);
            return done(null, newUser);
          });
        }
      });
    });
  }));
}  