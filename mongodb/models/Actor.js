'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * Actor Schema
 */

var ActorSchema = new Schema({
	name		: {

		first		: { type: String },

		middle		: { type: String },

		last		: { type: String }
	},

	gender		: { type: String },

	number		: { type: Number }, // What is this?

	aka_names		: [{ type: String }],

	movies			: [{ type: ObjectId, ref: 'Movie' }],
});

mongoose.model('Actor', ActorSchema);
