/**
 * Created by sukmawicaksana on 6/2/2016.
 */

/**
 * Series Schema
 */

module.exports = function(sequelize, DataTypes) {
    var Series = sequelize.define('Series', {
        idseries: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idmovies: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING
        },
        season: {
            type: DataTypes.INTEGER
        },
        number: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false,
        tableName: 'series'
    });

    return Series;
};