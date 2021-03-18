var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var admin_notifications = connection.define(
  "admin_notifications",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.TEXT,
    },
    created_at: { type: Sequelize.DATE(6) },
    deleted_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "admin_notifications",
    underscored: true,
  }
);

module.exports = admin_notifications;
