var {addreceviedstockdata}= require('./insertreceviedstock');
var {updatereceviedstocksdata} = require('./updatereceviedstock');
var {fetchreceviedstocksdata} = require('./fetchreceviedstock');
var {deletereceviedstocksdata} = require('./deletereceviedstock');
var {addsalestockdata}= require('./insertsalestock');
var {addexpensesData} = require('./insertExpenses');
var addreceviedstock = (req,res)=>{
    addreceviedstockdata(req,res)
};
var addsalestock = (req,res)=>{
    addsalestockdata(req,res)
};
var updatereceviedstock = (req,res)=>{
    updatereceviedstocksdata(req,res)
}
var fetchreceviedstock =(req,res)=>{
    fetchreceviedstocksdata(req,res)
}
var deletereceviedstock =(req,res)=>{
    deletereceviedstocksdata(req,res)
}
var addexpensesData =(req,res)=>{
    addexpensesData(req,res)
}
module.exports={
    addreceviedstock,
    updatereceviedstock,
    fetchreceviedstock,
    deletereceviedstock,
    addsalestockdata,
    addexpensesData
}
