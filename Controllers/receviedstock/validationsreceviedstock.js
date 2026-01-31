var Joi = require('@hapi/joi')
var addreceviedstockdatavalidations = Joi.object({
    category: Joi.string()
        .valid("HEN", "SHEEP", "COW", "GOAT", "PIG", "FEED","EGG")
        .required(),

    group: Joi.string()
        .valid("J", "G")
        .required(),
    timestamp: Joi.string().required(),
    breederName: Joi.string().optional(),
    feedName: Joi.string().optional(),
    male: Joi.string().optional(),
    female: Joi.string().optional(),
    kids: Joi.string().min(0).strict().optional(),
    averageWeight: Joi.string().optional(),
    totalWeight: Joi.string().optional(),
    cost: Joi.string().optional(),
    totalCost: Joi.string().optional(),
    stand: Joi.string().optional(),
    description:Joi.string().optional(),
    quantity: Joi.string().optional(),
    averagePerEgg: Joi.string().optional(),
});


var addsalestockdatavalidations = Joi.object({
    category: Joi.string()
        .valid("HEN", "SHEEP", "COW", "GOAT", "PIG", "FEED", "EGG","NATI")
        .required(),

    group: Joi.string()
        .valid("J", "G")
        .required(),
    timestamp: Joi.string().required(),
    feedName: Joi.string().optional(),
    breederName: Joi.string().optional(),
    male: Joi.string().optional(),
    female:Joi.string().optional(),
    kids:Joi.string().optional(),
    averageWeight:Joi.string().optional(),
    totalWeight:Joi.string().optional(),
    cost:Joi.string().optional(),
    totalCost: Joi.string().optional(),
    stand: Joi.string().optional(),
    description: Joi.string().optional(),
    quantity: Joi.string().optional(),
    averagePerEgg: Joi.string().optional(),
});

var updatereceviedstocksdatavalidations = Joi.object({
    ReceviedStockID: Joi.string().required(),
    ReceviedStocklist: Joi.array().items(Joi.object().keys({
        BrandName: Joi.string().required(),
        ProductID: Joi.string().required(),
        ProductName: Joi.string().required(),
        Price: Joi.number().required(),
        Quantity: Joi.number().required(),
        // Productimage: Joi.string().required(),
        sentfromfactory: Joi.number().strict().required(),
        Recevied: Joi.number().strict().required()
    }).required()).required(),
    totalsentfromfactory: Joi.number().strict().required(),
    totalRecevied: Joi.number().strict().required(),
});
var fetchreceviedstocksdatavalidations = Joi.object({
    ReceviedStockID: Joi.string().required(),
    group: Joi.string().optional()
});
var deletereceviedstocksdatavalidations = Joi.object({
    ReceviedStockID: Joi.string().required()
})
module.exports = {
    addreceviedstockdatavalidations, updatereceviedstocksdatavalidations, fetchreceviedstocksdatavalidations,
    deletereceviedstocksdatavalidations, addsalestockdatavalidations
}