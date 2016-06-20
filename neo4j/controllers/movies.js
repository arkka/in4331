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
 * List
 */
exports.list = function(req, res) {
    var query = apoc.query(" MATCH (a:Movies) return a limit 10");

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
 * SC1: Detailed movie information
 */
exports.read = function(req, res) {

    var keyword = req.params.movieId;
    
    var query = apoc.query( "Match (m:Movies)-[:HAS_ALIAS]->(aka_title:AKA_TITLES), " +
        "(m)-[:HAS_KEYWORD]->(keyword:Keywords), " +
        "(m)-[:HAS_GENRE]->(genre:Genres), " +
        "(actors:Actors)-[:ACTED_IN]->(m) " +
        "WHERE m.idmovies = " +keyword+
        " return m,aka_title,genre,actors");

    query.exec().then(function (result) {
        res.json({
            keyword: keyword,
            count: result.length,
            data: {
                movie: result
            },
            success: true
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
 * SC1: Detailed movie information
 */
exports.search = function(req, res) {
    var keyword = req.params.keyword;

    var query = apoc.query( "Match (m:Movies)-[:HAS_ALIAS]->(aka_title:AKA_TITLES), " +
        "(m)-[:HAS_KEYWORD]->(keyword:Keywords), " +
        "(m)-[:HAS_GENRE]->(genre:Genres), " +
        "(actors:Actors)-[:ACTED_IN]->(m) " +
        "WHERE m.title =~ '.*" +keyword+".*' "+
        " return m,aka_title,genre,actors");

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
exports.genre_year = function(req, res) {

    var genreQ = req.params.genre;
    var yearQ = req.params.year;

    /*match (m:Movie)-[:HAS_GENRE]->(g:genre), m-[:HAS_AKATITLES]->(ak)
     where m.year = 1992 AND g.genre = 'pop' return distinct m, ak as Aka_titles ORDER BY m.title DESC*/
    var query = apoc.query("MATCH (m:Movies)-[:HAS_GENRE]->(g:Genres) " +
        "MATCH (m)-[:HAS_KEYWORD]->(k:Keywords)" +
        "MATCH (m)-[:HAS_GENRE]->(ga:Genres) " +
        "MATCH (actors:Actors)-[ac:ACTED_IN]->(m) " +
        "WHERE m.year = "+yearQ+" AND g.genre = '"+genreQ+"' " +
        "RETURN DISTINCT m, COLLECT(DISTINCT(actors)), COLLECT(DISTINCT(ac)), COLLECT(DISTINCT(ga.genre)), COLLECT(DISTINCT(k.keyword)) ORDER BY m.year");

    query.exec().then(function (actors) {

        var result = actors[0];

        var out = [];

        for (var i = 0; i < result.data.length; i++){

            var casts = [];

            for (var j = 0; j < result.data[i].row[1].length; j++){
                var name = result.data[i].row[1][j].fname + " " +  result.data[i].row[1][j].mname + " " + result.data[i].row[1][j].lname;

                casts.push({
                    idactors: result.data[i].row[1][j].idactors,
                    name: name,
                    character: result.data[i].row[2][j].character,
                    billing_position: result.data[i].row[2][j].billing_position
                })
            }
            result.data[i].row[0].casts = casts;

            result.data[i].row[0].genres = result.data[i].row[3];
            result.data[i].row[0].keywords = result.data[i].row[4];

            out.push(result.data[i].row[0]);
        }

        res.json({
            keyword: {
                genre: genreQ,
                year: yearQ,
            },
            count: out.length,
            data: {
                movies: out
            },
            success: true
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
    var query = apoc.query("MATCH (m:Movies)-[:HAS_GENRE]->(g:Genres) " +
        "MATCH (m)-[:HAS_KEYWORD]->(k:Keywords)" +
        "MATCH (m)-[:HAS_GENRE]->(ga:Genres) " +
        "MATCH (actors:Actors)-[ac:ACTED_IN]->(m) " +
        "WHERE m.year >=" + yFrom + " AND m.year <=" + yTo + " AND g.genre = '" +genreQ+"' " +
        "RETURN DISTINCT m, COLLECT(DISTINCT(actors)), COLLECT(DISTINCT(ac)), COLLECT(DISTINCT(ga.genre)), COLLECT(DISTINCT(k.keyword)) ORDER BY m.year");

    query.exec().then(function (actors) {

        var result = actors[0];

        var out = [];

        for (var i = 0; i < result.data.length; i++){

            var casts = [];

            for (var j = 0; j < result.data[i].row[1].length; j++){
                var name = result.data[i].row[1][j].fname + " " +  result.data[i].row[1][j].mname + " " + result.data[i].row[1][j].lname;

                casts.push({
                    idactors: result.data[i].row[1][j].idactors,
                    name: name,
                    character: result.data[i].row[2][j].character,
                    billing_position: result.data[i].row[2][j].billing_position
                })
            }
            result.data[i].row[0].casts = casts;

            result.data[i].row[0].genres = result.data[i].row[3];
            result.data[i].row[0].keywords = result.data[i].row[4];

            out.push(result.data[i].row[0]);
        }

        res.json({
            keyword: {
                genre: genreQ,
                year_start: yFrom,
                year_end: yTo
            },
            count: out.length,
            data: {
                movies: out
            },
            success: true
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
 * Genre
 * SC5: Genre statistics
 */
// TODO: Check check check with real data
exports.genre_stats = function(req, res) {
    var keyword = req.params.year;

    /*MATCH (m:Movies)-[:HAS_GENRE]->(genre)
     WHERE m.year = 2000 return genre, m, count(m)As Total order by genre.id desc*/
    var query = apoc.query("MATCH (m:Movies)-[:HAS_GENRE]->(genre:Genres) " +
        "WHERE m.year = "+keyword+
        " return genre.genre, count(m) As Total");

    query.exec().then(function (result) {

        var genre = result[0];
        var out = [];
        for (var i = 0; i < genre.data.length; i++) {
            out.push( {
                genre:genre.data[i].row[0],
                num_movies:genre.data[i].row[1]
            });
        }
        res.json({
            success: true,
            count: out.length,
            keyword: {
                year: keyword
            },

            data: {
                genre:out
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
    var query = apoc.query("MATCH (m:Movies)-[:HAS_GENRE]->(genre:Genres) " +
        "WHERE m.year >= "+yFrom+ " AND m.year <= "+yTo+
        " return genre.genre, count(m) As Total");

    query.exec().then(function (result) {

        var genre = result[0];
        var out = [];
        for (var i = 0; i < genre.data.length; i++) {
            out.push( {
                genre:genre.data[i].row[0],
                num_movies:genre.data[i].row[1]
        });
        }
            res.json({
            success: true,
            keyword: {
                year_start: yFrom,
                year_end: yTo
            },
            count: out.length,
            data: {
                genre: out
            }
        });
    }, function (err) {
        res.json({
            querystring:query,
            error: err,
            success: false
        });
    });
};
