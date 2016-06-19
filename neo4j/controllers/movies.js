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
};

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
        "return a,aka_title,series,actors");

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
        "return m,aka_title,series,actors group by m");

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
exports.genre = function(req, res) {
    var keyword = req.params.genre;

    // Query
    var query = "";
};

/**
 * Genre
 * SC4: Detailed movie information
 */
// TODO: Check check check with real data
// TODO: Implement year range filter
exports.genre_year = function(req, res) {
    var genreQ = req.params.genre;
    var yearQ = req.params.year;


    /*match (m:Movie)-[:HAS_GENRE]->(g:genre), m-[:HAS_AKATITLES]->(ak)
     where m.year = 1992 AND g.genre = 'pop' return distinct m, ak as Aka_titles ORDER BY m.title DESC*/
    var query = "MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre), m-[:HAS_AKATITLES]->(ak) " +
        "WHERE m.year =" +yearQ+ " AND g.genre =" +genreQ+
        " RETURN DISTINCT m, ak AS Aka_titles ORDER BY m,title DESC";

    query.exec().then(function (result) {
        res.json({
            success: true,
            keyword: {
                genre: genreQ,
                year: yearQ
            },
            count: movies.length,
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
exports.genre_year_range = function(req, res) {

    var genreQ = req.params.genre;

    // Check order of year
    var yFrom;
    var yTo;

    if (req.params.yfrom > req.params.yto) {
        yFrom = req.params.yto;
        yTo = req.params.yfrom;
    }
    else {
        yFrom = req.params.yfrom;
        yTo = req.params.yto;
    }

    // Query
    /*match (m:Movie)-[:HAS_GENRE]->(g:genre), m-[:HAS_AKATITLES]->(ak)
     where m.year = 1992 AND g.genre = 'pop' return distinct m, ak as Aka_titles ORDER BY m.title DESC*/
    var query = "MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre), m-[:HAS_AKATITLES]->(ak) " +
        "WHERE m.year >=" + yFrom + " AND m.year <=" + yTo + " AND g.genre =" +genreQ+
        " RETURN DISTINCT m, ak AS Aka_titles ORDER BY m,title DESC";

    query.exec().then(function (result) {
        res.json({
            success: true,
            keyword: {
                genre: genreQ,
                year_start: yFrom,
                year_end: yTo
            },
            count: movies.length,
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
 * SC5: Genre statistics
 */
// TODO: Check check check with real data
exports.genre_stats = function(req, res) {
    var keyword = req.params.year;

    /*MATCH (m:Movies)-[:HAS_GENRE]->(genre)
     WHERE m.year = 2000 return genre, m, count(m)As Total order by genre.id desc*/
    var query = "MATCH (m:Movies)-[:HAS_GENRE]->(genre) " +
        "WHERE m.year = "+keyword+
        "return genre, count(m)As Total order by genre.id desc";

    query.exec().then(function (result) {

        // Delete genre with null value
        result = _.reject(result, function(d){ return d.genre == null; });

        res.json({
            success: true,
            keyword: {
                year: keyword
            },

            data: {
                genre: result
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
 * SC5: Genre statistics with range
 */
// TODO: Check check check with real data
// TODO: Implement year range filter
exports.genre_stats_range = function(req, res) {
    // Check order of year
    // Check order of year
    var yFrom;
    var yTo;

    if (req.params.yfrom > req.params.yto) {
        yFrom = req.params.yto;
        yTo = req.params.yfrom;
    }
    else {
        yFrom = req.params.yfrom;
        yTo = req.params.yto;
    }

    /*MATCH (m:Movies)-[:HAS_GENRE]->(genre)
     WHERE m.year = 2000 return genre, m, count(m)As Total order by genre.id desc*/
    var query = "MATCH (m:Movies)-[:HAS_GENRE]->(genre) " +
        "WHERE m.year >= "+yFrom+ "AND m.year <= "+yTo+
        "return genre, count(m)As Total order by genre.id desc";

    query.exec().then(function (result) {

        // Delete genre with null value
        result = _.reject(result, function(d){ return d.genre == null; });

        res.json({
            success: true,
            keyword: {
                year: keyword
            },

            data: {
                genre: result
            }
        });
    }, function (err) {
        res.json({
            error: err,
            success: false
        });
    });
};
