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
};

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
    var keyword = req.params.movieId;

    Movie.findById(req.params.movieId, function(err, movie){
        if(err || !movie) res.json({data: null, success: false});
        else res.json({
            keyword: keyword,
            data: {
                movie: movie
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
                movie: movie
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
    // Get variable for url parameter: keyword
    var keyword = req.params.keyword;

    var query;

    // To differentiate whether the keyword is ObjectId or word
    if( keyword.length >= 12) {
        query = Movie.find({ $or: [
            { _id  : new ObjectId(keyword) },
            { title : new RegExp(keyword, 'i')},
            { aka_titles: { "$elemMatch" : { title: new RegExp(keyword, 'i') }}}
            // Search with year on query
            //{ year  : new RegExp(keyword, 'i')}

        ]});
    } else {
        query = Movie.find({ $or: [
            { title : new RegExp(keyword, 'i')},
            { aka_titles: { "$elemMatch" : { title: new RegExp(keyword, 'i') }}}
            // Search with year on query
            //{ year  : new RegExp(keyword, 'i')}
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
exports.genre = function(req, res) {

    var keyword = req.params.genre;

    Movie.find({ genres: req.params.genre })
        .sort({year: 1, title: 1})
        .populate('casts.actor')
        .exec(function(err, movies){
        if(err || !movies) res.json({data: null, success: false});
        else {
            res.json({
                keyword: keyword,
                count: movies.length,
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
 * SC4: Detailed movie information genre with year
 */
// TODO: Check check check with real data
exports.genre_year = function(req, res) {

    var genreQ = req.params.genre;
    var yearQ = req.params.year;

    Movie.find({ genres: req.params.genre, $or: [
            { year: req.params.year},
            { aka_titles: { "$elemMatch" : { year: req.params.year }}}
        ]})
        .sort({year: 1, title: 1})
        .populate('casts.actor')
        .exec(function(err, movies){
            if(err || !movies) res.json({data: null, success: false});
            else res.json({
                keyword: {
                    genre: genreQ,
                    year: yearQ
                },
                count: movies.length,
                data: {
                    movies: movies
                },
                success: true
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

    Movie.find({ genres: req.params.genre, $or: [
        { year: {
            $gte: yFrom,
            $lte: yTo
        }},
        { aka_titles: { "$elemMatch" : { year: {
            $gte: yFrom,
            $lte: yTo
        } }}}
    ]})
        .sort({year: 1, title: 1})
        .populate('casts.actor')
        .exec(function(err, movies){
            if(err || !movies) res.json({data: null, success: false});
            else res.json({
                keyword: {
                    genre: genreQ,
                    year_start: yFrom,
                    year_end: yTo
                },
                count: movies.length,
                data: {
                    movies: movies,
                    movies_by_year: _.groupBy(movies, function(num){ return num.year; })
                },
                success: true
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

    var query = Movie.find({ $or: [
        { year: keyword},
        { aka_titles: { "$elemMatch" : { year: keyword }}}
    ]});
    query.sort({year: 1, title: 1});
    query.exec(function(err, movies){
            if(err || !movies) res.json({data: null, success: false});
            else {

                var moviesTotal = movies.length;

                // Create object per genre per movie
                var genres = [];
                _.map(movies, function(num){
                    var gen = num.genres;

                    _.map(gen, function(nim){
                        //genres.push(nim);
                        genres.push({
                            genre: nim,
                            movie_count: 1
                        })
                    });
                });

                // Sum movie per genre
                var totalPerType = {};
                for (var i = 0, len = genres.length; i < len; ++i) {
                    totalPerType[genres[i].genre] = totalPerType[genres[i].genre] || 0;
                    totalPerType[genres[i].genre] += genres[i].movie_count;
                }
                var out = _.map(totalPerType, function(sum, type) {
                    return { genre: type, movie_count: sum };
                });

                // Sort the result based on genre
                var outsort = _.sortBy(out, function(genre) { return genre.genre; });

                res.json({
                    keyword: keyword,
                    total_movies: moviesTotal,
                    //total_genres: _.uniq(genres).length,
                    //data: {
                    //    genre: _.countBy(genres, function(num) { return num; })
                    //},
                    total_genres: outsort.length,
                    data: outsort,
                    success: true
                });
            }
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

    var query = Movie.find({ $or: [
        { year: {
            $gte: yFrom,
            $lte: yTo
        }},
        { aka_titles: { "$elemMatch" : { year: {
            $gte: yFrom,
            $lte: yTo
        } }}}
    ]});
    query.sort({year: 1, title: 1});

    query.exec(function(err, movies){
        if(err || !movies) res.json({data: null, success: false});
        else {
            var moviesTotal = movies.length;

            // Create object per genre per movie
            var genres = [];
            _.map(movies, function(num){
                var gen = num.genres;

                _.map(gen, function(nim){
                    //genres.push(nim);
                    genres.push({
                        genre: nim,
                        movie_count: 1
                    })
                });
            });

            // Sum movie per genre
            var totalPerType = {};
            for (var i = 0, len = genres.length; i < len; ++i) {
                totalPerType[genres[i].genre] = totalPerType[genres[i].genre] || 0;
                totalPerType[genres[i].genre] += genres[i].movie_count;
            }
            var out = _.map(totalPerType, function(sum, type) {
                return { genre: type, movie_count: sum };
            });

            // Sort the result based on genre
            var outsort = _.sortBy(out, function(genre) { return genre.genre; });

            res.json({
                keyword: {
                    year_start: yFrom,
                    year_end: yTo
                },
                total_movies: moviesTotal,
                //total_genres: _.uniq(genres).length,
                //data: {
                //    genre: _.countBy(genres, function(num) { return num; })
                //},
                total_genres: outsort.length,
                data: outsort,
                success: true
            });
        }
    });
};
