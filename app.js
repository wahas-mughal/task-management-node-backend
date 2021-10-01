// Initialize express
const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const authRoute = require("./apis/routes/auth");

//initialze dotenv for environmental variables
dotenv.config();

//connect to MongoDB
mongoose.connect(
  `mongodb+srv://Admin:${
    process.env.MONGO_DB_PWD
  }@clusterfornodebackend.silgx.mongodb.net/${[
    process.env.MONGO_DB,
  ]}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  },
  () => console.log("connected to MongoDB..")
);

//initialize morgan for http request logging
app.use(morgan("dev"));

//make upload folder static to access it publicly
app.use("/uploads", express.static("uploads"));

//initialize the body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//auth route
app.use("/", authRoute);

module.exports = app;
