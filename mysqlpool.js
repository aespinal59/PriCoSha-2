var mysql = require('mysql');
var config = require('./config');


//  TODO: Put this in a config.
var pool = mysql.createPool(config.db);

module.exports = pool;