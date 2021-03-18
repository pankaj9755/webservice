var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var survey_questions = connection.define(
  "survey_questions",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    group_code_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    question: { type: Sequelize.TEXT },
    therapy_type: {
      type: Sequelize.ENUM,
      values: ["marriage_counseling", "online_therapy", "teen_counseling"],
    },
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
    tableName: "survey_questions",
    underscored: true,
  }
);

module.exports = survey_questions;
