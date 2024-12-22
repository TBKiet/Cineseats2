const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/cineseatsDBConnection');
const Theater = require('./Theater');

const TheaterRoom = sequelize.define('TheaterRoom', {
  roomId: {
    field: 'RoomID',
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  theaterId: {
    field: 'TheaterID',
    type: DataTypes.STRING(10),
    allowNull: false
  },
  roomName: {
    field: 'RoomName',
    type: DataTypes.STRING(50)
  },
  totalSeats: {
    field: 'TotalSeats',
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'TheaterRooms',
  timestamps: false
});

// Relationships
TheaterRoom.belongsTo(Theater, { foreignKey: 'theaterId' });
Theater.hasMany(TheaterRoom, { foreignKey: 'theaterId' });

module.exports = TheaterRoom;