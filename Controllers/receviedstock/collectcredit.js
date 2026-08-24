const express = require("express");
const router = express.Router();
const collectCredit = require("../../app/Models/collectcredit");
const SaleStock = require("../../app/Models/salestock");

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
        if (!group || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "group and at least one credit item are required" });
        }

        // Combine duplicate categories so each payment is deducted once.
        const paymentsByCategory = items.reduce((payments, item) => {
            const amount = Number(item.totalCost);
            if (!item.category || !Number.isFinite(amount) || amount <= 0) {
                const validationError = new Error("Each item must include a category and a positive totalCost");
                validationError.statusCode = 400;
                throw validationError;
            }

            payments.set(item.category, (payments.get(item.category) || 0) + amount);
            return payments;
        }, new Map());

        // A category may have several sale-stock rows. Deduct in order so the
        // complete payment is never subtracted from every matching row.
        const stockUpdates = [];
        for (const [category, payment] of paymentsByCategory) {
            const stockRows = await SaleStock.find({
                group,
                category,
                creditperson
            }).sort({ _id: 1 });

            const available = stockRows.reduce((total, stock) => total + (Number(stock.totalCost) || 0), 0);
            if (available < payment) {
                return res.status(400).json({
                    message: `Credit payment for ${category} exceeds the outstanding sale-stock balance`
                });
            }

            let remainingPayment = payment;
            for (const stock of stockRows) {
                if (remainingPayment <= 0) break;

                const outstanding = Number(stock.totalCost) || 0;
                const deduction = Math.min(outstanding, remainingPayment);
                stockUpdates.push({
                    updateOne: {
                        filter: { _id: stock._id },
                        update: { $set: { totalCost: String(outstanding - deduction) } }
                    }
                });
                remainingPayment -= deduction;
            }
        }

        await SaleStock.bulkWrite(stockUpdates);

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
        res.status(error.statusCode || 500).json({
            message: "Server error while inserting credit person entry",
            error
        });
    }
});

module.exports = router;
