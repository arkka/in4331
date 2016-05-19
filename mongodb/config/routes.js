'use strict';

/**
 * Module dependencies.
 */
module.exports = function(app) {
    var movies = require('../controllers/movies');
    var actors = require('../controllers/actors');

    app.route('/')
        .get(movies.index);

    app.route('/movies')
        .put(movies.create)
        .get(movies.list)
        .get(movies.read);

    app.route('/movies/search/:keyword')
        .get(movies.search);

    app.route('/movies/:movieId')
        .get(movies.read)
        .post(movies.update);


    app.route('/actors')
        .put(actors.create)
        .get(actors.list)
        .get(actors.read);

    app.route('/actors/search/:keyword')
        .get(actors.search);

    app.route('/actors/:actorId')
        .get(actors.read)
        .post(actors.update);

};
