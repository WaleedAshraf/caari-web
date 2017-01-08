var config = require('../config'),
  fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  logger = require('../logger.js');

// configure the connection to the db
var sequelize = new Sequelize(config.env.databaseURL, {
  dialect: 'postgres'
  // dialectOptions: {
  //   ssl: true
  // }
});

// an empty object
var db = {};

// connect to the db
sequelize
  .authenticate()
  .then(function (err) {
    logger.info('Connection has been established successfully.');
  }, function (err) {
    logger.error('Unable to connect to the database:', err);
  });

// import all the models
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

// attach sequelize to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// export the db object
module.exports = db;
