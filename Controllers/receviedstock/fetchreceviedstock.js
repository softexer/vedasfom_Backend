
var { fetchreceviedstocksdatavalidations } = require('./validationsreceviedstock');
var ReceviedStockData = require('../../app/Models/stock');
var fetchreceviedstocksdata = async (req, res) => {
    try {
        var params = req.body;
        var result = await fetchreceviedstocksdatavalidations.validate(params);
        if (result.error) {
            let message = result.error.details[0].message;
            res.statusCode = 400;
            return res.send(message)
        }
        if (params.ReceviedStockID === "All") {
            var fetchreceviedstock = await ReceviedStockData.find({group: params.group}).exec();
            if (fetchreceviedstock.length > 0) {
                return res.json({ response: 3, message: "fetch stock data successfully",ReceviedData: fetchreceviedstock})
            } else {
                return res.json({ response: 0, message: "Data not found" })
            }
        } else {
            var checkingsalesID = await ReceviedStockData.find({
                LivestockID: params.ReceviedStockID,
                group: params.group
            }).exec()
            if (checkingsalesID.length > 0) {
                return res.json({ response: 3, message: "Recevied Data fetch successfully",ReceviedData:checkingsalesID})
            } else {
                return res.json({ response: 0, message: "Data not found" })
            }
        }

    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    fetchreceviedstocksdata
}