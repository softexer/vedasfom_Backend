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
    console.log(params);

ReceviedStockData.aggregate([
  // 0️⃣ Match group from params
  {
    $match: {
      group: params.address
    }
  },

  // 1️⃣ Group received stock
  {
    $group: {
      _id: {
        category: "$category",
        group: "$group"
      },
      receivedMale: {
        $sum: {
          $convert: {
            input: "$male",
            to: "int",
            onError: 0,
            onNull: 0
          }
        }
      },
      receivedFemale: {
        $sum: {
          $convert: {
            input: "$female",
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

  // 2️⃣ Join sale stock (same group only)
  {
    $lookup: {
      from: "salestocks",
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
            soldMale: {
              $sum: {
                $convert: {
                  input: "$male",
                  to: "int",
                  onError: 0,
                  onNull: 0
                }
              }
            },
            soldFemale: {
              $sum: {
                $convert: {
                  input: "$female",
                  to: "int",
                  onError: 0,
                  onNull: 0
                }
              }
            }
          }
        }
      ],
      as: "saleData"
    }
  },

  // 3️⃣ Safe defaults
  {
    $addFields: {
      soldMale: {
        $ifNull: [{ $arrayElemAt: ["$saleData.soldMale", 0] }, 0]
      },
      soldFemale: {
        $ifNull: [{ $arrayElemAt: ["$saleData.soldFemale", 0] }, 0
        ]
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

  // 5️⃣ Final output
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

