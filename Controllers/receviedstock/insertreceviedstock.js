
var { addreceviedstockdatavalidations } = require('./validationsreceviedstock');
var ReceviedStockData = require('../../app/Models/stock');
// var Customer = require('../../app/Model/customers');
var idb = require('../core/generateID')
var addreceviedstockdata = async (req, res) => {
    try {
        var params = req.body;
        var result = await addreceviedstockdatavalidations.validate(params);
        if (result.error) {
            console.log("error", result, result.error)
            let message = result.error.details[0].message;
            res.statusCode = 400;
            return res.send(message)
        }

        var pid = idb.GenerateIDS(9);
        var date = new Date().getTime();
        var projectid = "vid" + "@" + pid + date;
        var imageid = "vid" + pid + '@';
            var ids = "stock" + '@' + idb.GenerateIDS(5)
        if (req.files != null) {
            var file = req.files.image;
            var filename = req.files.image.name;
            var filemvpath = './public/images/' + imageid + filename;
            var filedbpath = '/images/' + imageid + filename;
            file.mv(filemvpath, async (err) => {
                if (err) {
                    return callback({
                        status: 200,
                        data: {
                            response: 0,
                            message: "something went to wrong"
                        }
                    });
                } else {
                    try {
                        var insertreceviedstockdata = await ReceviedStockData.insertMany([{
                            LivestockID: ids,
                            category: params.category,
                            group: params.group,
                            breederName: params.breederName,
                            male: params.male,
                            female: params.female,
                            kids: params.kids,
                            averageWeight: date,
                            totalWeight: params.totalWeight,
                            cost: params.cost,
                            totalCost: params.totalCost,
                            stand: params.stand,
                            description: params.description,
                            image: filedbpath
                        }]);
                        console.log(insertreceviedstockdata);
                        return callback({
                            status: 200,
                            data: {
                                response: 3,
                                message: "Product inserted successfully"
                            }
                        });
                    } catch (insertError) {
                        console.error(insertError);
                        return callback({
                            status: 200,
                            data: {
                                response: 0,
                                message: "Product inserted Failure"
                            }
                        });
                    }
                }
            });
        } else {
            return callback({
                status: 200,
                data: {
                    response: 0,
                    message: "please upload image"
                }
            })
        }

    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    addreceviedstockdata
}