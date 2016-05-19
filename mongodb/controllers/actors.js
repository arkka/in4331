'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Actor = mongoose.model('Actor'),
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
}

/**
 * Create
 */
exports.create = function(req, res) {
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
};

/**
 * Read
 */
exports.read = function(req, res) {
    Actor.findById(req.params.actorId, function(err, actor){
        if(err || !actor) res.json({data: null, success: false});
        else res.json({
            data: {
                actor: actor,
            },
            success: true
        });
    });
};

/**
 * Update
 */
exports.update = function(req, res) {
    Actor.findByIdAndUpdate(req.params.actorId,  { $set: req.body.actor }, function(err, actor){
        if(err || !actor) res.json({data: null, success: false});
        else res.json({
            data: {
                actor: actor,
            },
            success: true});
    });
};

/**
 * List
 */
exports.list = function(req, res) {
    Actor.find({}, function(err, actors){
        if(err || !actors) res.json({data: null, success: false});
        else res.json({
            data: {
                actors: actors
            },
            success: true
        });
    });
};

/**
 * Search
 * SC2: Detailed actor information
 */
exports.search = function(req, res) {
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
            res.json({
                keyword: keyword,
                data: {
                    actors: actors
                },
                success: true
            });
        }
    });
};


