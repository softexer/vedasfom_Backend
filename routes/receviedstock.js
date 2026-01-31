var express = require('express');
var router = express.Router();
var ReceviedStock = require('../Controllers/receviedstock/receviedstock');
var ReceviedStockData = require('../app/Models/stock');
var fileupload = require('express-fileupload');
router.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 } }));
router.post("/addreceviedstock",(req,res)=>{
    ReceviedStock.addreceviedstock(req,res)
})
router.post("/addsalestock",(req,res)=>{
    ReceviedStock.addsalestockdata(req,res)
})

router.put("/updatereceviedstock",(req,res,next)=>{
    ReceviedStock.updatereceviedstock(req,res)
})
router.post("/fetchreceviedstock",(req,res,next)=>{
    ReceviedStock.fetchreceviedstock(req,res)
})
router.delete("/deletereceviedstock",(req,res,next)=>{
    ReceviedStock.deletereceviedstock(req,res)
})
router.get("/fetchstock",(req,res)=>{
  const { address } = req.query;

    var params = req.query;
 ReceviedStockData.aggregate([
    {$match: {group: params.address}},
  // 1️⃣ Group received stock
  {
    $group: {
      _id: {
        category: "$category",
        group: "$group",
        feedName: "$feedName"
      },
      receivedMale: { $sum: { $toInt: "$male" } },
      receivedFemale: { $sum: { $toInt: "$female" } },
      averageWeight: { $avg: { $toDouble: "$averageWeight" } }
    }
  },

  // 2️⃣ Join sales stock
  {
    $lookup: {
      from: "salestocks", // ⚠️ collection name (plural, lowercase)
      let: {
        category: "$_id.category",
        group: "$_id.group"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$category", "$$category"] },
                { $eq: ["$group", "$$group"] }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            soldMale: { $sum: { $toInt: "$male" } },
            soldFemale: { $sum: { $toInt: "$female" } }
          }
        }
      ],
      as: "saleData"
    }
  },

  // 3️⃣ Calculate remaining stock
  {
    $addFields: {
      soldMale: {
        $ifNull: [{ $arrayElemAt: ["$saleData.soldMale", 0] }, 0]
      },
      soldFemale: {
        $ifNull: [{ $arrayElemAt: ["$saleData.soldFemale", 0] }, 0]
      }
    }
  },

  // 4️⃣ Minus logic
  {
    $addFields: {
      male: { $subtract: ["$receivedMale", "$soldMale"] },
      female: { $subtract: ["$receivedFemale", "$soldFemale"] }
    }
  },

  // 5️⃣ Final projection
  {
    $project: {
      _id: 0,
      category: "$_id.category",
      group: "$_id.group",
      male: { $toString: "$male" },
      female: { $toString: "$female" },
      averageWeight: {
        $toString: { $round: ["$averageWeight", 2] }
      }
    }
  }
])

    .then(result => {

         res.json({ response: 3, message: "Total stock data fetch successfully",TotalStcok:result})

        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });
})
module.exports = router;

