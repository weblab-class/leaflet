const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  // author: String,
  // **************** NEWLY ADDED *************** //
  currentPage: Number,
  totalPages: Number,
  content: [String],
  plantType: String,
  userId: String,
});

// compile model from schema
module.exports = mongoose.model("book", BookSchema);
