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
var sequelize = new Sequelize(config.postgres);
sequelize.authenticate().then(function(errors) { console.log(errors) });

// Init the express application
var app = require('./config/express')(sequelize);

// Start the app by listening on <port>
app.listen(config.app.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log(config.app.name + ' is listening on port ' + config.app.port);
