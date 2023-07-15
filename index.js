// Imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Configuring dotenv lib
dotenv.config();

// Configuring AWS lib
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});

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
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
const Images = db.model("Image", imagesSchema);

// Seeing if there's any error on connection
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Configuring body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/upload", upload.single("imageUrl"), async (req, res) => {
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

app.get("/api/images", async (req, res) => {
  try {
    // Get image files from s3 bucket
    const response = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    const imageFiles = response.Contents.map((item) => item.Key);

    // Sending objects to user
    const images = await Images.find();
    res.json({ bdObjects: images, files: imageFiles });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});
