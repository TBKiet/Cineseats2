const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/cineseatsDBConnection');
const TheaterRoom = require('./TheaterRoom');

const Showtime = sequelize.define('Showtime', {
    showtimeId: {
        field: 'ShowtimeID',
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    movieId: {
        field: 'MovieID',
        type: DataTypes.STRING(40),
        allowNull: false
    },
    theaterRoomId: {
        field: 'TheaterRoomID',
        type: DataTypes.STRING(10),
        allowNull: false
    },
    date: {
        field: 'Date',
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        field: 'StartTime',
        type: DataTypes.TIME,
        allowNull: false
    },
    dayOfWeek: {
        type: DataTypes.VIRTUAL,
        get() {
            const date = new Date(this.date);
            const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            return daysOfWeek[date.getDay()];
        }
    }
}, {
    tableName: 'Showtimes',
    timestamps: false
});


Showtime.belongsTo(TheaterRoom, { foreignKey: 'theaterRoomId' });
TheaterRoom.hasMany(Showtime, { foreignKey: 'theaterRoomId' });

module.exports = Showtime;