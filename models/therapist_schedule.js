var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var therapist_schedule = connection.define(
  "therapist_schedule",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    therapist_id: { type: Sequelize.INTEGER },
    day_number: { type: Sequelize.INTEGER },
    open_time: { type: Sequelize.TIME },
    close_time: { type: Sequelize.TIME },
    schedule: { type: Sequelize.STRING },
    is_open: {
      type: Sequelize.ENUM,
      values: ["yes", "no", "N/A"],
      allowNull: true,
      defaultValue: "no"
    },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "therapist_schedule",
    underscored: true
  }
);

module.exports = therapist_schedule;
