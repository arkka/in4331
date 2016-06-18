'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * Movie Schema
 */

var MovieSchema = new Schema({
	title		: { type: String },

	year		: { type: Number },

	number 		: { type: String }, // What is this?

	type		: { type: String }, // What is this?

	aka_titles		: [{
		title		: { type: String },

		year		: { type: Number },

		location	: { type: String},
	}],

	location	: [{ type: String }],

	languages	: [{ type: String }],

	genres		: [{ type: String }],

	keywords	: [{ type: String }],

	casts		: [{
		actor			: { type: ObjectId, ref: 'Actor' },

		character		: { type: String },

		billing_position: { type: Number }
	}]

});

mongoose.model('Movie', MovieSchema);
