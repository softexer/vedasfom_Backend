var { addreceviedstockdatavalidations } = require('./validationsreceviedstock');
var ReceviedStockData = require('../../app/Models/stock');
var idb = require('../core/generateID');

const addreceviedstockdata = async (req, res) => {
    try {

        if (!req.body || !req.body.buydata) {
            return res.status(400).json({
                message: "buydata is missing in request"
            });
        }

        let params;
        try {
            params = JSON.parse(req.body.buydata);
        } catch (err) {
            return res.status(400).json({
                message: "buydata must be valid JSON string"
            });
        }

        // VALIDATION
        var result = addreceviedstockdatavalidations.validate(params);
        console.log("result 400 error", result.error)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        // IMAGE CHECK
        var file;
        var filedbpath;
        if (req.files && req.files.image) {
            file = req.files.image;
            const imageid = "vid@" + idb.GenerateIDS(9);
            const filename = imageid + file.name;
            const filemvpath = `./public/images/${filename}`;
            filedbpath = `/images/${filename}`;

            await new Promise((resolve, reject) => {
            file.mv(filemvpath, err => err ? reject(err) : resolve());
            });
        } else {
            filedbpath = ""; // No image provided
        }

        if (filedbpath) {
            await new Promise((resolve, reject) => {
            file.mv(filedbpath, err => err ? reject(err) : resolve());
            });
        }

        if (params.category === "FEED") {
            for (const feedItem of params.feed) {
                await ReceviedStockData.create({
                    LivestockID: "stock@" + idb.GenerateIDS(5),
                    category: params.category,
                    group: params.group,
                    breederName: params.breederName,
                    male: feedItem.male,
                    female: params.female,
                    kids: params.kids,
                    averageWeight: params.averageWeight,
                    totalWeight: feedItem.totalWeight,
                    cost: feedItem.cost,
                    totalCost: feedItem.totalCost,
                    stand: params.stand,
                    description: params.description,
                    image: filedbpath,
                    timestamp: params.timestamp,
                    feedName: feedItem.feedName,
                    averagePerEgg: params.averagePerEgg,
                    quantity: params.quantity,
                    phoneNumber: params.phoneNumber,
                });
            }
        } else {
            await ReceviedStockData.create({
                LivestockID: "stock@" + idb.GenerateIDS(5),
                category: params.category,
                group: params.group,
                breederName: params.breederName,
                male: params.male,
                female: params.female,
                kids: params.kids,
                averageWeight: params.averageWeight,
                totalWeight: params.totalWeight,
                cost: params.cost,
                totalCost: params.totalCost,
                stand: params.stand,
                description: params.description,
                image: filedbpath,
                timestamp: params.timestamp,
                feedName: params.feedName,
                averagePerEgg: params.averagePerEgg,
                quantity: params.quantity,
                phoneNumber: params.phoneNumber,
            });
        }
        return res.status(200).json({
            response: 3,
            message: "Buy data inserted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addreceviedstockdata };
