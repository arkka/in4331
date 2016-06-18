/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    cluster = require('cluster'),
    http = require('http'),
    numCPUs = require('os').cpus().length;

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
   var db = mongoose.connect(config.mongodb, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    } else {
        console.log("MongoDB : "+chalk.green('Connected'));
    }
});

// Init the express application
var app = require('./config/express')(db);

// Start the app by listening on <port>
if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on( 'online', function( worker ) {
        console.log( 'Worker ' + worker.process.pid + ' is online.' );
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

} else {
    app.listen(config.app.port);
}

// Expose app
exports = module.exports = app;

// Logging initialization
console.log(config.app.name + ' is listening on port ' + config.app.port);
