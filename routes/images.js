const express = require("express");
const router = express.Router();

// Upload image
router.post("/", (req, res) => {});

// Get all images
router.get("/", (req, res) => {
  res.send("Hello world!");
});

module.exports = router;
