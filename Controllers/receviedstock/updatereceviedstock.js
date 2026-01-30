
var { updatereceviedstocksdatavalidations } = require('./validationsreceviedstock');
var ReceviedStockData = require('../../app/Model/receviedstock');
var updatereceviedstocksdata = async (req, res) => {
    try {
        var params = req.body;
        var result = await updatereceviedstocksdatavalidations.validate(params);
        if (result.error) {
            let message = result.error.details[0].message;
            res.statusCode = 400;
            return res.send(message)
        }
        var checkingsalesID = await ReceviedStockData.findOne({ ReceviedStockID: params.ReceviedStockID, }).exec()
        if (checkingsalesID) {

            var insertreceviedstockdata = await ReceviedStockData.updateOne({
                ReceviedStockID: params.ReceviedStockID
            }, {
                $set: {
                    ReceviedStocklist: params.ReceviedStocklist,
                    totalsentfromfactory: params.totalsentfromfactory,
                    totalRecevied: params.totalRecevied,

                }
            })
            if (insertreceviedstockdata.modifiedCount > 0) {
                return res.json({ response: 3, message: "receviedstock data updated successfully" })
            } else {
                return res.json({ response: 0, message: "receviedstock data updated Failure" })
            }

        } else {
            return res.json({ response: 0, message: "ReceviedStockID is not match" })
        }
    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    updatereceviedstocksdata
}