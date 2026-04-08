const mongoose = require("mongoose");

const FarmExpenseSchema = new mongoose.Schema(
    {
        ExpensesID: {
            type: String,
            required: true,
            unique: true
        },
        expenseType: {
            type: String,
            enum: ["FEED", "DAMAGE", "MEDICINE", "EXPENSES", "LABOUR", "OTHER"],
            required: true
        },
        group: {
            type: String, // J or G (or any future group)
            enum: ["J", "G"],
            required: true
        },
        category: {
            type: String, // GOAT, COW, FEED, HEN etc
            required: false
        },
        feedName: {
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
        female:{
            type: String,
            default: "0"
        },
        kids: {
            type: String,
            default: "0"
        },
chicks:{
    type: String,
    default: "0"
},
        cost: {
            type: String,
            required: false
        },

        totalCost: {
            type: String,
            required: false
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
        paymentMode: {
            type: String,
            default: ""
        },
        payerName: {
            type: String,
            default: ""
        },
        payerNumber: {

            type: String,
            default: ""
        },
averagePerEgg:{
type:String

    },
      batchName:{
    type:String,
    default:""
  },

}

);

module.exports = mongoose.model("FarmExpenses", FarmExpenseSchema);
