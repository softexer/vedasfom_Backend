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
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "image is required" });
    }

    const file = req.files.image;
    const imageid = "vid@" + idb.GenerateIDS(9);
    const filename = imageid + file.name;
    const filemvpath = `./public/images/${filename}`;
    const filedbpath = `/images/${filename}`;

    // MOVE FILE (PROMISE SAFE)
    await new Promise((resolve, reject) => {
      file.mv(filemvpath, err => err ? reject(err) : resolve());
    });

    // INSERT DATA
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
      image: filedbpath
    });

    return res.status(200).json({
      response: 3,
      message: "Product inserted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addreceviedstockdata };
