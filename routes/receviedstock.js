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
        // 1️⃣ Match ONLY by group
        {
            $match: {
                group: group
            }
        },

        // 2️⃣ Group by category + breederName
        {
            $group: {
                _id: {
                    category: "$category",
                    breederName: "$breederName"
                },
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
                female: {
                    $sum: {
                        $convert: {
                            input: "$female",
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
                averageWeight: {
                    $avg: {
                        $convert: {
                            input: "$averageWeight",
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }
            }
        },

        // 3️⃣ Project final output
       {
    $project: {
      _id: 0,
      group: "$_id.group",
      breederName: "$_id.breederName",
category: "$_id.category",
      male: { $toString: "$male" },
      female: { $toString: "$female" },
      kids: { $toString: "$kids" },

      averageWeight: {
        $toString: { $round: ["$averageWeight", 2] }
      }
    }
  }
])


        .then(result => {

            res.json({ response: 3, message: "Total stock data fetch successfully", TotalStcok: result })

            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
})
module.exports = router;

