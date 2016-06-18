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

//var queryString = "SELECT movies.*, aka_titles.title AS aka_title, COALESCE(aka_titles.location,movies.location) AS location, COALESCE(aka_titles.year,movies.year) AS year, aka_titles.idaka_titles AS idaka_title, " +
//"genres.genre AS genres, keywords.keyword AS keywords, " +
//"COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS casts " +
//"FROM movies " +
//"LEFT JOIN aka_titles ON movies.idmovies = aka_titles.idmovies " +
//"LEFT JOIN movies_genres ON movies.idmovies = movies_genres.idmovies " +
//"LEFT JOIN genres ON movies_genres.idgenres = genres.idgenres " +
//"LEFT JOIN movies_keywords ON movies.idmovies = movies_keywords.idmovies " +
//"LEFT JOIN keywords ON  movies_keywords.idkeywords = keywords.idkeywords " +
//"LEFT JOIN acted_in ON movies.idmovies = acted_in.idmovies " +
//"LEFT JOIN actors ON acted_in.idactors = actors.idactors ";

var queryString = "SELECT movies.*, aka_titles.title AS aka_title, COALESCE(aka_titles.location,movies.location) AS location, COALESCE(aka_titles.year,movies.year) AS year, aka_titles.idaka_titles AS idaka_title, " +
    "genres.genre AS genres, keywords.keyword AS keywords, " +
    "COALESCE(actors.fname, ' ') || COALESCE(actors.mname, ' ') || COALESCE(actors.lname, ' ') AS casts " +
    "FROM movies " +
    "LEFT JOIN aka_titles ON movies.idmovies = aka_titles.idmovies " +
    "LEFT JOIN movies_genres ON movies.idmovies = movies_genres.idmovies " +
    "LEFT JOIN genres ON movies_genres.idgenres = genres.idgenres " +
    "LEFT JOIN movies_keywords ON movies.idmovies = movies_keywords.idmovies " +
    "LEFT JOIN keywords ON  movies_keywords.idkeywords = keywords.idkeywords " +
    "LEFT JOIN acted_in ON movies.idmovies = acted_in.idmovies " +
    "LEFT JOIN actors ON acted_in.idactors = actors.idactors ";

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
    var query = "SELECT * FROM movies limit 10";

    sequelize.query(query).spread(function(movies, metadata) {
        res.json({
            data: {
                movies: movies,
                movies_by_year: _.groupBy(movies, function(num){ return num.year; })
            },
            success: true
        });
    });
};

/**
 * Read based on idmovies
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
    var keyword = req.params.movieId;

    var query = queryString + "WHERE (movies.idmovies = '" + keyword + "')";

    sequelize.query(query).spread(function(movies, metadata) {

        var keywords = _.uniq(_.map(movies, function(num){ return num.keywords}));
        var genres = _.uniq(_.map(movies, function(num){ return num.genres}));
        var casts = _.uniq(_.map(movies, function(num){ return num.casts}));

        _.map(movies, function(num){ num.keywords = keywords.sort()});
        _.map(movies, function(num){ num.genres = genres.sort()});
        _.map(movies, function(num){ num.casts = casts.sort()});

        // TODO: Separate null for idaka_title
        var result = movies.uniqueObjects(["idaka_title"]);

        res.json({
            keyword: keyword,
            count: result.length,
            data: {
                movies: result,
                movies_by_year: _.groupBy(result, function(num){ return num.year; })
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
 * Search
 * SC1: Detailed movie information
 */
exports.search = function(req, res) {
    var keyword = req.params.keyword;
    var query;

    if (!isNaN(keyword))
    {
        query = queryString + "WHERE (movies.idmovies = '" + keyword + "')";
    }
    else
    {
        // line below for partial matching
        //query = queryString + "WHERE movies.title LIKE '%" + keyword + "%' OR aka_titles.title LIKE '%" + keyword + "%'";

        // line below for exact matching
        query = queryString + "WHERE movies.title LIKE '" + keyword + "' OR aka_titles.title LIKE '" + keyword + "'";


        // line below for ignore case (slow performance)
        //query = queryString + "WHERE lower(movies.title) LIKE lower('%" + keyword + "%') OR lower(aka_titles.title) LIKE lower('%" + keyword + "%')";
    }

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

        res.json({
            keyword: keyword,
            count: result.length,
            data: {
                movies: result,
                movies_by_year: _.groupBy(result, function(num){ return num.year; })
            },
            success: true
        });
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};


/**
 * Genre
 * SC4: Detailed movie information
 */
// TODO: Check check check with real data
// TODO: Implement year range filter
exports.genre = function(req, res) {
    /*
    Movie.find({ genres: req.params.genre })
        .sort({year: -1, title: 1})
        .populate('casts.actor')
        .exec(function(err, movies){
        if(err || !movies) res.json({data: null, success: false});
        else res.json({
            data: {
                movies: movies
            },
            success: true
        });
    });
    */
};

/**
 * Genre
 * SC4: Detailed movie information
 */
// TODO: Check check check with real data
// TODO: Implement year range filter
exports.genre_year = function(req, res) {
    /*
    Movie.find({ genres: req.params.genre })
        .sort({year: -1, title: 1})
        .populate('casts.actor')
        .exec(function(err, movies){
            if(err || !movies) res.json({data: null, success: false});
            else res.json({
                data: {
                    movies: movies
                },
                success: true
            });
        });
        */
};


