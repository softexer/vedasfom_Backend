var express = require('express');
var router = express.Router();
var ReceviedStock = require('../Controllers/receviedstock/receviedstock');
var ReceviedStockData = require('../app/Models/stock');
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
router.get("/fetchstock", (req, res) => {
    const { address } = req.query;

    var params = req.query;
    console.log(params);

    // or req.query / req.params

    const group = params.address; // req.body.group / req.params.group

   ReceviedStockData.aggregate([
  {
    $match: { group: group }
  },
  {
    $group: {
      _id: {
        category: "$category",
        group: "$group",
        breederName: "$breederName",
        feedName: "$feedName"
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

  // 🔥 CREATE 1 OR 2 ROWS
  {
    $project: {
      rows: {
        $cond: [
          { $gt: ["$kids", 0] },

          // 👉 IF kids > 0 → TWO ROWS
          [
            {
              category: "$_id.category",
              group: "$_id.group",
              male: { $toString: "$male" },
              female: { $toString: "$female" },
              kids: "0",
              averageWeight: {
                $toString: { $round: ["$averageWeight", 2] }
              }
            },
            {
              category: "$_id.category",
              group: "$_id.group",
              male: "0",
              female: "0",
              kids: { $toString: "$kids" },
              averageWeight: "250"
            }
          ],

          // 👉 ELSE → SINGLE NORMAL ROW
          [
            {
              category: "$_id.category",
              group: "$_id.group",
              male: { $toString: "$male" },
              female: { $toString: "$female" },
              kids: { $toString: "$kids" },
              averageWeight: {
                $toString: { $round: ["$averageWeight", 2] }
              }
            }
          ]
        ]
      }
    }
  },

  // 🔥 FLATTEN INTO SAME RESPONSE ARRAY
  { $unwind: "$rows" },
  { $replaceRoot: { newRoot: "$rows" } }
])




        .then(result => {

            return res.json({ response: 3, message: "Total stock data fetch successfully", TotalStcok: result })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
})
var stcokData = require('../app/Models/stock');
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

module.exports = router;

