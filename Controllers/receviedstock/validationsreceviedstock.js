var Joi = require('@hapi/joi')
var addreceviedstockdatavalidations = Joi.object({
  category: Joi.string()
    .valid("HEN", "SHEEP", "COW", "GOAT", "PIG", "FEED", "EGG", "NATI")
    .required(),

  group: Joi.string()
    .valid("J", "G")
    .required(),
  feedName: Joi.string().optional().allow(''),
  feed: Joi.when("category", {
    is: "FEED",
    then: Joi.array().items(
      Joi.object({
        feedName: Joi.string().required(),
        male: Joi.string().required(),
        totalWeight: Joi.string().required(),
        totalCost: Joi.string().required(),
          cost:Joi.string().required(),
      })
    ).min(1).required(),
    otherwise: Joi.forbidden()
  }),
  phoneNumber: Joi.string().optional().allow(''),
  timestamp: Joi.string().required(),
  breederName: Joi.string().optional(),
  male: Joi.string().optional().allow(''),
  female: Joi.string().optional().allow(''),
  kids: Joi.string().optional().allow(''),
  chicks: Joi.string().optional().allow(''),
  averageWeight: Joi.string().optional().allow(''),
  totalWeight: Joi.string().optional().allow(''),
  cost: Joi.string().optional().allow(''),
  totalCost: Joi.string().optional().allow(''),
  stand: Joi.string().optional().allow(''),
  description: Joi.string().optional().allow(''),
  quantity: Joi.string().optional().allow(''),
  averagePerEgg: Joi.string().optional().allow(''),
  batchName: Joi.string().optional().allow(''),
});


var addsalestockdatavalidations = Joi.object({
  category: Joi.string()
    .valid("HEN", "SHEEP", "COW", "GOAT", "PIG", "FEED", "EGG", "NATI")
    .required(),

  group: Joi.string()
    .valid("J", "G")
    .required(),

  timestamp: Joi.string().required(),
  feed: Joi.when("category", {
    is: "FEED",
    then: Joi.array().items(
      Joi.object({
        feedName: Joi.string().required(),
        male: Joi.string().required(),
        totalWeight: Joi.string().required(),
        cost: Joi.string().required(),
        totalCost: Joi.string().required()
      })
    ).min(1).required(),
    otherwise: Joi.forbidden()
  }),
  breederName: Joi.string().optional().allow(""),
  male: Joi.string().optional().allow(""),
  female: Joi.string().optional().allow(""),
  kids: Joi.string().optional().allow(""),
  chicks: Joi.string().optional().allow(""),
  averageWeight: Joi.string().optional().allow(""),
  totalWeight: Joi.string().optional().allow(''),
  cost: Joi.string().optional().allow(""),
  totalCost: Joi.string().optional().allow(''),
  stand: Joi.string().optional().allow(""),
  description: Joi.string().optional().allow(""),
  quantity: Joi.string().optional().allow(""),
  averagePerEgg: Joi.string().optional().allow(""),
  sellerPhoneNumber: Joi.string().optional().allow(""),
  paymentMode: Joi.string().optional().allow(""),
  creditperson: Joi.string().optional().allow(""),
  batchName: Joi.string().optional().allow("")
});

var addexpensesdatavalidations = Joi.object({
   category: Joi.string()
    .valid("HEN", "SHEEP", "COW", "GOAT", "PIG", "FEED", "EGG", "NATI")
    .required(),

  group: Joi.string()
    .valid("J", "G")
    .required(),

  timestamp: Joi.string().required(),
  feed: Joi.when("category", {
    is: "FEED",
    then: Joi.array().items(
      Joi.object({
        feedName: Joi.string().required(),
        male: Joi.string().required(),
        totalWeight: Joi.string().required(),
        totalCost: Joi.string().required(),
        cost:Joi.string().required(),
      })
    ).min(1).required(),
    otherwise: Joi.forbidden()
  }),
  breederName: Joi.string().optional().allow(""),
  male: Joi.string().optional().allow(""),
  female: Joi.string().optional().allow(""),
  kids: Joi.string().optional().allow(""),
  chicks: Joi.string().optional().allow(""),
  averageWeight: Joi.string().optional().allow(""),
  totalWeight: Joi.string().optional().allow(''),
  cost: Joi.string().optional().allow(""),
  totalCost: Joi.string().optional().allow(''),
  stand: Joi.string().optional().allow(""),
  description: Joi.string().optional().allow(""),
  quantity: Joi.string().optional().allow(""),
  averagePerEgg: Joi.string().optional().allow(""),
  customerPhoneNumber: Joi.string().optional().allow(""),
  damageReason: Joi.string().optional().allow(""),
  paymentMode: Joi.string().optional().allow(""),
  creditperson: Joi.string().optional().allow(""),
  batchName: Joi.string().optional().allow(""),
  createdBy: Joi.string().optional().allow("")
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
  deletereceviedstocksdatavalidations, addsalestockdatavalidations,addexpensesdatavalidations
}