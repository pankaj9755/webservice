var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var assessment_questions = connection.define(
  "assessment_questions",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    category: { type: Sequelize.TEXT },
    question: { type: Sequelize.TEXT },
    question_type: {
      type: Sequelize.ENUM,
      values: ["radio", "checkbox", "select", "text"],
      allowNull: true,
      defaultValue: "text",
    },
    options: { type: Sequelize.TEXT },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "active"],
      allowNull: true,
      defaultValue: "active",
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
    tableName: "assessment_questions",
    underscored: true,
  }
);

module.exports = assessment_questions;
