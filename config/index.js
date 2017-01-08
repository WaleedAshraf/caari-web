import auth from './auth.js';

var env = {
  databaseURL: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET
};

module.exports.env = env;
module.exports.auth = auth;