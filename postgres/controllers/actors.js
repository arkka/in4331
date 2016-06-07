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

Array.prototype.uniqueObjects = function (props) {
    function compare(a, b) {
        var prop;
        if (props) {
            for (var j = 0; j < props.length; j++) {
                prop = props[j];
                if (a[prop] != b[prop]) {
                    return false;
                }
            }
        } else {
            for (prop in a) {
                if (a[prop] != b[prop]) {
                    return false;
                }
            }

        }
        return true;
    }
    return this.filter(function (item, index, list) {
        for (var i = 0; i < index; i++) {
            if (compare(item, list[i])) {
                return false;
            }
        }
        return true;
    });
};

//exports.read = function(req, res) {
//    var keyword = req.params.actorId;
//
//    var queryString = "SELECT movies.*, aka_titles.title AS aka_title, aka_titles.location AS location, aka_titles.year AS year, aka_titles.idaka_titles AS idaka_title, " +
//        "genres.genre AS genres, keywords.keyword AS keywords, " +
//        "COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS casts " +
//        "FROM movies " +
//        "LEFT JOIN aka_titles ON movies.idmovies = aka_titles.idmovies " +
//        "LEFT JOIN movies_genres ON movies.idmovies = movies_genres.idmovies " +
//        "LEFT JOIN genres ON movies_genres.idgenres = genres.idgenres " +
//        "LEFT JOIN movies_keywords ON movies.idmovies = movies_keywords.idmovies " +
//        "LEFT JOIN keywords ON  movies_keywords.idkeywords = keywords.idkeywords " +
//        "LEFT JOIN acted_in ON movies.idmovies = acted_in.idmovies " +
//        "LEFT JOIN actors ON  acted_in.idactors = actors.idactors " +
//        "WHERE (movies.idmovies = '" + keyword + "')";
//
//    sequelize.query(queryString).spread(function(movies, metadata) {
//
//        var keywords = _.uniq(_.map(movies, function(num){ return num.keywords}));
//        var genres = _.uniq(_.map(movies, function(num){ return num.genres}));
//        var casts = _.uniq(_.map(movies, function(num){ return num.casts}));
//
//        _.map(movies, function(num){ num.keywords = keywords.sort()});
//        _.map(movies, function(num){ num.genres = genres.sort()});
//        _.map(movies, function(num){ num.casts = casts.sort()});
//
//        var result = movies.uniqueObjects(["idaka_title"]);
//
//        res.json({
//            keyword: keyword,
//            count: result.length,
//            data: {
//                movies: result,
//                movies_by_year: _.groupBy(result, function(num){ return num.year; })
//            },
//            success: true
//        });
//        // Results will be an empty array and metadata will contain the number of affected rows.
//    });
//
//};


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
    var queryString;

    if (!isNaN(keyword)){
        //queryString = "SELECT * FROM movies WHERE (idmovies = '"+keyword+"' OR title LIKE '"+keyword+"')";
        queryString = "SELECT distinct actors.*, aka_names.name AS aka_name, movies.title, movies.year FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE (actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"')";
    }else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");
        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT distinct actors.*, aka_names.name AS aka_name, movies.title, movies.year FROM actors join aka_names on actors.idactors = aka_names.idactors" +
                " join acted_in on actors.idactors = acted_in.idactors"+
                " join movies on acted_in.idmovies = movies.idmovies"+
                " WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"')OR(actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"')";
        }
    }
    else
    {
        //queryString = "SELECT * FROM movies WHERE movies.title LIKE '"+keyword+"'";
        //SELECT actors.*, aka_names.name AS aka_name FROM actors full join aka_names on actors.idactors = aka_names.idactors WHERE (actors.fname LIKE 'Lucienne' OR actors.lname LIKE 'Lucienne')
        //queryString = "SELECT actors.*, aka_names.name AS aka_name FROM actors  full join aka_names on actors.idactors = aka_names.idactors WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
        queryString = "SELECT distinct actors.*, aka_names.name AS aka_name, movies.title, movies.year FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
    }

    sequelize.query(queryString).spread(function(results, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json(results);
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
        //queryString = "SELECT * FROM movies WHERE (idmovies = '"+keyword+"' OR title LIKE '"+keyword+"')";
        queryString = "SELECT distinct actors.idactors, actors.fname,actors.lname, count(movies.idmovies) AS Movie_count FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE (actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"')"+
            " GRoup by actors.idactors";
    }else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");
        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT distinct actors.idactors, actors.fname,actors.lname, count(movies.idmovies) AS Movie_count FROM actors join aka_names on actors.idactors = aka_names.idactors" +
                " join acted_in on actors.idactors = acted_in.idactors"+
                " join movies on acted_in.idmovies = movies.idmovies"+
                " WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"')OR(actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"')"+
                " GRoup by actors.idactors";
        }
    }
    else
    {
        //queryString = "SELECT * FROM movies WHERE movies.title LIKE '"+keyword+"'";
        //SELECT actors.*, aka_names.name AS aka_name FROM actors full join aka_names on actors.idactors = aka_names.idactors WHERE (actors.fname LIKE 'Lucienne' OR actors.lname LIKE 'Lucienne')
        //queryString = "SELECT actors.*, aka_names.name AS aka_name FROM actors  full join aka_names on actors.idactors = aka_names.idactors WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
        queryString = "SELECT distinct actors.idactors, actors.fname,actors.lname, count(movies.idmovies) AS Movie_count FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'"+
            " GRoup by actors.idactors";
    }

    sequelize.query(queryString).spread(function(results, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json(results);
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};