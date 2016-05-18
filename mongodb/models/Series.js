'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Series Schema
 */

// TODO: It is only draft
var SeriesSchema = new Schema({
	title		: { type: String },

	season		: { type: Number },

	number		: { type: Number }, // What is this?

	movies		: [{ type: ObjectId, ref: 'Movie' }],
	
});

mongoose.model('Series', SeriesSchema);
