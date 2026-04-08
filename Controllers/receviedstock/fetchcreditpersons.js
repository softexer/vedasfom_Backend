const express = require('express');
const SalesStock = require('../../app/Models/salestock'); // Adjust path as needed

const router = express.Router();

// GET API to fetch credit persons from salesstock
router.post('/fetchcreditpersons', async (req, res) => {
    try {
        const { creditPersonName } = req.body;

        if (!creditPersonName) {
            return res.status(400).json({
                success: false,
                message: 'Credit person name is required'
            });
        }

        // Fetch matching records from salesstock
        const summary = await SalesStock.aggregate([
            {
                $match: {
                    creditperson: { $regex: creditPersonName, $options: "i" }
                }
            },
            {
                $group: {
                    _id: "$category",
                    amount: {
                        $sum: {
                            $convert: {
                                input: "$totalCost", // change to your amount field
                                to: "double",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    amount: { $toString: "$amount" }
                }
            }
        ]);
        if (summary.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No matching records found'
            });
        }



        res.status(200).json({
            response: 3, message: "fetch sales data successfully",
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching credit persons',
            error: error.message
        });
    }
});

module.exports = router;