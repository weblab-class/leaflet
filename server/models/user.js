const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  firstTimeLoggingIn: { type: Boolean, default: true },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
