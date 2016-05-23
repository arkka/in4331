'use strict';

/**
 * Movie Schema
 */

module.exports = function(sequelize, DataTypes) {
	var Movie = sequelize.define('Movie', {
		idmovies: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
		},
		year: {
			type: DataTypes.INTEGER,
		},
		number: {
			type: DataTypes.INTEGER,
		},
		location: {
			type: DataTypes.STRING
		},
		language: {
			type: DataTypes.STRING
		}
	}, {
		timestamps: false,
		tableName: 'movies'
	});

	return Movie;
};