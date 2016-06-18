'use strict';

/**
 * Module dependencies.
 */
var models  = require('../models'),
    chalk = require('chalk'),
    _ = require('underscore');

var config = require('../config/config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.postgres);

/**
 * Index
 */
exports.mongodb = function(req,res) {
    res.jsonp({
        message: "Migration to MongoDB"
    });
};



