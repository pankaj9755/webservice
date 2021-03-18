var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var users_master = connection.define(
  "users_master",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    last_name: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    kin_name: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    kin_number: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    email: { type: Sequelize.STRING },
    mobile_number: { type: Sequelize.STRING },
    country_code: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 27,
    },
    password: { type: Sequelize.STRING },
    unic_id: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    hpcsa_no: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    social_key: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    social_type: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    referral_code: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    used_referral_code: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    benefit_i_referral_used: {
      type: Sequelize.ENUM,
      values: ["yes", "no"],
    },
    benefit_referral_used: {
      type: Sequelize.ENUM,
      values: ["yes", "no"],
    },
    used_group_code: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    address: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
    city: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    lattitude: { type: Sequelize.DECIMAL, allowNull: true, defaultValue: null },
    longitude: { type: Sequelize.DECIMAL, allowNull: true, defaultValue: null },
    age: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    profile_image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    gender: {
      type: Sequelize.ENUM,
      values: ["male", "female", "other"],
    },
    is_agree: {
      type: Sequelize.ENUM,
      values: ["yes", "no"],
    },
    qualification: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    years_experience: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    therapy_type: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    id_proof: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    about_me: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
    stripe_key: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    web_version: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    web_browser: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    web_ip: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    user_type: {
      type: Sequelize.ENUM,
      values: ["customer", "therapist"],
      allowNull: true,
      defaultValue: "customer",
    },
    is_mobile_verify: {
      type: Sequelize.ENUM,
      values: ["yes", "no"],
      allowNull: true,
      defaultValue: "no",
    },
    is_email_verify: {
      type: Sequelize.ENUM,
      values: ["yes", "no"],
      allowNull: true,
      defaultValue: "no",
    },
    remember_token: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    last_seen: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "inactive"],
      allowNull: true,
      defaultValue: "active",
    },
    therapy_profile_status: {
      type: Sequelize.ENUM,
      values: ["verify", "unverify"],
      allowNull: true,
      defaultValue: "unverify",
    },
    avg_rating: { type: Sequelize.FLOAT, allowNull: true, defaultValue: 0 },
    total_rating: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
    device_type: { type: Sequelize.ENUM, values: ["android", "iOS", "web"] },
    device_key: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    notification_key: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    dd: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
    dod: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
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
    tableName: "users_master",
    underscored: true,
  }
);

module.exports = users_master;
