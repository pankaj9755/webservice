var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var support_chat = connection.define(
  "support_chat",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    live_video_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    message: {
      type: Sequelize.TEXT,
    },
    created_at: { type: Sequelize.DATE(6) },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "support_chat",
    underscored: true,
  }
);

module.exports = support_chat;
