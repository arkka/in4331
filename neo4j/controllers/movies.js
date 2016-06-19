'use strict';

/**
 * Module dependencies.
 */
var apoc = require('apoc'),
    chalk = require('chalk'),
    _ = require('underscore');

/**
 * Index
 */
exports.index = function(req,res) {
    res.jsonp({
        message: "Movie API - Neo4j"
    });
}

/**
 * Create
 */
exports.create = function(req, res) {
    var query = apoc.query(" CREATE (a:Movie { title: '"+ req.body.movie.title +"' })")

    query.exec().then(function (result) {
        res.json({
            success: true,
            data: {
                movie: result
            }
        });
    }, function (err) {
        res.json({
            error: err,
            success: false
        });
    });

};

/**
 * Read
 */
exports.read = function(req, res) {
    var query = apoc.query( "Match (m:Movie)-[:HAS_AKATITLES]->(aka_title:Aka_titles), " +
        "m-[:HAS_KEYWORD]->(keyword:Keyword), " +
        "m-[:HAS_GENRE]->(genre:Genre), " +
        "m-[:IN_SERIES]->(series:Series), " +
        "m<-[:ACTED_IN]-(actors:Actors), "+
        "return a,aka_title,series,actors")

    query.exec().then(function (result) {
        res.json({
            success: true,
            data: {
                movie: result
            }
        });
    }, function (err) {
        res.json({
            error: err,
            success: false
        });
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

};

/**
 * Search
 * SC1: Detailed movie information
 */
exports.search = function(req, res) {
    var keyword = req.params.keyword;
    var parameter;

    if (!isNaN(keyword)){
        parameter = "m.title =~ '.*"+keyword+".*'"+" OR m.idmovies ="+keyword;
    }
    else parameter = "m.title =~ '.*"+keyword+".*'";
    var query = apoc.query( "Match (m:Movie {"+parameter+"})-[:HAS_AKATITLES]->(aka_title:Aka_titles), " +
        "m-[:HAS_KEYWORD]->(keyword:Keyword), " +
        "m-[:HAS_GENRE]->(genre:Genre), " +
        "m-[:IN_SERIES]->(series:Series), " +
        "m<-[:ACTED_IN]-(actors:Actors), "+
        "return m,aka_title,series,actors group by m")

    query.exec().then(function (result) {
        res.json({
            success: true,
            data: {
                movie: result
            }
        });
    }, function (err) {
        res.json({
            error: err,
            success: false
        });
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


