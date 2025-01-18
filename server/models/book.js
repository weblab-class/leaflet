const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  // bookID is for easy retrieval of books. It is formatted as the
  // <the order in which it was created by the user>+<title>
  // (title is to to make the link more informative)
  // Don't use just titles as ID as multiple books may
  // have the same title, and this can get confusing
  bookID: Number,
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
