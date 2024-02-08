// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * User Schema
 * Defines the structure of the users in the 'users' collection in MongoDB.
 * Represents the properties and format of user profiles stored in MongoDB 'users' collection.
 */
const UserSchema = new Schema({
    firstName: { type: String, required: [true, 'First name is required.'] }, // First name of the user
    lastName: { type: String, required: [true, 'Last name is required.'] }, // Last name of the user
    email: { type: String, required: [true, 'Email is required.'] }, // Email of the user
    password: { type: String, required: [true, 'Password is required.'] }, // Password of the user
    image: { type: String, default: null }, // Profile image URL of the user
    role: { type: String, default: 'user' }, // Role of the user (default is 'user')
    gender: { type: String, default: null }, // Gender of the user
    birthDate: { type: Date, default: null }, // Birthdate of the user
    createdAt: { type: Date, default: () => new Date().getTime() }, // Timestamp when the user was created
    updatedAt: { type: Date, default: null }, // Timestamp when the user was last updated
});

/**
 * UserModel
 * Mongoose model based on UserSchema, represents the 'users' collection.
 * Provides access to CRUD operations for users in MongoDB.
 * @exports UserModel
 */
const UserModel = model('users', UserSchema);

/**
 * Exports the UserModel to enable its use throughout the application.
 * @module userModel.js
 */
module.exports = UserModel;
