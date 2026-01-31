var Joi = require('@hapi/joi')
var addreceviedstockdatavalidations = Joi.object({
     category: Joi.string()
    .valid("HEN", "SHEEP", "COW", "GOAT", "PIG", "FEED")
    .required(),

  group: Joi.string()
    .valid("J", "G")
    .required(),
  breederName: Joi.string().optional(),
  male: Joi.number().min(0).strict().optional(),
  female: Joi.number().min(0).strict().optional(),
  kids: Joi.number().min(0).strict().optional(),
  averageWeight: Joi.number().min(0).strict().optional(),
  totalWeight: Joi.number().min(0).strict().optional(),
  cost: Joi.number().min(0).strict().optional(),
  totalCost: Joi.number().min(0).strict().optional(),
  stand: Joi.string().optional(),
  description: Joi.string().optional(),
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
    deletereceviedstocksdatavalidations
}