const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  visitor: {
    ip: String,
    timestamp: { type: Date, default: Date.now },
    timezone: Number,
    language: String,
  },
  browser: {
    name: String,
    version: String,
    userAgent: String,
  },
  os: {
    name: String,
    version: String,
  },
  device: {
    name: String,
    _name: String,
    screenWidth: String,
  },
  location: {},
  page: {
    url: String,
  },
});

const AnalyticsModel = mongoose.model("Analytics", AnalyticsSchema);

module.exports = AnalyticsModel;
