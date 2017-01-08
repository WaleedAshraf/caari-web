import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import logger from '../logger.js';
import routes from '../web/routes.js';
import IndexPage from '../web/components/IndexPage';
import WishPage from '../web/components/WishPage';

module.exports = function (app, passport) {

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    logger.info("prof render", req.url);
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    logger.info("logout", req.url);
    req.logout();
    res.redirect('/');
  });

  // facebook -------------------------------
  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'publish_actions', 'public_profile'] }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/wishpage',
      failureRedirect: '/'
    }));

  // universal routing and rendering
  // app.get('/*', (req, res) => {
  //   logger.info("universal route", req.url);
  //   match(
  //     { routes, location: req.url },
  //     (err, redirectLocation, renderProps) => {

  //       // in case of error display the error message
  //       if (err) {
  //         logger.error("err page");
  //         return res.status(500).send(err.message);
  //       }

  //       // in case of redirect propagate the redirect to the browser
  //       if (redirectLocation) {
  //         logger.info("react redirect");
  //         return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
  //       }

  //       // generate the React markup for the current route
  //       let markup;
  //       if (renderProps) {
  //         markup = renderToString(<RouterContext {...renderProps} />);
  //         logger.info("markup render", req.url);
          
  //       } else {
  //         return;
  //       }
  //     }
  //   );
  // });

  // helper function for rendering a view with React
  function reactRender(res, component) {
    let markup = renderToString(< component />);
    res.render('index', { markup });
  }

  function home(req, res) {
    reactRender(res, IndexPage);
  }

  function wish(req, res) {
    reactRender(res, WishPage);
  }

  app.get('/', function(req, res){
    return home(req, res);
  });

  app.get('/wishpage', isLoggedIn, function(req, res){
    return wish(req, res);
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
