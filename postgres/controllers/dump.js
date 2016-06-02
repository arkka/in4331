'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    apoc = require('apoc'),
    async = require('async'),
    request = require('request'),
    models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

/**
 * Index
 */
exports.neo4j = function(req,res) {

    // Create Movies Node
    // SELECT "idmovies", "title", "year", "number", "location", "language" FROM "movies" AS "Movie" LIMIT 10;

    models.Movie.findAll({
        limit: 1000,
        raw: true
    }).then(function(movies) {
        fs.appendFile('dump/movies.csv', 'idmovies;title; year; number; location; language\r\n', function (err) {
            movies.forEach(function(movie) {
                fs.appendFile('dump/movies.csv', movie.idmovies+';'+movie.title+';'+movie.year+';'+movie.number+';'+movie.location+';'+movie.language+'\r\n', function (err) {

                });
            });
            res.send('OK');
        });
    });





}

/*
CREATE CONSTRAINT ON (m:Movie) ASSERT m.idmovies IS UNIQUE;
CREATE INDEX ON :Movie(title);

USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "file:///Users/arkkadhiratara/Workspaces/in4331/postgres/dump/movies.csv"
AS line FIELDTERMINATOR ';'
CREATE (m:Movie { idmovies: toInt(line.idmovies), title: line.title, line: line.year, line: line.number, location: line.location, language: line.language })
*/
