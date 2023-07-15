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

// Using the express API
app.use(express.json());

app.post("/images", async (req, res) => {
  const image = new Images({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newImageObj = await image.save();
    res.status(201).json(newImageObj);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Images.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});
