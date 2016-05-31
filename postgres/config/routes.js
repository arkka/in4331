'use strict';

/**
 * Module dependencies.
 */
module.exports = function(app) {
    var movies = require('../controllers/movies');
    var dump = require('../controllers/dump');

    app.route('/')
        .get(movies.index);

    app.route('/movies')
        .put(movies.create)
        .get(movies.list);

    /*

    var actors = require('../controllers/actors');





    app.route('/movies/search/:keyword')
        .get(movies.search);

    app.route('/movies/explore/:genre')
        .get(movies.genre)

    app.route('/movies/explore/:genre/:yfrom/:yto')
        .get(movies.genre_year)

    app.route('/movies/:movieId')
        .get(movies.read)
        .post(movies.update);


    app.route('/actors')
        .put(actors.create)
        .get(actors.list)
        .get(actors.read);

    app.route('/actors/search/:keyword')
        .get(actors.search);

    app.route('/actors/stats/:keyword')
        .get(actors.stats);

    app.route('/actors/:actorId')
        .get(actors.read)
        .post(actors.update);

        */

    app.route('/dump/neo4j')
        .get(dump.neo4j);
};
