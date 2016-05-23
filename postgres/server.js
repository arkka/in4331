/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    Sequelize = require('sequelize'),
    chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = new Sequelize(config.postgres);


// Init the express application
var app = require('./config/express')(db);

// Start the app by listening on <port>
app.listen(config.app.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log(config.app.name + ' is listening on port ' + config.app.port);
