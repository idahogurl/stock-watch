// File is auto-generated. Do not modify!!

/* eslint-disable */
'use strict'

var fs = require('fs');
var path = require('path');
var { Sequelize, DataTypes} = require('sequelize');
var dotenv = require('dotenv');
dotenv.config();

var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(`${__dirname}/../config/config.json`)[env];
var options = env === 'development' ? { logging: console.log } : {};

if (env ==='prod' && process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  var sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...config,
    ...options
  });
} else {
  // the application is executed on the local machine ... use sqlite
  var sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    ...options
  });
}

var db = {};
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
