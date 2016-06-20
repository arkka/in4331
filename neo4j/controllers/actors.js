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

};

/**
 * Read
 */
exports.read = function(req, res) {
    var actorId = req.params.actorId;

    var query = apoc.query( "Match (a:Actors)-[:HAS_ALIAS]->(aka_names:AKA_NAMES), " +
        "(a)-[:ACTED_IN]->(movies:Movies) " +
        "WHERE a.idactors = " +actorId+
        " return a, aka_names ,movies");

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
            querystring:query,
            success: false
        });
    });

};

/**
 * Update
 */
exports.update = function(req, res) {

};

/**
 * List
 */
exports.list = function(req, res) {

};

/**
 * Search
 * SC2: Detailed actor information
 */
exports.search = function(req, res) {
    var keyword = req.params.keyword;
    var parameter;
    if (!isNaN(keyword)){
        parameter = "a.idactors = " +keyword;
    }
    else if(keyword.indexOf(" ")>-1) {
        // Could be firstname + lastname
        var arr = keyword.split(" ");

        // Handling name more than 2 words (example: Stefanie von Poser, with von Poser being the last name)
        if (arr.length > 2) {
            for (var i = 2; i < arr.length; i++) {
                arr[1] += " " + arr[i];
            }
        }
        if ((arr[0].length > 0) && (arr[1].length > 0)) {
            // First name and Last name
            parameter = "(a.lname =~ '.*" + arr[0] + ".*'" + " AND " + "a.fname =~ '.*" + arr[1] + ".*'" + ") OR (" +
                "a.lname =~ '.*" + arr[1] + ".*'" + " AND " + "a.fname =~ '.*" + arr[0] + ".*')";

        }
    }
    else     parameter = "a.lname =~ '.*"+keyword+".*'" +" OR "+ "a.fname =~ '.*"+keyword+".*'";
    
    var query = apoc.query( "Match (a:Actors)-[:HAS_ALIAS]->(aka_names:AKA_NAMES), " +
        "(a)-[:ACTED_IN]->(movies:Movies) " +
        "WHERE "+ parameter +
        " return a,aka_names,movies");

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
            querystring:query,
            success: false
        });
    });
};

/**
 * Search
 * SC3: Short Actor Statistics
 */
exports.stats = function(req, res) {
    var keyword = req.params.keyword;
    var parameter;
    if (!isNaN(keyword)){
        parameter = "a.idactors = " +keyword;
    }
    else if(keyword.indexOf(" ")>-1) {
        // Could be firstname + lastname
        var arr = keyword.split(" ");

        // Handling name more than 2 words (example: Stefanie von Poser, with von Poser being the last name)
        if (arr.length > 2) {
            for (var i = 2; i < arr.length; i++) {
                arr[1] += " " + arr[i];
            }
        }
        if ((arr[0].length > 0) && (arr[1].length > 0)) {
            // First name and Last name
            parameter = "(a.lname =~ '.*" + arr[0] + ".*'" + " AND " + "a.fname =~ '.*" + arr[1] + ".*'" + ") OR (" +
                "a.lname =~ '.*" + arr[1] + ".*'" + " AND " + "a.fname =~ '.*" + arr[0] + ".*')";

        }
    }
    else     parameter = "a.lname =~ '.*"+keyword+".*'" +" OR "+ "a.fname =~ '.*"+keyword+".*'";

    var query = apoc.query( "Match (a:Actors)-[:HAS_ALIAS]->(aka_names:AKA_NAMES), " +
        "(a)-[:ACTED_IN]->(movies:Movies) " +
        "WHERE "+ parameter +
        " return a, aka_names, count(movies) as Movie_Played");

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
            querystring:query,
            success: false
        });
    });
};
