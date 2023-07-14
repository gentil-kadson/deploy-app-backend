const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Images", imagesSchema);
