var express = require('express');
var router = express.Router();
var ReceviedStock = require('../Controllers/receviedstock/receviedstock');
router.post("/addreceviedstock",(req,res,next)=>{
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
module.exports = router;

