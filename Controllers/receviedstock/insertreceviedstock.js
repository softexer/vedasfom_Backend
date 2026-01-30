var { addreceviedstockdatavalidations } = require('./validationsreceviedstock');
var ReceviedStockData = require('../../app/Models/stock');
var idb = require('../core/generateID');

const addreceviedstockdata = async (req, res) => {
  try {

    // SAFE PARSE
    let params;
    try {
      params = typeof req.body.buydata === "string"
        ? JSON.parse(req.body.buydata)
        : req.body.buydata;
    } catch {
      return res.status(400).json({ message: "Invalid buydata JSON" });
    }

    // VALIDATION
    const { error } = addreceviedstockdatavalidations.validate(params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // IMAGE CHECK
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
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
