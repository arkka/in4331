'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

var config = require('../config/config')
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.postgres);

/**
 * List
 */
exports.list = function(req, res) {
    sequelize.query("select * from actors limit 10").spread(function(results, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json(results);
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};

/**
 *  search
 * */

exports.search = function (req, res){
    var keyword = req.params.keyword;
    var queryString;

    if (!isNaN(keyword)){
        //queryString = "SELECT * FROM movies WHERE (idmovies = '"+keyword+"' OR title LIKE '"+keyword+"')";
        queryString = "SELECT actors.*, aka_names.name AS aka_name FROM actors full join aka_names on actors.idactors = aka_name.idactors WHERE (actors.idactors = '"+keyword+"' OR actors.fname LIKE '"+keyword+"' OR actors.lname LIKE '"+keyword+"')";
    }else
    //queryString = "SELECT * FROM movies WHERE movies.title LIKE '"+keyword+"'";
        queryString = "SELECT actors.*, aka_names.name AS aka_name FROM actors  full join aka_names on actors.idactors = aka_name.idactors WHERE actors.fname LIKE '"+"' OR actors.lname LIKE '"+keyword+"')";

    sequelize.query(queryString).spread(function(results, metadata) {
        //sequelize.query("select distinct * from movies join acted_in on movies.idmovies = acted_in.idmovies where movies.idmovies = 2354").spread(function(results, metadata) {
        res.json(results);
        // Results will be an empty array and metadata will contain the number of affected rows.
    });
};