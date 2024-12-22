const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/cineseatsDBConnection');

const Theater = sequelize.define('Theater', {
    theaterId: {
        field: 'TheaterID',
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    name: {
        field: 'TheaterName',
        type: DataTypes.STRING(100),
        allowNull: false
    },
    location: {
        field: 'Location',
        type: DataTypes.STRING(100),
        allowNull: false
    },
    theaterCity: {
        field: 'City',
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'Theaters',
    timestamps: false
});

module.exports = Theater;