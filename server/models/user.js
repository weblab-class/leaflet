const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  // For setting IDs of books
  numberBooksCreated: Number,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
