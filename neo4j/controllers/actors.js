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
    /*
     var actor = new Actor(req.body.actor);
     actor.save(function(err) {
     if(err) res.json({data: null, success: false});
     else res.json({
     data: {
     actor: actor,
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
     Actor.findById(req.params.actorId, function(err, actor){
     if(err || !actor) res.json({data: null, success: false});
     else res.json({
     data: {
     actor: actor,
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
     Actor.findByIdAndUpdate(req.params.actorId,  { $set: req.body.actor }, function(err, actor){
     if(err || !actor) res.json({data: null, success: false});
     else res.json({
     data: {
     actor: actor,
     },
     success: true});
     });
     */
};

/**
 * List
 */
exports.list = function(req, res) {
    /*
     Actor.find({}, function(err, actors){
     if(err || !actors) res.json({data: null, success: false});
     else res.json({
     data: {
     actors: actors
     },
     success: true
     });
     });
     */
};

/**
 * Search
 * SC2: Detailed actor information
 */
exports.search = function(req, res) {
    var keyword = req.params.keyword;
    var parameter;

    if (!isNaN(keyword)){
        parameter = "m.lname =~ '.*"+keyword+".*'" +" OR "+ "m.fname =~ '.*"+keyword+".*'" + " OR m.idactors ="+keyword;
    }
    else parameter = "m.lname =~ '.*"+keyword+".*'" +" OR "+ "m.fname =~ '.*"+keyword+".*'";
    var query = apoc.query( "Match (a:Actor)-[:HAS_NAME]->(aka_name:Aka_names), " +
        "a-[:ACTED_IN]->(movies:Movies) " +
        "WHERE "+ parameter +
        "return a,aka_names,movies group by a")

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
 * Search
 * SC3: Short Actor Statistics
 */
exports.stats = function(req, res) {
    /*
     var keyword = req.params.keyword;

     var query;

     if( keyword.length >= 12) {
     query = Actor.find({ $or: [
     { _id  : new ObjectId(keyword) },
     { "name.first" : new RegExp(keyword, 'i')},
     { "name.last" : new RegExp(keyword, 'i')},
     { aka_names: { "$in" : [new RegExp(keyword, 'i')] }}
     ]});

     } else {
     query = Actor.find({ $or: [
     { "name.first" : new RegExp(keyword, 'i')},
     { "name.last" : new RegExp(keyword, 'i')},
     { aka_names: { "$in" : [new RegExp(keyword, 'i')] }}
     ]});
     }
     query.populate({path: 'movies', options: { sort: { 'year': -1 } } })
     query.exec(function(err, actors){
     if(err || !actors ) res.json({data: null, success: false});
     else {
     var astats = _.map(actors, function(num){

     return {
     name: num.name.full,
     num_movies: num.movies.length
     };
     });

     res.json({
     keyword: keyword,
     data: {
     actors: astats
     },
     success: true
     });
     }
     });
     */
};


