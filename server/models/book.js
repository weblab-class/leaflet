const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  currentPage: Number,
  totalPages: Number,
  content: String,
  plantImage: String,
  userId: String,
});

// compile model from schema
module.exports = mongoose.model("book", BookSchema);
