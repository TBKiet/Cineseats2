const { DataTypes } = require('sequelize');
const sequelize = require('../../config/cineseatsDBConnection');
const Showtimes = sequelize.define('Showtimes', {
    ShowtimeID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    MovieID: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    TheaterRoomID: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    StartTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'Showtimes',
    timestamps: false,
});

Showtimes.associate = function(models) {
    Showtimes.belongsTo(models.Movies, { foreignKey: 'MovieID' });
    Showtimes.belongsTo(models.TheaterRooms, { foreignKey: 'TheaterRoomID' });
};

module.exports = Showtimes;
