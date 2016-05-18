'use strict';

/**
 * Module dependencies.
 */
module.exports = function(app) {
    var movies = require('../controllers/movies');

        app.route('/')
            .get(movies.index);

        app.route('/movies')
            .put(movies.create)
            .get(movies.list)
            .get(movies.read);

        app.route('/movies/:movieId')
            .get(movies.read)
            .post(movies.update);


};
