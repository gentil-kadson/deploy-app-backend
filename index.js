// Imports
import express from "express";
import mongoose from "mongoose";

// Configuring express
const app = express();
const port = 3000;

// Configuring mongoose
// Creating images Schema
const imagesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// Connecting to DB and instanciating images model
mongoose.connect(
  "mongodb+srv://kadson:a7x@cluster0.mmdhgv2.mongodb.net/?retryWrites=true&w=majority"
);
const db = mongoose.connection;
const Images = db.model("Image", imagesSchema);

// Seeing if there's any error on connection
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Oi Beto");
});

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});
