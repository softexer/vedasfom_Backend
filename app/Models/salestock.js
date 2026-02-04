const mongoose = require("mongoose");
var dbs = require('./DBConnection')

const salestockSchema = new mongoose.Schema({
    SalestockID: {
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
            "FEED",
            "EGG",
            "NATI"
        ],
        required: true
    },
    chicks: {
        type: String,
        default: "0"
    },
    group: {
        type: String, // J or G (or any future group)
        enum: ["J", "G"],
        required: true
    },

    breederName: {
        type: String
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
    },
    quantity: {
        type: String
    },
    averagePerEgg: {
        type: String
    },
    sellerPhonerNumber: {
        type: String,
        default: ""
    },
    paymentMode: {
        type: String,
        default: ""
    },
    creditperson: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Salestock", salestockSchema);
