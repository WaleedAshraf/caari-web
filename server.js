'use strict';

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import models from './models';
import logger from './logger.js';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from './config';

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'web', 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));

// pass passport for configuration
require('./lib/passport')(passport);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.env.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());

// override express logger
logger.debug("Overriding 'Express' logger");
app.use(morgan('common', { "stream": logger.stream }));

// use SSL
app.use(requireHTTPS);

// routes, load our routes and pass in our app and fully configured passport
require('./lib/routes.js')(app, passport); 

// sequelize sync models
models.sequelize.sync().then(function () {

  // start express server
  server.listen(port, err => {
    if (err) {
      return logger.error(err);
    }
    logger.info(`Server running on http://localhost:${port} [${env}]`);
  });
}).error(function (error) {
  logger.error("ERROR IN CONN : " + error)
});

function requireHTTPS(req, res, next) {
  if (req.headers['x-forwarded-proto'] != 'https' && env == 'production') {
    return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
  }
  res.setHeader("X-Powered-By", "caari");
  next();
}

module.exports = app;
