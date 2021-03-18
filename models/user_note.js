var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var user_notes = connection.define(
  "user_notes",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    event_id: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null },
    description: {
      type: Sequelize.TEXT,
    },
    note_date: {
      type: Sequelize.DATE(6),
    },
    created_at: { type: Sequelize.DATE(6) },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "user_notes",
    underscored: true,
  }
);

module.exports = user_notes;
