const express = require("express");
const router = express.Router();
const Images = require("../models/images");

// Upload image
router.post("/", async (req, res) => {
  const image = new Images({
    title: req.body.title,
    filePath: req.body.fileName,
  });

  try {
    const newImageObj = await image.save();
    res.status(201).json(newImageObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all images
router.get("/", async (req, res) => {
  try {
    const images = await Images.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
