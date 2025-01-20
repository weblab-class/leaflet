const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  // author: String,
  // **************** NEWLY ADDED *************** //
  // curPage is EVEN, page numbers start from 0...
  curPage: Number,
  totalPages: Number,
  content: [String],
  plantType: String,
  userId: String,
});

// compile model from schema
module.exports = mongoose.model("book", BookSchema);
