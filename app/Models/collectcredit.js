const mongoose = require("mongoose");

const CreditPersonSchema = new mongoose.Schema({
    creditperson: {
        type: String,
        required: false
    },

    creditpersonphoneNumber: {
        type: String,
        required: false
    },
    group: { type: String },
    credits: [
        {
            category: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
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