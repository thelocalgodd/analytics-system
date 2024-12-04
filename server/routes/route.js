const {
  collectAnalytics,
  getAnalytics,
  getCleanAnalytics,
} = require("../controllers/controller");

const express = require("express"),
  router = express.Router();

router.post("/", (req, res) => {
  collectAnalytics(req, res);
});

router.get("/", (req, res) => {
  getAnalytics(req, res);
});

router.get("/clean_data", (req, res) => {
  getCleanAnalytics(req, res);
});

module.exports = router;
