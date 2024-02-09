// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of a tag document stored in the MongoDB 'tags' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface Tag
 */
interface Tag extends Document {
	name: string; // Name of the tag
	userId: Schema.Types.ObjectId; // ID of the user who created the tag
	createdAt: Date; // Timestamp when the tag was created
}

/**
 * Tag Schema
 * Defines the structure of the tags in the 'tags' collection in MongoDB.
 * Represents the properties and format of tags stored in MongoDB 'tags' collection.
 */
const TagSchema = new Schema({
	name: {type: String, required: true}, // Name of the tag
	userId: {type: Schema.Types.ObjectId, required: true} // ID of the user who created the tag
});

/**
 * TagModel
 * Mongoose model based on TagSchema, represents the 'tags' collection.
 * Provides access to CRUD operations for tags in MongoDB.
 * This Model represents the MongoDB 'tags' collection and is typed as Model<Tag & Document>,
 * where 'Tag' is the interface defining the tag document structure, and 'Document' is the Mongoose document type.
 * @exports TagModel
 * @type {Model<Tag & Document>}
 */
const TagModel = model<Tag>('tags', TagSchema) as Model<Tag & Document>;

/**
 * Exports the TagModel to enable its use throughout the application.
 * @module tagModel
 */
export default TagModel;
