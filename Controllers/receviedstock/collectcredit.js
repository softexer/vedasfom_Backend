const express = require("express");
const router = express.Router();
const collectCredit = require("../../app/Models/collectcredit");

// INSERT CREDIT PERSON ENTRY
router.post("/insertcreditamount", async (req, res) => {
    try {
        const {
            creditperson,
            items,
            group
        } = req.body;

        if (!creditperson || creditperson.trim() === "") {
            return res.status(400).json({ message: "creditperson is required" });
        }
        const findperson = await collectCredit.findOne({ creditperson, group });
        if (findperson) {

            items.forEach(item => {
                findperson.credits.push({
                    category: item.category,
                    totalCost: item.totalCost
                });
            });

            await findperson.save();

            return res.status(200).json({
                response: "3",
                message: "Credit person entry updated successfully",
                data: findperson
            });
        }

        const newEntry = new collectCredit({
            creditperson,
            group,
            credits: items.map(item => ({
                category: item.category,
                totalCost: item.totalCost
            }))
        });

        await newEntry.save();
        res.status(200).json({
            response: "3",
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