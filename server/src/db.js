const mongoose = require("mongoose");
require("dotenv").config();

const connectMongo = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI_LOCAL);

    console.log("Success, MongoDB Connected");

    // Handling connection events
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
  } catch (error) {
    console.error("Error, MongoDB not connected:", error);
  }
};

module.exports = { connectMongo };
