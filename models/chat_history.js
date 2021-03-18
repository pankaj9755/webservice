var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var chat_history = connection.define(
  "chat_history",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    sender_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    receiver_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    message: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.ENUM,
      values: ["text", "file"],
      allowNull: true,
      defaultValue: "text",
    },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
    deleted_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "chat_history",
    underscored: true,
  }
);

module.exports = chat_history;
