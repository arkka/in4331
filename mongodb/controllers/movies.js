'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Movie = mongoose.model('Movie'),
    chalk = require('chalk'),
    _ = require('underscore');

/**
 * Index
 */
exports.index = function(req,res) {
    res.jsonp({
        message: "Movie API - MongoDB"
    });
}

/**
 * Create
 */
exports.create = function(req, res) {
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
};

/**
 * Read
 */
exports.read = function(req, res) {
    Movie.findById(req.params.movieId, function(err, movie){
        if(err || !movie) res.json({data: null, success: false});
        else res.json({
            data: {
                movie: movie,
            },
            success: true
        });
    });
};

/**
 * Update
 */
exports.update = function(req, res) {
    Movie.findByIdAndUpdate(req.params.movieId,  { $set: req.body.movie }, function(err, movie){
        if(err || !movie) res.json({data: null, success: false});
        else res.json({
            data: {
                movie: movie,
            },
            success: true});
    });
};

/**
 * List
 */
exports.list = function(req, res) {
    Movie.find({}, function(err, movies){
        if(err || !movies) res.json({data: null, success: false});
        else res.json({
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

    var query;

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
};


/**
 * Genre
 * SC4: Detailed movie information
 */
// TODO: Check check check with real data
// TODO: Implement year range filter
exports.genre = function(req, res) {
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
};


