'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Movie Schema
 */

// TODO: It is only draft
var MovieSchema = new Schema({
	title		: { type: String },

	year		: { type: Number },

	number 		: { type: String }, // What is this?

	type		: { type: String }, // What is this?

	aliases		: [{
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
