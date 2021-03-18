var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var email_template = connection.define(
  "email_template",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.STRING },
    from: { type: Sequelize.STRING },
    subject: { type: Sequelize.STRING },
    body: { type: Sequelize.STRING },
    from_name: { type: Sequelize.STRING },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null
    },
    deleted_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "email_template",
    underscored: true
  }
);

module.exports = email_template;
