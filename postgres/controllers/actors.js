/**
 * Created by sukmawicaksana on 6/2/2016.
 */
'use strict';

/**
 * Module dependencies.
 */
//var mongoose = require('mongoose'),
//    ObjectId = mongoose.Types.ObjectId,
//    Actor = mongoose.model('Actor'),
//    Movie = mongoose.model('Movie'),
//    chalk = require('chalk'),
//    _ = require('underscore');

/**
 * Index
 */
exports.index = function(req,res) {
    res.jsonp({
        message: "Movie API - MongoDB"
    });
};

/**
 *  SC2 - Detailed actors information
 *
 * */

exports.search = function (req, res){
    var keyword = req.params.keyword;
    var queryString;

    if (!isNaN(keyword)){
        //queryString = "SELECT * FROM movies WHERE (idmovies = '"+keyword+"' OR title LIKE '"+keyword+"')";
        queryString = "SELECT distinct actors.*, aka_names.name AS aka_name, movies.title, movies.year FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE (actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"')";
    }else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");
        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT distinct actors.*, aka_names.name AS aka_name, movies.title, movies.year FROM actors join aka_names on actors.idactors = aka_names.idactors" +
                " join acted_in on actors.idactors = acted_in.idactors"+
                " join movies on acted_in.idmovies = movies.idmovies"+
                " WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"')OR(actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"')";
        }
    }
    else
    {
        //queryString = "SELECT * FROM movies WHERE movies.title LIKE '"+keyword+"'";
        //SELECT actors.*, aka_names.name AS aka_name FROM actors full join aka_names on actors.idactors = aka_names.idactors WHERE (actors.fname LIKE 'Lucienne' OR actors.lname LIKE 'Lucienne')
        //queryString = "SELECT actors.*, aka_names.name AS aka_name FROM actors  full join aka_names on actors.idactors = aka_names.idactors WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
        queryString = "SELECT distinct actors.*, aka_names.name AS aka_name, movies.title, movies.year FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
    }

    sequelize.query(queryString).spread(function(results, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json(results);
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};


/**
 *  SC3 - Short actors statics
 *
 * */

exports.stats = function (req, res){
    var keyword = req.params.keyword;
    var queryString;

    if (!isNaN(keyword)){
        //queryString = "SELECT * FROM movies WHERE (idmovies = '"+keyword+"' OR title LIKE '"+keyword+"')";
        queryString = "SELECT distinct actors.idactors, actors.fname,actors.lname, count(movies.idmovies) AS Movie_count FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE (actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"')"+
            " GRoup by actors.idactors";
    }else if(keyword.indexOf(" ")>-1){
        // Could be firstname + lastname
        var arr = keyword.split(" ");
        if ((arr[0].length >0)&&(arr[0].length >0)){
            // firstname and lastname
            queryString = "SELECT distinct actors.idactors, actors.fname,actors.lname, count(movies.idmovies) AS Movie_count FROM actors join aka_names on actors.idactors = aka_names.idactors" +
                " join acted_in on actors.idactors = acted_in.idactors"+
                " join movies on acted_in.idmovies = movies.idmovies"+
                " WHERE (actors.fname LIKE '"+arr[0]+"' AND actors.lname LIKE '"+arr[1]+"')OR(actors.fname LIKE '"+arr[1]+"' AND actors.lname LIKE '"+arr[0]+"')"+
                " GRoup by actors.idactors";
        }
    }
    else
    {
        //queryString = "SELECT * FROM movies WHERE movies.title LIKE '"+keyword+"'";
        //SELECT actors.*, aka_names.name AS aka_name FROM actors full join aka_names on actors.idactors = aka_names.idactors WHERE (actors.fname LIKE 'Lucienne' OR actors.lname LIKE 'Lucienne')
        //queryString = "SELECT actors.*, aka_names.name AS aka_name FROM actors  full join aka_names on actors.idactors = aka_names.idactors WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'";
        queryString = "SELECT distinct actors.idactors, actors.fname,actors.lname, count(movies.idmovies) AS Movie_count FROM actors join aka_names on actors.idactors = aka_names.idactors" +
            " join acted_in on actors.idactors = acted_in.idactors"+
            " join movies on acted_in.idmovies = movies.idmovies"+
            " WHERE actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"'"+
            " GRoup by actors.idactors";
    }

    sequelize.query(queryString).spread(function(results, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json(results);
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};