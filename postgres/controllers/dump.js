'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore'),
    jsonminify = require("jsonminify"),
    request = require('request');

var config = require('../config/config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('wdm','','', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true
});

/**
 * Index
 */
exports.mongodb = function(req,res) {
    var collection = req.params.collection;

    if(collection == 'movies') {
        var query = "SELECT " +
            "movies.idmovies, " +
            "movies.title, " +
            "movies.number, " +
            "movies.type, " +
            "movies.language, " +
            "movies.location, " +
            "movies.year " +
            "FROM movies";

        sequelize.query(query).spread(function(movies, metadata) {
            _.each(movies,function(movie, idx, ls){
                var options = {
                    uri: 'http://127.0.1:3100/movies',
                    method: 'PUT',
                    json: movie
                };

                request(options);
            });

            res.send(movies.length);

        });
        
        
    } else {
        
    }

};



