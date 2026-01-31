var express = require('express');
var router = express.Router();
var ReceviedStock = require('../Controllers/receviedstock/receviedstock');
var ReceviedStockData = require('../app/Models/stock');
var fileupload = require('express-fileupload');
router.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 } }));
router.post("/addreceviedstock",(req,res)=>{
    ReceviedStock.addreceviedstock(req,res)
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
router.get("/fetchstocktest",(req,res)=>{
    ReceviedStockData.aggregate([
  {
    $group: {
      _id: {
        category: "$category",
        group: "$group"
      },
      male: { $sum: { $toInt: "$male" } },
      female: { $sum: { $toInt: "$female" } },
      averageWeight: { $avg: { $toDouble: "$averageWeight" } }
    }
  },
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

