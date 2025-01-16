const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  progress: Number,
  link: String,
});

// compile model from schema
module.exports = mongoose.model("book", BookSchema);
