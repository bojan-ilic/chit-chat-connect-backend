// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * Tag Schema
 * Defines the structure of the tags in the 'tags' collection in MongoDB.
 * Represents the properties and format of tags stored in MongoDB 'tags' collection.
 */
const TagSchema = new Schema({
    name: { type: String, required: true }, // Name of the tag
});

/**
 * TagModel
 * Mongoose model based on TagSchema, represents the 'tags' collection.
 * Provides access to CRUD operations for tags in MongoDB.
 */
const TagModel = model('tags', TagSchema);

/**
 * Exports the TagModel to enable its use throughout the application.
 */
module.exports = TagModel;
