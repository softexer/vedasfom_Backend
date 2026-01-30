

var { deletereceviedstocksdatavalidations } = require('./validationsreceviedstock');
var ReceviedStockData =require('../../app/Models/stock');
var deletereceviedstocksdata = async (req, res) => {
    try {
        var params = req.body;
        var result = await deletereceviedstocksdatavalidations.validate(params);
        if (result.error) {
            let message = result.error.details[0].message;
            res.statusCode = 400;
            return res.send(message)
        }

        var fetchreceviedstock = await ReceviedStockData.findOne({ ReceviedStockID: params.ReceviedStockID }).exec();
        if (fetchreceviedstock) {
            var receviedstockDatadelete = await ReceviedStockData.deleteOne({ ReceviedStockID: params.ReceviedStockID });
            if (receviedstockDatadelete.deletedCount > 0) {
                return res.json({ response: 3, message: "Recevied Data deleted successfully" })
            } else {
                return res.json({ response: 0, message: "Recevied Data deleted Failure" })
            }
        } else {
            return res.json({ response: 0, message: "Data not found" })
        }
    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    deletereceviedstocksdata
}