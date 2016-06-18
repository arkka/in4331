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
    logging: false
});

/**
 * Index
 */
exports.mongodb = function(req,res) {
    var collection = req.params.collection;
    var id = req.params.id;
    var limit = req.params.limit;


    if(collection == 'movies') {
        var query = "SELECT " +
            "movies.idmovies, " +
            "movies.title, " +
            "movies.number, " +
            "movies.type, " +
            "movies.language, " +
            "movies.location, " +
            "movies.year, " +
            "array_agg(aka_titles.title) AS aka_titles, " +
            "array_agg(aka_titles.location) AS aka_locations, " +
            "array_agg(aka_titles.year) AS aka_years, " +
            "array_agg(genres.genre) AS genres, array_agg(keywords.keyword) AS keywords,  " +
            "array_agg(acted_in.character) AS cast_characters, " +
            "array_agg(acted_in.billing_position) AS cast_billing_positions, " +
            "array_agg(acted_in.idactors) AS cast_idactors " +
            "FROM movies " +
            "LEFT JOIN aka_titles ON movies.idmovies = aka_titles.idmovies " +
            "LEFT JOIN movies_genres ON movies.idmovies = movies_genres.idmovies " +
            "LEFT JOIN genres ON movies_genres.idgenres = genres.idgenres " +
            "LEFT JOIN movies_keywords ON movies.idmovies = movies_keywords.idmovies " +
            "LEFT JOIN keywords ON  movies_keywords.idkeywords = keywords.idkeywords " +
            "LEFT JOIN acted_in ON movies.idmovies = acted_in.idmovies " +
            "LEFT JOIN actors ON acted_in.idactors = actors.idactors " +
            "WHERE movies.idmovies = "+id+" "+
            "GROUP BY movies.idmovies, movies.location, movies.year";

        sequelize.query(query).spread(function(movies, metadata) {

            var movie = movies[0];
            // merge casts information


            var casts = [];
            _.each(movie.cast_characters, function(el, idx, ls) {
                casts[idx] = {
                    character: movie.cast_characters[idx],
                    billing_position: movie.cast_billing_positions[idx],
                    idactors: movie.cast_idactors[idx],

                }

            });

            movie.casts = casts;

            // delete processed cast
            delete movie.cast_characters;
            delete movie.cast_billing_positions;
            delete movie.cast_idactors;

            var aka_titles = [];
            _.each(movie.aka_titles, function(el, idx, ls) {
                aka_titles[idx] = {
                    title: movie.aka_titles[idx],
                    year: movie.aka_years[idx],
                    location: movie.aka_locations[idx]
                }
            });

            aka_titles = _.uniq(aka_titles, function(item, key, a) {
                return item.title;
            });

            movie.aka_titles = aka_titles;

            // delete processed aka_titles
            delete movie.aka_years;
            delete movie.aka_locations;


            // Make it nicer, remove null and sorting..
            movie.keywords = _.uniq(movie.keywords).sort();
            movie.genres = _.uniq(movie.genres).sort();

            // Escape quotes
            /*
            var jsonString = JSON.stringify(movie);
            jsonString = jsonString.replace('"', '\"');
            res.send(jsonString);
            */

            var options = {
                uri: 'http://127.0.1:3100/movies',
                method: 'PUT',
                json: movie
            };



            /*
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(id) // Show the HTML for the Google homepage.


                    id++;

                    if(id<=limit) {
                        // Spawn next process
                        var options2 = {
                            uri: 'http://127.0.1:3000/dump/mongodb/movies/'+id+'/'+limit,
                            method: 'GET'
                        };

                        request(options2);
                    }


                }
            })
            */
            res.send(movie);

            //res.send(jsonminify(movie).replace(/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, "\\n")+"\n");
        });
        
        
    } else {
        
    }

};



