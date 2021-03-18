var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var user_assessment_questions = connection.define(
  "user_assessment_questions",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    email: { type: Sequelize.STRING },
    question_answer: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE(6) },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "user_assessment_questions",
    underscored: true,
  }
);

module.exports = user_assessment_questions;
