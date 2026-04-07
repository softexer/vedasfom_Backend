var express = require('express');
var router = express.Router();
var ReceviedStock = require('../Controllers/receviedstock/receviedstock');
var ReceviedStockData = require('../app/Models/stock');
var ExpensesModel = require('../app/Models/expenses')
var fileupload = require('express-fileupload');
router.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 } }));
router.post("/addreceviedstock", (req, res) => {
    ReceviedStock.addreceviedstock(req, res)
})
router.post("/addsalestock", (req, res) => {
    ReceviedStock.addsalestockdata(req, res)
})

router.put("/updatereceviedstock", (req, res, next) => {
    ReceviedStock.updatereceviedstock(req, res)
})
router.post("/fetchreceviedstock", (req, res, next) => {
    ReceviedStock.fetchreceviedstock(req, res)
})
router.delete("/deletereceviedstock", (req, res, next) => {
    ReceviedStock.deletereceviedstock(req, res)
})
router.post("/addexpenses", (req, res) => {
    ReceviedStock.addexpensesstockData(req, res)
})
router.get("/fetchstock", (req, res) => {
    const { address } = req.query;

    var params = req.query;
    console.log(params);

    // or req.query / req.params

    const group = params.address; // req.body.group / req.params.group

    ReceviedStockData.aggregate([
        { $match: { group: group } },

        {
            $group: {
                _id: {
                    category: "$category",
                    group: "$group",
                    breederName: "$breederName",
                    feedName: "$feedName",
                    cost: "$cost",
                    totalCost: "$totalCost"
                },
                male: {
                    $sum: {
                        $convert: { input: "$male", to: "int", onError: 0, onNull: 0 }
                    }
                },
                female: {
                    $sum: {
                        $convert: { input: "$female", to: "int", onError: 0, onNull: 0 }
                    }
                },
                kids: {
                    $sum: {
                        $convert: { input: "$kids", to: "int", onError: 0, onNull: 0 }
                    }
                },
                averageWeight: {
                    $avg: {
                        $convert: { input: "$averageWeight", to: "double", onError: 0, onNull: 0 }
                    }
                }
            }
        },

        {
            $lookup: {
                from: "salestocks",
                let: {
                    category: "$_id.category",
                    group: "$_id.group",
                    feedName: "$_id.feedName"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $toUpper: "$group" }, { $toUpper: "$$group" }] },
                                    { $eq: [{ $toUpper: "$category" }, { $toUpper: "$$category" }] },
                                    {
                                        $or: [
                                            { $ne: [{ $toUpper: "$$category" }, "FEED"] },
                                            { $eq: [{ $toUpper: "$feedName" }, { $toUpper: "$$feedName" }] }
                                        ]
                                    }
                                ]
                            }
                        }
                    },

                    {
                        $group: {
                            _id: null,
                            male: {
                                $sum: {
                                    $convert: { input: "$male", to: "int", onError: 0, onNull: 0 }
                                }
                            },
                            female: {
                                $sum: {
                                    $convert: { input: "$female", to: "int", onError: 0, onNull: 0 }
                                }
                            },
                            kids: {
                                $sum: {
                                    $convert: { input: "$kids", to: "int", onError: 0, onNull: 0 }
                                }
                            }
                        }
                    }
                ],
                as: "saleStock"
            }
        },
        {
            $lookup: {
                from: "farmexpenses",
                let: {
                    category: "$_id.category",
                    group: "$_id.group",
                    feedName: "$_id.feedName"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $toUpper: "$group" }, { $toUpper: "$$group" }] },
                                    { $eq: [{ $toUpper: "$category" }, { $toUpper: "$$category" }] },
                                    {
                                        $or: [
                                            { $ne: [{ $toUpper: "$$category" }, "FEED"] },
                                            { $eq: [{ $toUpper: "$feedName" }, { $toUpper: "$$feedName" }] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                    ,
                    {
                        $group: {
                            _id: null,
                            male: {
                                $sum: {
                                    $convert: { input: "$male", to: "int", onError: 0, onNull: 0 }
                                }
                            },
                            female: {
                                $sum: {
                                    $convert: { input: "$female", to: "int", onError: 0, onNull: 0 }
                                }
                            },
                            kids: {
                                $sum: {
                                    $convert: { input: "$kids", to: "int", onError: 0, onNull: 0 }
                                }
                            }
                        }
                    }
                ],
                as: "farmExpense"
            }
        },
        {
            $addFields: {
                saleMale: { $ifNull: [{ $arrayElemAt: ["$saleStock.male", 0] }, 0] },
                saleFemale: { $ifNull: [{ $arrayElemAt: ["$saleStock.female", 0] }, 0] },
                saleKids: { $ifNull: [{ $arrayElemAt: ["$saleStock.kids", 0] }, 0] },
                expMale: { $ifNull: [{ $arrayElemAt: ["$farmExpense.male", 0] }, 0] },
                expFemale: { $ifNull: [{ $arrayElemAt: ["$farmExpense.female", 0] }, 0] },
                expKids: { $ifNull: [{ $arrayElemAt: ["$farmExpense.kids", 0] }, 0] }
            }
        },

        {
            $project: {
                _id: 0,
                category: "$_id.category",
                group: "$_id.group",
                breederName: "$_id.breederName",
                feedName: "$_id.feedName",
                cost: "$_id.cost",
                totalcost: "$_id.totalCost",

                male: {
                    $toString: {
                        $max: [
                            {
                                $subtract: [
                                    { $subtract: ["$male", "$saleMale"] },
                                    "$expMale"
                                ]
                            },
                            0
                        ]
                    }
                },
                female: {
                    $toString: {
                        $max: [
                            {
                                $subtract: [
                                    { $subtract: ["$female", "$saleFemale"] },
                                    "$expFemale"
                                ]
                            },
                            0
                        ]
                    }
                },
                kids: {
                    $toString: {
                        $max: [
                            {
                                $subtract: [
                                    { $subtract: ["$kids", "$saleKids"] },
                                    "$expKids"
                                ]
                            },
                            0
                        ]
                    }
                },

                averageWeight: {
                    $toString: { $round: ["$averageWeight", 2] }
                }
            }
        }
    ])


        .then(result => {

            return res.json({ response: 3, message: "Total stock data fetch successfully", TotalStcok: result })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
})
var stcokData = require('../app/Models/stock');
var SalesModel = require('../app/Models/salestock');
const ExcelJS = require("exceljs");
function formatDateFromTimestamp(ts) {
    if (!ts) return "N/A";

    const date = new Date(Number(ts)); // works for 13-digit
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
}

router.get("/stockdownload", async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ message: "address required" });
        }

        // Fetch stock records
        const records = await stcokData
            .find({ group: address })
            .lean()
            .exec();

        if (!records.length) {
            return res.json({ response: 0, message: "No data found" });
        }

        // =========================
        // Prepare Excel Rows
        // =========================
        const excelRows = records.map(doc => ({
            Category: doc.category || "N/A",
            BreederName: doc.breederName || "",
            FeedName: doc.feedName || "",
            Male: Number(doc.male || 0),
            Female: Number(doc.female || 0),
            Kids: Number(doc.kids || 0),
            AverageWeight: Number(doc.averageWeight || 0),
            TotalWeight: Number(doc.totalWeight || 0),
            Cost: Number(doc.cost || 0),
            TotalCost: Number(doc.totalCost || 0),
            Description: doc.description || "",

            // ✅ timestamp → dd-mm-yyyy
            Date: formatDateFromTimestamp(
                doc.timestamp
            )
        }));


        // =========================
        // Create Excel
        // =========================
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Stock Report");

        worksheet.columns = [
            { header: "Date", key: "Date", width: 15 },
            { header: "Category", key: "Category", width: 15 },
            { header: "Breeder Name", key: "BreederName", width: 20 },
            { header: "Feed Name", key: "FeedName", width: 15 },
            { header: "Male", key: "Male", width: 10 },
            { header: "Female", key: "Female", width: 10 },
            { header: "Kids", key: "Kids", width: 10 },
            { header: "Avg Weight", key: "AverageWeight", width: 15 },
            { header: "Total Weight", key: "TotalWeight", width: 15 },
            { header: "Cost", key: "Cost", width: 12 },
            { header: "Total Cost", key: "TotalCost", width: 15 },
            { header: "Description", key: "Description", width: 30 },
        ];

        worksheet.addRows(excelRows);

        // =========================
        // Header Styling
        // =========================
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center" };
        });

        // =========================
        // Download Excel
        // =========================
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Stock_Report_${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("stockdownload error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
});



router.get("/report", async (req, res) => {
    try {
        const { address } = req.query;

        const records = await stcokData
            .find({ group: address })
            .lean()
            .exec();

        if (!records.length) {
            return res.json({ response: 0, message: "No data found" });
        }

        // 1️⃣ COST (from LivestockModel)
        const costData = await ReceviedStockData.aggregate([
            { $match: { group: address } },
            {
                $group: {
                    _id: "$category",
                    totalCost: {
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
            }
        ]);

        // 2️⃣ SELL COST (from SalesModel)
        const sellData = await SalesModel.aggregate([
            { $match: { group: address } },
            {
                $group: {
                    _id: "$category",
                    SellCost: {
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
            }
        ]);

        // 3️⃣ MERGE BOTH RESULTS BY CATEGORY
        const map = new Map();
        console.log("cost", sellData)
        // Add cost from LivestockModel
        costData.forEach(item => {
            map.set(item._id, {
                Category: item._id,
                totalCost: item.totalCost.toString(),
                SellCost: "0"
            });
        });

        // Add SellCost from SalesModel
        sellData.forEach(item => {
            if (map.has(item._id)) {
                map.get(item._id).SellCost = item.SellCost;
            } else {
                // category exists only in sales
                map.set(item._id, {
                    Category: item._id,
                    Cost: "0",
                    SellCost: item.SellCost.toString()
                });
            }
        });

        const finalOutput = Array.from(map.values());
const damageSummary = await ExpensesModel.aggregate([
    {
        $match: {
            group: address,
            expenseType: "DAMAGE"
        }
    },
    {
        $group: {
            _id: "$category",

            // Convert string to number
            male: {
                $sum: {
                    $convert: {
                        input: "$male",
                        to: "int",
                        onError: 0,
                        onNull: 0
                    }
                }
            },

            kids: {
                $sum: {
                    $convert: {
                        input: "$kids",
                        to: "int",
                        onError: 0,
                        onNull: 0
                    }
                }
            },

            Amount: {
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
            Category: "$_id",
            male: 1,
            kids: 1,
            Amount: 1
        }
    }
]);

const FeedSummary = await ExpensesModel.aggregate([
    {
        $match: {
            group: address,
            expenseType: "FEED"
        }
    },
    {
        $group: {
            _id: "$category",

            // Convert string to number
            male: {
                $sum: {
                    $convert: {
                        input: "$male",
                        to: "int",
                        onError: 0,
                        onNull: 0
                    }
                }
            },

            kids: {
                $sum: {
                    $convert: {
                        input: "$kids",
                        to: "int",
                        onError: 0,
                        onNull: 0
                    }
                }
            },

            Amount: {
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
            Category: "$_id",
            male: 1,
            kids: 1,
            Amount: 1
        }
    }
]);

const OtherSummary = await ExpensesModel.aggregate([
    {
        $match: {
            group: address,
            expenseType: "OTHER"
        }
    },
    {
        $group: {
            _id: "$category",

            // Convert string to number
            male: {
                $sum: {
                    $convert: {
                        input: "$male",
                        to: "int",
                        onError: 0,
                        onNull: 0
                    }
                }
            },

            kids: {
                $sum: {
                    $convert: {
                        input: "$kids",
                        to: "int",
                        onError: 0,
                        onNull: 0
                    }
                }
            },

            Amount: {
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
            Category: "$_id",
            male: 1,
            kids: 1,
            Amount: 1
        }
    }
]);

const overall = await ExpensesModel.aggregate([
    { 
        $match: { group: address }
    },

    // total investment
    {
        $group: {
            _id: null,
            TotalInvestment: {
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

    // lookup sales
    {
        $lookup: {
            from: "salestocks",
            pipeline: [
                {
                    $group: {
                        _id: null,
                        TotalSales: {
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
                }
            ],
            as: "salesData"
        }
    },

     {
        $lookup: {
            from: "livestocks",
            pipeline: [
                {
                    $group: {
                        _id: null,
                        TotalinvestData: {
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
                }
            ],
            as: "livestocksData"
        }
    },

    // extract sales amount
    {
        $addFields: {
            TotalSales: { 
                $ifNull: [
                    { $arrayElemAt: ["$salesData.TotalSales", 0] },
                    0
                ]
            }
        }
    },
    
     {
        $addFields: {
            TotalinvestData: { 
                $ifNull: [
                    { $arrayElemAt: ["$livestocksData.TotalinvestData", 0] },
                    0
                ]
            }
        }
    },
  {
        $addFields: {
            TotalInvestment: { $sum: ["$TotalInvestment", "$TotalinvestData"] }
        }
    },
    // Net Profit = Total Sales - Total Investment
    {
        $addFields: {
            NetProfit: { $subtract: ["$TotalSales", "$TotalInvestment"] }
        }
    },

    {
        $project: {
            _id: 0,
            TotalInvestment: 1,
            TotalSales: 1,
            NetProfit: 1
        }
    }
]);
        return res.json({ response: 3, message: "Total stock data fetch successfully", TotalInvestment: finalOutput, DamageSummary: damageSummary, FeedSummary: FeedSummary, OtherSummary: OtherSummary,OverallProfitLoss: overall
})




    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

function formatDate(ts) {
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}



router.get("/fetchstock-download", async (req, res) => {
    const today = formatDate(Date.now());

    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ message: "address required" });
        }

        const group = address;

        const data = await ReceviedStockData.aggregate([
            { $match: { group } },

            {
                $group: {
                    _id: {
                        category: "$category",
                        group: "$group",
                        breederName: "$breederName",
                        feedName: "$feedName"
                    },
                    male: { $sum: { $convert: { input: "$male", to: "int", onError: 0, onNull: 0 } } },
                    female: { $sum: { $convert: { input: "$female", to: "int", onError: 0, onNull: 0 } } },
                    kids: { $sum: { $convert: { input: "$kids", to: "int", onError: 0, onNull: 0 } } },
                    averageWeight: {
                        $avg: { $convert: { input: "$averageWeight", to: "double", onError: 0, onNull: 0 } }
                    }
                }
            },

            {
                $project: {
                    rows: {
                        $cond: [
                            { $gt: ["$kids", 0] },
                            [
                                {
                                    category: "$_id.category",
                                    group: "$_id.group",
                                    male: "$male",
                                    female: "$female",
                                    feedName: "$_id.feedName",
                                    breederName: "$_id.breederName",
                                    kids: 0,
                                    averageWeight: { $round: ["$averageWeight", 2] }
                                },
                                {
                                    category: "$_id.category",
                                    group: "$_id.group",
                                    male: "0",
                                    female: "0",
                                    kids: "$kids",
                                    feedName: "$_id.feedName",
                                    breederName: "$_id.breederName",
                                    averageWeight: { $round: ["$averageWeight", 2] }
                                }
                            ],
                            [
                                {
                                    category: "$_id.category",
                                    group: "$_id.group",
                                    male: "$male",
                                    female: "$female",
                                    kids: "$kids",
                                    feedName: "$_id.feedName",
                                    breederName: "$_id.breederName",
                                    averageWeight: { $round: ["$averageWeight", 2] }
                                }
                            ]
                        ]
                    }
                }
            },

            { $unwind: "$rows" },
            { $replaceRoot: { newRoot: "$rows" } },
            { $addFields: { timestamp: { $toLong: "$$NOW" } } }
        ]);

        // ======================
        // Excel creation
        // ======================
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Stock Report");

        sheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Category", key: "category", width: 15 },
            { header: "Breeder Name", key: "breederName", width: 20 },
            { header: "Feed Name", key: "feedName", width: 15 },
            { header: "Male", key: "male", width: 10 },
            { header: "Female", key: "female", width: 10 },
            { header: "Kids", key: "kids", width: 10 },
            { header: "Avg Weight", key: "averageWeight", width: 15 },

        ];

        data.forEach(row => {
            sheet.addRow({
                category: row.category,
                group: row.group,
                male: row.male,
                female: row.female,
                kids: row.kids,
                averageWeight: row.averageWeight,
                feedName: row.feedName,
                breederName: row.breederName,
                date: today // ✅ dd-mm-yyyy
            });
        });

        sheet.getRow(1).font = { bold: true };

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Stock_Report_${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

