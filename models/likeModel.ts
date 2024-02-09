// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of a like document stored in the MongoDB 'likes' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface Like
 */
interface Like extends Document {
	firstName: string; // First name of the user who liked
	lastName: string; // Last name of the user who liked
	postId: Schema.Types.ObjectId; // ID of the post liked
	userId: Schema.Types.ObjectId; // ID of the user who performed the like
	createdAt: Date; // Timestamp when the like was created
}

/**
 * LikeSchema
 * Defines the structure of the likes in 'likes' collection in MongoDB.
 * Represents the properties and format of likes stored in MongoDB 'likes' collection.
 */
const LikeSchema = new Schema({
	firstName: {type: String, required: true}, // First name of the user who liked
	lastName: {type: String, required: true}, // Last name of the user who liked
	postId: {type: Schema.Types.ObjectId, required: true}, // ID of the post liked
	userId: {type: Schema.Types.ObjectId, required: true}, // ID of the user who performed the like
	createdAt: {type: Date, default: () => new Date().getTime()} // Timestamp when the like was created
});

/**
 * LikeModel
 * Mongoose model based on LikeSchema, represents the 'likes' collection.
 * Provides access to CRUD operations for likes in MongoDB.
 * This Model represents the MongoDB 'likes' collection and is typed as Model<Like & Document>,
 * where 'Like' is the interface defining the like document structure, and 'Document' is the Mongoose document type.
 * @exports LikeModel
 * @type {Model<Like & Document>}
 */
const LikeModel = model<Like>('likes', LikeSchema) as Model<Like & Document>;

/**
 * Exports the LikeModel to enable its use throughout the application.
 * @module likeModel
 */
export default LikeModel;
