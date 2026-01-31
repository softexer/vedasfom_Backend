const mongoose = require("mongoose");
var dbs = require('./DBConnection')

const livestockSchema = new mongoose.Schema({
    LivestockID: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: [
      "HEN",
      "SHEEP",
      "COW",
      "GOAT",
      "PIG",
      "FEED"
    ],
    required: true
  },

  group: {
    type: String, // J or G (or any future group)
    enum: ["J", "G"],
    required: true
  },

  breederName: {
    type: String
  },
  quantity:{
    type:String
},
averagePerEgg:{
     type:String
},
feedName:{
type:String
},
  male: {
    type: String,
    default: "0"
  },

  female: {
    type: String,
    default: "0"
  },

  kids: {
    type: String,
    default: "0"
  },

  averageWeight: {
    type: String,
    default: "0"
  },

  totalWeight: {
    type: String,
    default: "0"
  },

  cost: {
    type: String,
    default: "0"
  },

  totalCost: {
    type: String,
    default: "0"
  },

  stand: {
    type: String
  },

  description: {
    type: String
  },

  image: {
    type: String
  },

  timestamp: {
    type: String,
    default: ""
  }
});
dbs.connectToDB();

module.exports = mongoose.model("Livestock", livestockSchema);
