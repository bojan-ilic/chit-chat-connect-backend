// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of a comment document stored in the MongoDB 'comments' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface Comment
 */
interface Comment extends Document {
	body: string; // Body of the comment
	postId: Schema.Types.ObjectId; // ID of the post this comment belongs to
	user: {
		id: Schema.Types.ObjectId; // ID of the user who made the comment
		firstName: string; // First name of the user
		lastName: string; // Last name of the user
	};
	createdAt: Date; // Timestamp when the comment was created
	updatedAt?: Date | null; // Timestamp when the comment was last updated (optional)
}

/**
 * Comment Schema
 * Defines the structure of the comments in the 'comments' collection in MongoDB.
 * Represents the properties and format of comments stored in MongoDB 'comments' collection.
 */
const CommentSchema = new Schema({
	body: {type: String, required: true}, // Body of the comment
	postId: {type: Schema.Types.ObjectId, required: true}, // ID of the post this comment belongs to
	user: {
		id: {type: Schema.Types.ObjectId, required: true}, // ID of the user who made the comment
		firstName: {type: String, required: true}, // First name of the user
		lastName: {type: String, required: true} // Last name of the user
	},
	createdAt: {type: Date, default: () => new Date().getTime()}, // Timestamp when the comment was created
	updatedAt: {type: Date, default: null} // Timestamp when the comment was last updated
});

/**
 * CommentModel
 * Mongoose model based on CommentSchema, represents the 'comments' collection.
 * Provides access to CRUD operations for comments in MongoDB.
 * This Model represents the MongoDB 'comments' collection and is typed as Model<Comment & Document>,
 * where 'Comment' is the interface defining the comment document structure, and 'Document' is the Mongoose document type.
 * @exports CommentModel
 * @type {Model<Comment & Document>}
 */
const CommentModel = model<Comment>('comments', CommentSchema) as Model<Comment & Document>;

/**
 * Exports the CommentModel to enable its use throughout the application.
 * @module commentModel
 */
export default CommentModel;
