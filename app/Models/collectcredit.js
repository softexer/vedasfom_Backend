const mongoose = require("mongoose");

const CreditPersonSchema = new mongoose.Schema({
    creditperson: {
        type: String,
        required: false
    },

    creditpersonphoneNumber: {
        type: String,
        required: false,
        default:""
    },
    group: { type: String },
    credits: [
        {
            category: {
                type: String,
                required: true
            },
            totalCost: {
                type: String,
                required: true,
                default: "0"
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CreditPerson", CreditPersonSchema);