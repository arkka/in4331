'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

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
 * Read
 */
exports.read = function(req, res) {
    /*
    Movie.findById(req.params.movieId, function(err, movie){
        if(err || !movie) res.json({data: null, success: false});
        else res.json({
            data: {
                movie: movie,
            },
            success: true
        });
    });
    */
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
    models.Movie.findAll({
        //attributes: ['title']
        limit: 10
    }).then(function(movies) {
        if(!movies) res.json({ data: null, success: false });
        else res.json({
            data: {
                movies: movies,
            },
            success: true
        });
    })

};

/**
 * Search
 * SC1: Detailed movie information
 */
exports.search = function(req, res) {
    /*
    sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
        .then(function(users) {
            // We don't need spread here, since only the results will be returned for select queries
        })
        */
    /*
    // Get variable for url parameter: keyword
    var keyword = req.params.keyword;

    var query;

    // To differentiate whether the keyword is ObjectId or word
    if( keyword.length >= 12) {
        query = Movie.find({ $or: [
            { _id  : new ObjectId(keyword) },
            { title : new RegExp(keyword, 'i')},
            { aka_titles: { "$elemMatch" : { title: new RegExp(keyword, 'i') }}}
        ]});
    } else {
        query = Movie.find({ $or: [
            { title : new RegExp(keyword, 'i')},
            { aka_titles: { "$elemMatch" : { title: new RegExp(keyword, 'i') }}}
        ]});
    }

    query.exec(function(err, movies){
        if(err || !movies ) res.json({data: null, success: false});
        else {
            res.json({
                keyword: keyword,
                data: {
                    movies: movies,
                    movies_by_year: _.groupBy(movies, function(num){ return num.year; })
                },
                success: true
            });
        }
    });
    */
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


