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
        .get(movies.list);

    app.route('/movies/:movieId')
        .get(movies.read);

    app.route('/movies/search/:keyword')
        .get(movies.search);
    
    app.route('/movies/explore/:genre/:year')
        .get(movies.genre_year);

    app.route('/movies/explore/:genre/:yfrom/:yto')
        .get(movies.genre_year_range);

    app.route('/movies/genre/stats/:year')
        .get(movies.genre_stats);

    app.route('/movies/genre/stats/:yfrom/:yto')
        .get(movies.genre_stats_range);

    app.route('/actors')
        .put(actors.create)
        .get(actors.list);

    app.route('/actors/:actorId')
        .get(actors.read);

    app.route('/actors/search/:keyword')
        .get(actors.search);

    app.route('/actors/stats/:keyword')
        .get(actors.stats);
};
