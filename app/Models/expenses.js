const mongoose = require("mongoose");

const FarmExpenseSchema = new mongoose.Schema(
    {

        expenseType: {
            type: String,
            enum: ["FEED", "DAMAGE", "MEDICINE", "EXPENSES","LABOUR", "OTHER"],
            required: true
        },

        category: {
            type: String, // GOAT, COW, FEED, HEN etc
            required: true
        },
        feedname: {
            type: String,
            default: ""
        },

        breederName: {
            type: String,
            default: ""
        },

        quantity: {
            type: String,
            default: "0"
        },

        male: {
            type: String,
            default: "0"
        },
        kids: {
            type: String,
            default: "0"
        },

        cost: {
            type: String,
            required: true
        },

        totalCost: {
            type: String,
            required:false
        },

        customerPhoneNumber: {
            type: String,
            default: ""
        },

        damageReason: {
            type: String,
            default: ""
        },

        timeStamp: {
            type: String, 
            required: false
        },

        image: {
            type: String, // audio file URL
            default: ""
        },

        voiceRecord: {
            type: String, // audio file URL
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        createdBy: {
            userID: String,
            userName: String
        },

        
    },


);

module.exports = mongoose.model("FarmExpenses", FarmExpenseSchema);
