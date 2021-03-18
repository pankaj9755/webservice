var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var requests = connection.define(
  "requests",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    request_number: { type: Sequelize.STRING },
    therapist_id: { type: Sequelize.INTEGER },
    customer_id: { type: Sequelize.INTEGER },
    therapy_type: {
      type: Sequelize.ENUM,
      values: [
        "marriage_counseling",
        "online_therapy",
        "teen_counseling",
        "social_worker",
        "registered_councillor",
        "counselling_psychologist",
        "clinical_psychologist",
      ],
    },
    category: {
      type: Sequelize.ENUM,
      values: ["student", "medical_aid", "employee", "general_public"],
      allowNull: true,
      defaultValue: "general_public",
    },
    status: {
      type: Sequelize.ENUM,
      values: ["draft", "pending", "cancel", "wip", "completed"],
      allowNull: true,
      defaultValue: "draft",
    },
    payment_status: {
      type: Sequelize.ENUM,
      values: ["pending", "done"],
      allowNull: true,
      defaultValue: "pending",
    },
    apointment_date_time: { type: Sequelize.DATE },
    question_answer: { type: Sequelize.TEXT },

    price: { type: Sequelize.DOUBLE },
    promo_code: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    discount_promo_code: { type: Sequelize.DECIMAL },
    referral_code: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    referral_code_amount: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    group_code: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    therapist_paid: {
      type: Sequelize.ENUM,
      values: ["pending", "done"],
      allowNull: true,
      defaultValue: "pending",
    },
    request_delete: {
      type: Sequelize.ENUM,
      values: ["no", "yes"],
      allowNull: true,
      defaultValue: "no",
    },
    request_therapist_delete: {
      type: Sequelize.ENUM,
      values: ["no", "yes"],
      allowNull: true,
      defaultValue: "no",
    },
    created_by: {
      type: Sequelize.ENUM,
      values: ["customer", "therapist"],
      allowNull: true,
      defaultValue: "customer",
    },
    survey_question: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    score: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
    tableName: "requests",
    underscored: true,
  }
);

module.exports = requests;
