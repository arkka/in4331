'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Actor Schema
 */

// TODO: It is only draft
var ActorSchema = new Schema({
	name		: {
		first: {type: String},

		middle: {type: String},

		last: {type: String}
	},

	gender		: { type: String },

	number		: { type: Number }, // What is this?

	aka_names		: [{ type: String }],
	
});

mongoose.model('Actor', ActorSchema);
