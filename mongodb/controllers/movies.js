'use strict';

/**
 * Module dependencies.

    Notes: ngecek product category & brand harus pake synchronous function
 */
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Movie = mongoose.model('Movie'),
    chalk = require('chalk');

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
        if(err) res.json({product: null, success: false});
        else res.json({movie: movie, success: false});
    });
};

/**
 * Read
 */
exports.read = function(req, res) {
    Movie.findById(req.params.movieId, function(err, movie){
        if(err || !movie) res.json({product: null, success: false});
        else res.json({movie: movie, success: true});
    });
};

/**
 * Update
 */
exports.update = function(req, res) {
    Movie.findByIdAndUpdate(req.params.movieId,  { $set: req.body.movie }, function(err, movie){
        if(err || !movie) res.json({product: null, success: false});
        else res.json({movie: movie, success: true});
    });
};

/**
 * List
 */
exports.list = function(req, res) {
    Movie.find({}, function(err, movies){
        if(err || !movies) res.json({movies: null, success: false});
        else res.json({movies: movies, success: true});
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
        if(err || !movies ) res.json({movies: null, success: false});
        else res.json({
            keyword: keyword,
            movies: movies,
            success: true
        });
    });
};


