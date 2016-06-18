'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Series Schema
 */

var SeriesSchema = new Schema({
	title		: { type: String },

	season		: { type: Number },

	number		: { type: Number }, // What is this?

	movies		: [{ type: ObjectId, ref: 'Movie' }],
	
});

mongoose.model('Series', SeriesSchema);
