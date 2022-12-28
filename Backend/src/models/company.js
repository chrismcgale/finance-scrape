/** Import mongoose model */
const mongoose = require('mongoose');

/** Import Schemas from mongoose */
const { Schema } = mongoose;

/** Import the list of collections */
const Collections = require('./Collections');

/** Create the Company Schema */
const companySchema = new Schema({
  Name: String,
  Symbol: String,
  Sector: String,
});

/** Create the BCM Template model */
const CompanyModel = mongoose.model('Company', companySchema);

/** Export the Company model */
module.exports = CompanyModel;
