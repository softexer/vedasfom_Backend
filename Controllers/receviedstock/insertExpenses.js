var { addexpensesdatavalidations } = require('./validationsreceviedstock');
var ExpensesStockData = require('../../app/Models/expenses');
var idb = require('../core/generateID');

const addexpensesData = async (req, res) => {
    try {

        if (!req.body || !req.body.expensesdata) {
            return res.status(400).json({
                message: "expensesdata is missing in request"
            });
        }

        let params;
        try {
            params = JSON.parse(req.body.expensesdata);
        } catch (err) {
            return res.status(400).json({
                message: "expensesdata must be valid JSON string"
            });
        }

        // VALIDATION
        var result = addexpensesdatavalidations.validate(params);
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

        if (params.category === "FEED") {
            for (const feedItem of params.feed) {
                await ExpensesStockData.create({
                    ExpensesID: "expenses@" + idb.GenerateIDS(5),
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
                    customerPhoneNumber: params.customerPhoneNumber,
                    batchName: params.batchName,
                    damageReason:params.damageReason,
                    paymentMode:params.paymentMode,
                    createdBy:params.createdBy
                });
            }
        } else {
            await ExpensesStockData.create({
                ExpensesID: "expenses@" + idb.GenerateIDS(5),
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
                customerPhoneNumber: params.customerPhoneNumber,
                batchName: params.batchName,
                damageReason:params.damageReason,
                paymentMode:params.paymentMode,
                createdBy:params.createdBy
            });
        }
        return res.status(200).json({
            response: 3,
            message: "Expenses data inserted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addexpensesData };
