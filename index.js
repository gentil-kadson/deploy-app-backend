// Configuring dotenv library
require("dotenv").config();

// Configuring express
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

// Configuring mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

// Setting mongoose up for errors and initial start
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database 'images'"));

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});

const imagesRouter = require("./routes/images");
app.use("/images", imagesRouter);
