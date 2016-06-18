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

exports.read = function(req, res) {
    var keyword = req.params.actorId;

    var queryString = "SELECT actors.*, acted_in.character, acted_in.idmovies, acted_in.billing_position, aka_names.name AS aka_name, movies.title, movies.year FROM actors " +
        "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
        "LEFT JOIN acted_in on actors.idactors = acted_in.idactors " +
        "LEFT JOIN movies on acted_in.idmovies = movies.idmovies " +
        "WHERE (actors.idactors = " + keyword + ") " +
        "ORDER BY acted_in.idmovies";

    sequelize.query(queryString).spread(function(actors, metadata) {

        //var aka_name = _.uniq(_.map(actors, function(num){ return num.aka_name}));
        //_.map(actors, function(num){ num.aka_name = aka_name.sort()});
        //var result = actors.uniqueObjects(["character"]);

        res.json({
            keyword: keyword,
            count: actors.length,
            data: {
                actors: actors,
                movies_by_year: _.groupBy(actors, function(num){ return num.year; })
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
    var queryString;

    if (!isNaN(keyword)){
        queryString = "SELECT actors.*, acted_in.character, acted_in.idmovies, acted_in.billing_position, aka_names.name AS aka_name, movies.title, movies.year FROM actors " +
            "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
            "LEFT JOIN acted_in on actors.idactors = acted_in.idactors " +
            "LEFT JOIN movies on acted_in.idmovies = movies.idmovies " +
            "WHERE actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";

    } else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");
        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT actors.*, acted_in.character, acted_in.idmovies, acted_in.billing_position, aka_names.name AS aka_name, movies.title, movies.year FROM actors " +
                "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
                "LEFT JOIN acted_in on actors.idactors = acted_in.idactors "+
                "LEFT JOIN movies on acted_in.idmovies = movies.idmovies "+
                "WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"') OR (actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"') " +
                "OR (actors.fname LIKE '" +arr[0]+ " " + arr[1] + "') OR (actors.lname LIKE '" +arr[0]+ " " + arr[1] + "')";
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

    sequelize.query(queryString).spread(function(actors, metadata) {
        res.json({
            keyword: keyword,
            count: actors.length,
            data: {
                actors: actors,
                movies_by_year: _.groupBy(actors, function(num){ return num.year; })
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