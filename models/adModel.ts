// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of an advertisement document stored in the MongoDB 'ads' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface Ad
 */
interface Ad extends Document {
	title: string; // Title of the advertisement
	body: string; // Body/content of the advertisement
	image: string; // Image associated with the advertisement
	price: number; // Price of the advertised product/service
	userId: Schema.Types.ObjectId; // ID of the user who created the advertisement
	duration: number; // Duration of the advertisement
	startDate: Date; // Start date of the advertisement
	endDate?: Date | null; // End date of the advertisement (optional)
}

/**
 * Ad Schema
 * Defines the structure of the advertisements in 'ads' collection in MongoDB.
 * Represents the properties and format of the advertisements stored in MongoDB 'ads' collection.
 */
const AdSchema = new Schema<Ad>({
	title: {type: String, required: true}, // Title of the advertisement
	body: {type: String, required: true}, // Body/content of the advertisement
	image: {type: String, required: true}, // Image associated with the advertisement
	price: {type: Number, required: true}, // Price of the advertised product/service
	userId: {type: Schema.Types.ObjectId, required: true}, // ID of the user who created the advertisement
	duration: {type: Number, required: true}, // Duration of the advertisement
	startDate: {type: Date, default: Date.now}, // Start date of the advertisement
	endDate: {type: Date, default: null} // End date of the advertisement
});

/**
 * AdModel
 * Mongoose model based on AdSchema, represents the 'ads' collection.
 * Provides access to CRUD operations for the advertisements in MongoDB.
 * This Model represents the MongoDB 'ads' collection and is typed as Model<Ad & Document>,
 * where 'Ad' is the interface defining the advertisement document structure,
 * and 'Document' is the Mongoose document type.
 * @exports AdModel
 * @type {Model<Ad & Document>}
 */
const AdModel = model<Ad>('ads', AdSchema) as Model<Ad & Document>;

/**
 * Exports the AdModel to enable its use throughout the application.
 * @module adModel
 */
export default AdModel;
