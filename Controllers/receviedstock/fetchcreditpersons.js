const express = require('express');
const SalesStock = require('../../app/Models/salestock'); // Adjust path as needed

const router = express.Router();

// GET API to fetch credit persons from salesstock
router.get('/fetchcreditpersons', async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Credit person name is required'
            });
        }

        // Fetch matching records from salesstock
const summary = await SalesStock.aggregate([
    {
        $match: {
            group: address,
            creditperson: { 
                $ne: "",
               
            }
        }
    },
    {
        $group: {
            _id: {
                creditperson: "$creditperson",
                category: "$category"
            },
            amount: {
                $sum: {
                    $convert: {
                        input: "$totalCost",
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
            creditpersonName: "$_id.creditperson",
            previousPaid:"0",
            category: "$_id.category",
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