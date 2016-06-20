'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore'),
    jsonminify = require("jsonminify"),
    request = require('request');

var config = require('../config/config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('wdm','','', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true
});

/**
 * Index
 */
exports.mongodb = function(req,res) {
    var movieId = req.params.movieId;
    var query = "SELECT movies.idmovies, movies.title, movies.number, movies.type, movies.language, aka_titles.title AS aka_title, COALESCE(aka_titles.location,movies.location) AS movie_location, COALESCE(aka_titles.year,movies.year) AS movie_year, array_agg(genres.genre) AS genres, array_agg(keywords.keyword) AS keywords, array_agg(COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ')) AS castname, array_agg(acted_in.character) AS cast_characters, array_agg(acted_in.billing_position) AS cast_billing_positions, array_agg(acted_in.idactors) AS cast_actors FROM movies LEFT JOIN aka_titles ON movies.idmovies = aka_titles.idmovies LEFT JOIN movies_genres ON movies.idmovies = movies_genres.idmovies LEFT JOIN genres ON movies_genres.idgenres = genres.idgenres LEFT JOIN movies_keywords ON movies.idmovies = movies_keywords.idmovies LEFT JOIN keywords ON  movies_keywords.idkeywords = keywords.idkeywords LEFT JOIN acted_in ON movies.idmovies = acted_in.idmovies LEFT JOIN actors ON acted_in.idactors = actors.idactors WHERE movies.idmovies = '"+movieId+"' GROUP BY movies.idmovies, aka_title, movie_location, movie_year ORDER BY movies.title";


    sequelize.query(query).spread(function(movies, metadata) {
        _.map(movies, function(num){ num.keywords = _.uniq(num.keywords).sort()});
        _.map(movies, function(num){ num.genres = _.uniq(num.genres).sort()});

        _.map(movies, function(movie){
            var casts = [];

            _.each(movie.castname, function(el, idx, ls) {
                casts[idx] = {
                    idactors: movie.cast_actors[idx],
                    name: movie.castname[idx],
                    character: movie.cast_characters[idx],
                    billing_position: movie.cast_billing_positions[idx]
                }

            });

            var uniques = _.map(_.groupBy(casts,function(doc){
                if (doc.character!= null) {
                    return doc.character;
                }
                else{
                    return doc.idactors;
                }
            }),function(grouped){
                return grouped[0];
            });

            var uniqsort = _.sortBy(uniques, function(cast) { return cast.idactors; });

            movie.casts = uniqsort;

            movie.year = movie.movie_year;
            movie.location = movie.movie_location;
            delete movie.movie_year;
            delete movie.movie_location;

            // delete processed cast
            delete movie.castname;
            delete movie.cast_characters;
            delete movie.cast_billing_positions;
            delete movie.cast_actors;


            // SEND CREATE PUT TO MONGODB
            var options = {
                uri: 'http://127.0.1:3100/movies',
                method: 'PUT',
                json: movie
            };

            request(options);
            res.send("IMPORTED TO MONGODB: " + movie.title);
        });






    });
        


};



