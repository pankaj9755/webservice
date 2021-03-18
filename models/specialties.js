var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var specialties = connection.define(
  "specialties",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    therapist_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.TEXT,
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
    tableName: "specialties",
    underscored: true,
  }
);

module.exports = specialties;
