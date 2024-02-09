// Mongoose library enables schema creation, model definition, and interaction with the database (including Model and Document types)
import {Schema, model, Model, Document} from 'mongoose';

/**
 * Defines the structure and properties of a user document stored in the MongoDB 'users' collection.
 * Extends the Mongoose Document type for enhanced TypeScript support, providing additional functionality and typings
 * for interacting with MongoDB documents.
 * @interface User
 */
interface User extends Document {
	firstName: string; // First name of the user
	lastName: string; // Last name of the user
	email: string; // Email of the user
	password: string; // Password of the user
	image?: string | null; // Profile image URL of the user (optional)
	role: string; // Role of the user (default is 'user')
	gender?: string | null; // Gender of the user (optional)
	birthDate?: Date | null; // Birthdate of the user (optional)
	createdAt: Date; // Timestamp when the user was created
	updatedAt?: Date | null; // Timestamp when the user was last updated (optional)
}

/**
 * User Schema
 * Defines the structure of the users in the 'users' collection in MongoDB.
 * Represents the properties and format of user profiles stored in MongoDB 'users' collection.
 */
const UserSchema = new Schema({
	firstName: {type: String, required: [true, 'First name is required.']}, // First name of the user
	lastName: {type: String, required: [true, 'Last name is required.']}, // Last name of the user
	email: {type: String, required: [true, 'Email is required.']}, // Email of the user
	password: {type: String, required: [true, 'Password is required.']}, // Password of the user
	image: {type: String, default: null}, // Profile image URL of the user
	role: {type: String, default: 'user'}, // Role of the user (default is 'user')
	gender: {type: String, default: null}, // Gender of the user
	birthDate: {type: Date, default: null}, // Birthdate of the user
	createdAt: {type: Date, default: () => new Date().getTime()}, // Timestamp when the user was created
	updatedAt: {type: Date, default: null} // Timestamp when the user was last updated
});

/**
 * UserModel
 * Mongoose model based on UserSchema, represents the 'users' collection.
 * Provides access to CRUD operations for users in MongoDB.
 * This Model represents the MongoDB 'users' collection and is typed as Model<User & Document>,
 * where 'User' is the interface defining the user document structure, and 'Document' is the Mongoose document type.
 * @exports UserModel
 * @type {Model<User & Document>}
 */
const UserModel = model<User>('users', UserSchema) as Model<User & Document>;

/**
 * Exports the UserModel to enable its use throughout the application.
 * @module userModel
 */
export default UserModel;
