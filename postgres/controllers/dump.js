'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

/**
 * Index
 */
exports.neo4j = function(req,res) {
    var dumpQuery = "";

    // SELECT "idmovies", "title", "year", "number", "location", "language" FROM "movies" AS "Movie" LIMIT 10;
    models.Movie.findAll({
        raw: true
    }).then(function(movies) {
        movies.forEach(function(movie) {
            let data = JSON.stringify(movie);

            // Remove quotes on field json
            data = data.replace(/"(\w+)"\s*:/g, '$1:');

            // Generate Cypher query
            dumpQuery += "CREATE (n"+movie.idmovies+":Movie "+ data +") \n";
        });

        res.send(dumpQuery);
    });



}



