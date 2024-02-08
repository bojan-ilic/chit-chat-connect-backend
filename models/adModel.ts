// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * Ad Schema
 * Defines the structure of the advertisements in 'ads' collection in MongoDB.
 * Represents the properties and format of the advertisements stored in MongoDB 'ads' collection.
 */
const AdSchema = new Schema({
    title: { type: String, required: true }, // Title of the advertisement
    body: { type: String, required: true }, // Body/content of the advertisement
    image: { type: String, required: true }, // Image associated with the advertisement
    price: { type: Number, required: true }, // Price of the advertised product/service
    userId: { type: Schema.Types.ObjectId, required: true }, // ID of the user who created the advertisement
    duration: { type: Number, required: true }, // Duration of the advertisement
    startDate: { type: Date, default: Date.now }, // Start date of the advertisement
    endDate: { type: Date, default: null }, // End date of the advertisement
});

/**
 * AdModel
 * Mongoose model based on AdSchema, represents the 'ads' collection.
 * Provides access to CRUD operations for the advertisements in MongoDB.
 * @exports AdModel
 */
const AdModel = model('ads', AdSchema);

/**
 * Exports the AdModel to enable its use throughout the application.
 * @module adModel
 */
module.exports = AdModel;
