const express = require("express");
const router = express.Router();
const collectCredit = require("../../app/Models/collectcredit");

// INSERT CREDIT PERSON ENTRY
router.post("/insertcreditamount", async (req, res) => {
    try {
        const {
            creditperson,
            category,
            totalCost,
            group
        } = req.body;

        if (!creditperson || creditperson.trim() === "") {
            return res.status(400).json({ message: "creditperson is required" });
        }

        const newEntry = new collectCredit({
            creditperson,
            category,
            totalCost,
            group
        });

        await newEntry.save();

        res.status(200).json({
            response:"3",
            message: "Credit person entry added successfully",
            data: newEntry
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while inserting credit person entry",
            error
        });
    }
});

module.exports = router;