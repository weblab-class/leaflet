const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  name: String,
});

// compile model from schema
module.exports = mongoose.model("plant", PlantSchema);
