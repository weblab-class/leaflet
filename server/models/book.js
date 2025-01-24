const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  curPage: Number,
  totalPages: Number,
  plantType: String,
  userId: String,
  content: [String],
  bookType: {
    type: String,
    enum: ["upload", "search", "physical"],
    required: true,
  },
});

// compile model from schema
module.exports = mongoose.model("book", BookSchema);
