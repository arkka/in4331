/**
 * Created by sukmawicaksana on 6/2/2016.
 */

/**
 * Actor Schema
 */

module.exports = function(sequelize, DataTypes) {
    var Actor = sequelize.define('Actor', {
        idactors: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        lname: {
            type: DataTypes.STRING
        },
        fname: {
            type: DataTypes.STRING
        },
        mname: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.INTEGER
        },
        number: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false,
        tableName: 'actors'
    });

    return Actor;
};