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
        parameter = "a.lname =~ '.*"+keyword+".*'" +" OR "+ "a.fname =~ '.*"+keyword+".*'" + " OR a.idactors ="+keyword;
    }
    else parameter = "a.lname =~ '.*"+keyword+".*'" +" OR "+ "a.fname =~ '.*"+keyword+".*'";
    var query = apoc.query( "Match (a:Actor)-[:HAS_NAME]->(aka_name:Aka_names), " +
        "a-[:ACTED_IN]->(movies:Movies) " +
        "WHERE "+ parameter +
        "return a,aka_names,movies group by a");

    query.exec().then(function (result) {
        res.json({
            success: true,
            data: {
                actors: result
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
     *   match (actors:Person)-[:ACTED_IN]->(movies) where actors.name =~ '.*Tom.*' return distinct actors, count (movies) AS Movies_Played
     * */
    var keyword = req.params.keyword;
    var parameter;

    if (!isNaN(keyword)){
        parameter = "a.lname =~ '.*"+keyword+".*'" +" OR "+ "a.fname =~ '.*"+keyword+".*'" + " OR a.idactors ="+keyword;
    }
    else parameter = "a.lname =~ '.*"+keyword+".*'" +" OR "+ "a.fname =~ '.*"+keyword+".*'";
    var query = apoc.query( "Match (a:Actors)-[:ACTED_IN]->(movies:Movies)" +
        "WHERE "+ parameter +
        "return a, count(movies) as Movie_Played group by a")

    query.exec().then(function (result) {
        res.json({
            success: true,
            data: {
                actors: result
            }
        });
    }, function (err) {
        res.json({
            error: err,
            success: false
        });
    });
};


