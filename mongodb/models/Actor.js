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

	movies_by_year : Schema.Types.Mixed

});

ActorSchema
	.virtual('name.full')
	.get(function () {
		var name = "";
		if(this.name.first) name += this.name.first;
		if(this.name.middle) name += ' '+ this.name.middle;
		if(this.name.last) name += ' '+ this.name.last;
		return name;
	});

mongoose.model('Actor', ActorSchema);
