// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of a tag associated with a post document in the MongoDB 'posts' collection.
 * Represents a tag associated with a post document.
 * @interface Tag
 * @property {string} name - The name of the tag.
 */
interface Tag {
	name: string; // Name of the tag
}

/**
 * Validates that a field contains at least one value.
 * @function
 * @param {string} field - The field to be validated
 * @returns {boolean} - Returns true if the field has at least one value
 */
const validateField = (field: string): boolean => field.length > 0; // Validation function checks for non-empty field

/**
 * Defines the structure and properties of a post document stored in the MongoDB 'posts' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface Post
 */
interface Post extends Document {
	body: string; // Content of the post body
	title: string; // Title of the post
	image?: string | null; // Image associated with the post (optional)
	isPublic: boolean; // Indicates if the post is public or not
	reactions: number; // Number of reactions on the post
	userId: Schema.Types.ObjectId; // ID of the user who created the post
	createdAt: Date; // Timestamp when the post was created
	updatedAt?: Date | null; // Timestamp when the post was last updated (optional)
	tags: Tag[]; // Array of tags associated with the post
}

/**
 * TagSchema
 * Defines the structure of the tags within the 'posts' collection in MongoDB.
 * Represents the properties and format of tags stored in MongoDB.
 */
const TagSchema = new Schema(
	{
		name: {type: String, required: true} // Name of the tag
	},
	{
		_id: false // Disable the default _id field for individual tags
	}
);

/**
 * PostSchema
 * Defines the structure of the posts within 'posts' collection in MongoDB.
 * Represents the properties and format of posts stored in MongoDB 'posts' collection.
 */
const PostSchema = new Schema(
	{
		body: {
			type: String,
			required: true,
			validate: {
				validator: validateField,
				message: 'Body must have at least one tag'
			}
		}, // Content of the post body, ensuring presence of at least one associated tag
		title: {type: String, required: true}, // Title of the post
		image: {type: String}, // Image associated with the post (optional)
		isPublic: {type: Boolean, default: false}, // Indicates if the post is public or not
		reactions: {type: Number, default: 0}, // Number of reactions on the post
		userId: {type: Schema.Types.ObjectId, required: true}, // ID of the user who created the post
		createdAt: {type: Date, default: () => new Date().getTime()}, // Timestamp when the post was created
		updatedAt: {type: Date, default: null}, // Timestamp when the post was last updated
		tags: {
			type: [TagSchema], // Array of tags associated with the post
			validate: {
				validator: (tags) => tags.length > 0,
				message: 'Tags must have at least one tag'
			}
		}
	},
	{timestamps: true} // Automatically manages 'createdAt' and 'updatedAd' timestamps
);

/**
 * PostModel
 * Mongoose model based on PostSchema, represents the 'posts' collection.
 * Provides access to CRUD operations for posts in MongoDB.
 * This Model represents the MongoDB 'posts' collection and is typed as Model<Post & Document>,
 * where 'Post' is the interface defining the post document structure, and 'Document' is the Mongoose document type.
 * @exports PostModel
 * @type {Model<Post & Document>}
 */
const PostModel = model<Post>('posts', PostSchema) as Model<Post & Document>;

/**
 * Exports the PostModel to enable its use throughout the application.
 * @module postModel
 */
export default PostModel;