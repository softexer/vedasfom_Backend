var { addsalestockdatavalidations } = require('./validationsreceviedstock');
var SaleStockData = require('../../app/Models/salestock');
var idb = require('../core/generateID');

const addsalestockdata = async (req, res) => {
    try {

        if (!req.body || !req.body.saledata) {
            console.log("daeme", req.body.saledata)
            return res.status(400).json({
                message: "saledata is missing in request"
            });
        }

        let params;
        try {
            params = JSON.parse(req.body.saledata);
        } catch (err) {
            return res.status(400).json({
                message: "saledata must be valid JSON string"
            });
        }

        // VALIDATION
        var result = addsalestockdatavalidations.validate(params);
        console.log("result 400 error", result.error)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        // IMAGE CHECK
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "image is required" });
        }

        const file = req.files.image;
        const imageid = "vid@" + idb.GenerateIDS(9);
        const filename = imageid + file.name;
        const filemvpath = `./public/images/salestock/${filename}`;
        const filedbpath = `/images/salestock/${filename}`;

        // MOVE FILE (PROMISE SAFE)
        await new Promise((resolve, reject) => {
            file.mv(filemvpath, err => err ? reject(err) : resolve());
        });

        // INSERT DATA

        if (params.category === "FEED") {

            for (const feedItem of params.feed) {
                await SaleStockData.create({
                    SalestockID: "sale@" + idb.GenerateIDS(5),
                    category: params.category,
                    group: params.group,
                    breederName: params.breederName,
                    male: feedItem.male,
                    female: feedItem.female,
                    kids: feedItem.kids,
                    averageWeight: feedItem.averageWeight,
                    totalWeight: feedItem.totalWeight,
                    cost: feedItem.cost,
                    totalCost: params.totalCost,
                    stand: params.stand,
                    description: params.description,
                    image: filedbpath,
                    timestamp: params.timestamp,
                    feedName: feedItem.feedName,
                    averagePerEgg: params.averagePerEgg,
                    quantity: params.quantity,
                    sellerPhoneNumber: params.sellerPhoneNumber,
                    paymentMode: params.paymentMode,
                    creditperson: params.creditperson
                });
            }

        } else {
            await SaleStockData.create({
                SalestockID: "sale@" + idb.GenerateIDS(5),
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
                sellerPhoneNumber: params.sellerPhoneNumber,
                paymentMode: params.paymentMode,
                creditperson: params.creditperson
            });
        }
        return res.status(200).json({
            response: 3,
            message: "Sale data inserted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addsalestockdata };
