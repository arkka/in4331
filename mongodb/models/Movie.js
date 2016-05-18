'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * User Schema
 */

// TODO: It is only draft
var MovieSchema = new Schema({
	title	: { type: String },

	year	: { type: Number }

});

mongoose.model('Movie', MovieSchema);
