// Imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import aws from "aws-sdk";
import multer from "multer";
import fs from "fs";

// Configuring dotenv lib
dotenv.config();

// Configuring AWS lib
const s3 = new aws.S3({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.ACCESS_SECRET,
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

// instancianting multer
const upload = multer({ dest: "../deploy-app-front/images" });

// Configuring body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/upload", upload.single("imageUrl"), async (req, res) => {
  const imagePath = req.file.path;
  const blob = fs.readFileSync(imagePath);

  await s3
    .putObject({
      Body: blob,
      Bucket: process.env.BUCKET,
      Key: req.file.originalname,
    })
    .promise();

  const image = new Images({
    title: req.body.title,
    imageUrl: req.file.originalname,
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
    const images = await Images.find();

    const imagesKey = images.map((imageObj) => imageObj.imageUrl);

    const getObjectPromises = imagesKey.map((key) => {
      const params = {
        Bucket: process.env.BUCKET,
        Key: key,
      };

      return s3.getSignedUrl("getObject", params);
    });

    const awsRealImages = [];
    Promise.all(getObjectPromises).then((results) => {
      results.forEach((data) => {
        awsRealImages.push(data);
      });
      res.send({ bdObjects: images, awsRealImages });
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});
