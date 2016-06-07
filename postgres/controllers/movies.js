'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

var config = require('../config/config')
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.postgres);


/**
 * Index
 */
exports.index = function(req,res) {
    res.jsonp({
        message: "Movie API - Postgres"
    });
}

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
 * Read based on idmovies
 */
exports.read = function(req, res) {
    var keyword = req.params.movieId;

    //queryString = "SELECT movies.*, aka_titles.title AS aka_title FROM movies full join aka_titles on movies.idmovies = aka_titles.idmovies WHERE (movies.idmovies = '"+keyword+"' OR movies.title LIKE '"+keyword+"')";

    var queryString = "SELECT movies.*, aka_titles.title AS aka_title, aka_titles.location AS location," +
        "aka_titles.year AS year FROM movies join aka_titles on movies.idmovies = aka_titles.idmovies WHERE (movies.idmovies = '" + keyword + "')";

    sequelize.query(queryString).spread(function(movies, metadata) {

        res.json({
            keyword: keyword,
            data: {
                movies: movies,
                movies_by_year: _.groupBy(movies, function(num){ return num.year; })
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
 * List
 */
exports.list = function(req, res) {
    var query = "SELECT * FROM  movies AS cuy limit 10";

    sequelize.query(query).spread(function(movies, metadata) {
        //sequelize.query("select * from")
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
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
 * Search
 * SC1: Detailed movie information
 */
exports.search = function(req, res) {
    var keyword = req.params.keyword;
    var queryString;

    if (!isNaN(keyword)){
        //queryString = "SELECT * FROM movies WHERE (idmovies = '"+keyword+"' OR title LIKE '"+keyword+"')";
        queryString = "SELECT movies.*, aka_titles.title AS aka_title FROM movies full join aka_titles on movies.idmovies = aka_titles.idmovies WHERE (movies.idmovies = '"+keyword+"' OR movies.title LIKE '"+keyword+"')";
    }
    else{
        queryString = "SELECT movies.*, aka_titles.title AS aka_title FROM movies  full join aka_titles on movies.idmovies = aka_titles.idmovies WHERE movies.title LIKE '"+keyword+"'";
    }
    //queryString = "SELECT * FROM movies WHERE movies.title LIKE '"+keyword+"'";


    sequelize.query(queryString).spread(function(movies, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json({
            keyword: keyword,
            data: {
                movies: movies,
                movies_by_year: _.groupBy(movies, function(num){ return num.year; })
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


