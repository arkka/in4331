'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

var config = require('../config/config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.postgres);

/**
 * Index
 */
exports.mongodb = function(req,res) {
    var collection = req.params.collection;
    var id = req.params.id;

    console.log(collection);
    if(collection == 'movies') {
        var query = "SELECT movies.*, aka_titles.title AS aka_title, aka_titles.location AS location, aka_titles.year AS year, aka_titles.idaka_titles AS idaka_title, " +
            "genres.genre AS genres, keywords.keyword AS keywords, " +
            "COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS casts " +
            "FROM movies " +
            "LEFT JOIN aka_titles ON movies.idmovies = aka_titles.idmovies " +
            "LEFT JOIN movies_genres ON movies.idmovies = movies_genres.idmovies " +
            "LEFT JOIN genres ON movies_genres.idgenres = genres.idgenres " +
            "LEFT JOIN movies_keywords ON movies.idmovies = movies_keywords.idmovies " +
            "LEFT JOIN keywords ON  movies_keywords.idkeywords = keywords.idkeywords " +
            "LEFT JOIN acted_in ON movies.idmovies = acted_in.idmovies " +
            "LEFT JOIN actors ON acted_in.idactors = actors.idactors " +
            "WHERE movies.idmovies = "+id+" "+
            "LIMIT 1";
        sequelize.query(query).spread(function(movies, metadata) {
            var keywords = _.uniq(_.map(movies, function(num){ return num.keywords}));
            var genres = _.uniq(_.map(movies, function(num){ return num.genres}));
            var casts = _.uniq(_.map(movies, function(num){ return num.casts}));

            // TODO: idmovie as keys and different value for partial match
            _.map(movies, function(num){ num.keywords = keywords.sort()});
            _.map(movies, function(num){ num.genres = genres.sort()});
            _.map(movies, function(num){ num.casts = casts.sort()});

            // TODO: Separate null for idaka_title
            var result = movies.uniqueObjects(["idaka_title"]);
            res.jsonp({
                message: "Migration to MongoDB",
                data: "result"
            });
        });
        
        
    } else {
        
    }

};



