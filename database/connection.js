let mongoose = require("mongoose");
require("dotenv").config();
let dbName = "PersonalLibrary";

async function main(callback) {

  try {
    await mongoose
      .connect(process.env.MONGO_URI + "/" + dbName,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("database connection successful");
      })
      .catch((err) => {
        console.log("database error:", err);
        console.log("database connection error");
      });
      callback();
  } catch (error) {
    console.log(error);
    throw new Error("Database connection error");
  }
}

module.exports = main;