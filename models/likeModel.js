// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * LikeSchema
 * Defines the structure of the likes collection in MongoDB.
 * Represents the properties and format of likes stored in MongoDB 'likes' collection.
 */
const LikeSchema = new Schema({
    firstName: { type: String, required: true }, // First name of the user who liked
    lastName: { type: String, required: true }, // Last name of the user who liked
    postId: { type: Schema.Types.ObjectId, required: true }, // ID of the post liked
    userId: { type: Schema.Types.ObjectId, required: true }, // ID of the user who performed the like
    createdAt: { type: Date, default: () => new Date().getTime() }, // Timestamp when the like was created
});

/**
 * LikeModel
 * Mongoose model based on LikeSchema, represents the 'likes' collection.
 * Provides access to CRUD operations for comments in MongoDB.
 */
const LikeModel = model('likes', LikeSchema);

/**
 * Exports the LikeModel to enable its use throughout the application.
 */
module.exports = LikeModel;
