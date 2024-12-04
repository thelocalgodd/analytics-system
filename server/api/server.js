const express = require("express"),
  app = express(),
  cors = require("cors"),
  { connectMongo } = require("../src/db");

require("dotenv").config();

const mainRoute = require("../routes/route");

const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Connect to MongoDB
connectMongo();

// test route
app.get("/hello", (req, res) => {
  res.send("hello world, hi");
});

// routes
app.use("/api", mainRoute);

app.get("/api/docs", (req, res) => {});

app.listen(PORT, () => {
  console.log(`App Running on http://localhost:${PORT}`);
});
