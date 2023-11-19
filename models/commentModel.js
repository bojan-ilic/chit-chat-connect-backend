// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * Comment Schema
 * Defines the structure of the comments in the 'comments' collection in MongoDB.
 * Represents the properties and format of comments stored in MongoDB 'comments' collection.
 */
const CommentSchema = new Schema({
    body: { type: String, required: true }, // Body of the comment
    postId: { type: Schema.Types.ObjectId, required: true }, // ID of the post this comment belongs to
    user: {
        id: { type: Schema.Types.ObjectId, required: true }, // ID of the user who made the comment
        firstName: { type: String, required: true }, // First name of the user
        lastName: { type: String, required: true }, // Last name of the user
    },
    createdAt: { type: Date, default: () => new Date().getTime() }, // Timestamp when the comment was created
    updatedAt: { type: Date, default: null }, // Timestamp when the comment was last updated
});

/**
 * CommentModel
 * Mongoose model based on CommentSchema, represents the 'comments' collection.
 * Provides access to CRUD operations for comments in MongoDB.
 */
const CommentModel = model('comments', CommentSchema);

/**
 * Exports the CommentModel to enable its use throughout the application.
 */
module.exports = CommentModel;
