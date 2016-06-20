/**
 * Created by sukmawicaksana on 6/2/2016.
 */
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
exports.index = function(req,res) {
    res.jsonp({
        message: "Movie API - Postgres"
    });
};

/**
 * Create
 */
exports.create = function(req, res) {
    /*
    var movie = new Movie(req.body.movie);
    movie.save(function(err) {
        if(err) res.json({data: null, success: false});
        else res.json({
            data: {
                movie: movie,
            },
            success: false
        });
    });
    */
};

/**
 * List
 */
exports.list = function(req, res) {
    var query = "SELECT * FROM actors limit 10";

    sequelize.query(query).spread(function(actors, metadata) {
        res.json({
            data: {
                actors: actors
            },
            success: true
        });
    });
};

/**
 * Read based on idactors
 */
// TODO: combine multiple genres, keywords, actors, to one result
// TODO: series and actors acted in

exports.read = function(req, res) {
    var keyword = req.params.actorId;

    var queryString = "SELECT actors.idactors, COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS full_name, " +
        "array_agg(aka_names.name) AS aka_names, actors.gender, actors.number, array_agg(acted_in.idmovies) as movie_id, array_agg(movies.title) AS movie_title, " +
        "array_agg(movies.year) AS movie_year, array_agg(acted_in.character) AS movie_character " +
        "FROM actors " +
        "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
        "LEFT JOIN acted_in on actors.idactors = acted_in.idactors " +
        "LEFT JOIN movies on acted_in.idmovies = movies.idmovies " +
        "WHERE actors.idactors = " + keyword + " " +
        "GROUP BY actors.idactors, full_name, actors.gender, actors.number";

    sequelize.query(queryString).spread(function(actors, metadata) {

        _.map(actors, function(num){ num.aka_names = _.uniq(num.aka_names.sort())});

        _.map(actors, function(actor){
            var movies = [];

            _.each(actor.movie_id, function(el, idx, ls) {
                movies[idx] = {
                    idmovies: actor.movie_id[idx],
                    title: actor.movie_title[idx],
                    year: actor.movie_year[idx],
                    character: actor.movie_character[idx]
                }

            });

            var uniques = _.map(_.groupBy(movies,function(doc){
                if (doc.character!= null) {
                    return doc.character;
                }
                else{
                    return doc.idmovies;
                }
            }),function(grouped){
                return grouped[0];
            });

            var uniqsort = _.sortBy(uniques, function(movie) { return movie.idmovies; });

            actor.movies = uniqsort;

            // delete processed cast
            delete actor.movie_id;
            delete actor.movie_title;
            delete actor.movie_year;
            delete actor.movie_character;

            actor.movies_by_year =  _.groupBy(actor.movies, function(num){ return num.year; });
        });

        res.json({
            keyword: keyword,
            count: actors.length,
            data: {
                actors: actors
            },
            success: true
        });
        // Results will be an empty array and metadata will contain the number of affected rows.
    });

};


/**
 * Update
 */
exports.update = function(req, res) {
    /*
    Movie.findByIdAndUpdate(req.params.movieId,  { $set: req.body.movie }, function(err, movie){
        if(err || !movie) res.json({data: null, success: false});
        else res.json({
            data: {
                movie: movie,
            },
            success: true});
    });
    */

};


/**
 *  SC2 - Detailed actors information
 *
 * */

exports.search = function (req, res){
    var keyword = req.params.keyword;

    var queryString = "SELECT actors.idactors, COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS full_name, " +
        "array_agg(aka_names.name) AS aka_names, actors.gender, actors.number, array_agg(acted_in.idmovies) as movie_id, array_agg(movies.title) AS movie_title, " +
        "array_agg(movies.year) AS movie_year, array_agg(acted_in.character) AS movie_character " +
        "FROM actors " +
        "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
        "LEFT JOIN acted_in on actors.idactors = acted_in.idactors " +
        "LEFT JOIN movies on acted_in.idmovies = movies.idmovies ";

    var query;

    if (!isNaN(keyword)){
        query = queryString +
            "WHERE actors.idactors = '"+keyword+"' OR lower(actors.fname) LIKE lower('%"+keyword+"%') OR lower(actors.lname) LIKE lower('%"+keyword+"%') " +
            "GROUP BY actors.idactors, full_name, actors.gender, actors.number ";

    } else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");

        // Handling name more than 2 words (example: Stefanie von Poser, with von Poser being the last name)
        if (arr.length > 2) {
            for (var i = 2; i < arr.length; i++){
                arr[1] += " " + arr[i];
            }
        }

        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            query = queryString +
                "WHERE (lower(actors.fname) LIKE lower('%"+arr[0]+"%') AND lower(actors.lname) LIKE lower('%"+arr[1]+"%')) OR (lower(actors.fname) LIKE lower('%"+arr[1]+"%') AND lower(actors.lname) LIKE lower('%"+arr[0]+"%')) " +
                "OR (lower(actors.fname) LIKE lower('%" +arr[0]+ " " + arr[1] + "%')) OR (lower(actors.lname) LIKE lower('%" +arr[0]+ " " + arr[1] + "%')) " +
                "GROUP BY actors.idactors, full_name, actors.gender, actors.number ";
        }
    }
    else
    {
        query = queryString +
            "WHERE lower(actors.fname) LIKE lower('%"+keyword+"%') OR lower(actors.lname) LIKE lower('%"+keyword+"%') " +
            "GROUP BY actors.idactors, full_name, actors.gender, actors.number ";
    }

    sequelize.query(query).spread(function(actors, metadata) {

        _.map(actors, function(num){ num.aka_names = _.uniq(num.aka_names.sort())});

        _.map(actors, function(actor){
            var movies = [];

            _.each(actor.movie_id, function(el, idx, ls) {
                movies[idx] = {
                    idmovies: actor.movie_id[idx],
                    title: actor.movie_title[idx],
                    year: actor.movie_year[idx],
                    character: actor.movie_character[idx]
                }

            });

            var uniques = _.map(_.groupBy(movies,function(doc){
                if (doc.character!= null) {
                    return doc.character;
                }
                else{
                    return doc.idmovies;
                }
            }),function(grouped){
                return grouped[0];
            });

            var uniqsort = _.sortBy(uniques, function(movie) { return movie.idmovies; });

            actor.movies = uniqsort;

            // delete processed cast
            delete actor.movie_id;
            delete actor.movie_title;
            delete actor.movie_year;
            delete actor.movie_character;

            actor.movies_by_year =  _.groupBy(actor.movies, function(num){ return num.year; });
        });

        res.json({
            keyword: keyword,
            count: actors.length,
            data: {
                actors: actors
            },
            success: true
        });
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};


/**
 *  SC3 - Short actors statics
 *
 * */

exports.stats = function (req, res){
    var keyword = req.params.keyword;
    var queryString;

    if (!isNaN(keyword)){
        queryString = "SELECT COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS name, " +
            "COUNT(DISTINCT acted_in.idmovies) as num_movies " +
            "FROM acted_in " +
            "LEFT JOIN actors on actors.idactors = acted_in.idactors " +
            "WHERE actors.idactors = '"+keyword+"' OR lower(actors.fname) LIKE lower('"+keyword+"') OR lower(actors.lname) LIKE lower('"+keyword+"') " +
            "GROUP BY actors.idactors " +
            "ORDER BY actors.fname";

    } else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");

        // Handling name more than 2 words (example: Stefanie von Poser, with von Poser being the last name)
        if (arr.length > 2) {
            for (var i = 2; i < arr.length; i++){
                arr[1] += " " + arr[i];
            }
        }

        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS name, " +
                "COUNT(DISTINCT acted_in.idmovies) as num_movies " +
                "FROM acted_in " +
                "LEFT JOIN actors on actors.idactors = acted_in.idactors " +
                "WHERE (lower(actors.fname) LIKE lower('"+arr[0]+"') AND lower(actors.lname) LIKE lower('"+arr[1]+"')) OR (lower(actors.fname) LIKE lower('"+arr[1]+"') AND lower(actors.lname) LIKE lower('"+arr[0]+"')) " +
                "OR (lower(actors.fname) LIKE lower('" +arr[0]+ " " + arr[1] + "')) OR (lower(actors.lname) LIKE lower('" +arr[0]+ " " + arr[1] + "')) " +
                "GROUP BY actors.idactors " +
                "ORDER BY actors.fname";
        }
    }
    else
    {
      queryString = "SELECT COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS name, " +
            "COUNT(DISTINCT acted_in.idmovies) as num_movies " +
            "FROM acted_in " +
            "LEFT JOIN actors on actors.idactors = acted_in.idactors " +
            "WHERE lower(actors.fname) LIKE lower('"+keyword+"') OR lower(actors.lname) LIKE lower('"+keyword+"') " +
            "GROUP BY actors.idactors " +
            "ORDER BY actors.fname";
    }

    sequelize.query(queryString).spread(function(actors, metadata) {
        res.json({
            keyword: keyword,
            count: actors.length,
            data: {
                actors: actors
            },
            success: true
        });
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};