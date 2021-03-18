var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var user_moods = connection.define(
  "user_moods",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    mood_id: { type: Sequelize.INTEGER },
    note: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
    created_at: { type: Sequelize.DATE(6) },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "user_moods",
    underscored: true,
  }
);

module.exports = user_moods;
