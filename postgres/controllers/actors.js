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

        // Handling name more than 2 words (example: Stefanie von Poser, with von Poser being the last name)
        if (arr.length > 2) {
            for (var i = 2; i < arr.length; i++){
                arr[1] += " " + arr[i];
            }
        }

        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT actors.*, acted_in.character, acted_in.idmovies, acted_in.billing_position, aka_names.name AS aka_name, movies.title, movies.year FROM actors " +
                "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
                "LEFT JOIN acted_in on actors.idactors = acted_in.idactors " +
                "LEFT JOIN movies on acted_in.idmovies = movies.idmovies " +
                "WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"') OR (actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"') " +
                "OR (actors.fname LIKE '" +arr[0]+ " " + arr[1] + "') OR (actors.lname LIKE '" +arr[0]+ " " + arr[1] + "')";
        }
    }
    else
    {
        queryString = "SELECT actors.*, acted_in.character, acted_in.idmovies, acted_in.billing_position, aka_names.name AS aka_name, movies.title, movies.year FROM actors " +
            "LEFT JOIN aka_names on actors.idactors = aka_names.idactors " +
            "LEFT JOIN acted_in on actors.idactors = acted_in.idactors " +
            "LEFT JOIN movies on acted_in.idmovies = movies.idmovies " +
            "WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
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
        queryString = "SELECT COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS name, " +
            "COUNT(DISTINCT acted_in.idmovies) as num_movies " +
            "FROM acted_in " +
            "LEFT JOIN actors on actors.idactors = acted_in.idactors " +
            "WHERE actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"' " +
            "GROUP BY actors.idactors";

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
                "WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"') OR (actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"') " +
                "OR (actors.fname LIKE '" +arr[0]+ " " + arr[1] + "') OR (actors.lname LIKE '" +arr[0]+ " " + arr[1] + "') " +
                "GROUP BY actors.idactors";
        }
    }
    else
    {
      queryString = "SELECT COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS name, " +
            "COUNT(DISTINCT acted_in.idmovies) as num_movies " +
            "FROM acted_in " +
            "LEFT JOIN actors on actors.idactors = acted_in.idactors " +
            "WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"' " +
            "Group by actors.idactors";
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