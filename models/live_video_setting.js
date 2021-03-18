var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var live_video_setting = connection.define(
  "live_video_setting",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    therapist_id: {
      type: Sequelize.INTEGER,
    },
    url: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    stream_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    is_live: {
      type: Sequelize.TINYINT,
    },
    updated_at: { type: Sequelize.DATE(6) },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "live_video_setting",
    underscored: true,
  }
);

module.exports = live_video_setting;
