var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var assessments = connection.define(
  "assessments",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    image: {
      type: Sequelize.STRING,
    },
    status: { type: Sequelize.ENUM, values: ["active", "inactive"] },
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
    tableName: "assessments",
    underscored: true,
  }
);

module.exports = assessments;
