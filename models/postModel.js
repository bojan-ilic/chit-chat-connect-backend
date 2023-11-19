// Mongoose library enables schema creation, model definition and interaction with the database
const { Schema, model } = require('mongoose');

/**
 * TagSchema
 * Defines the structure of the tags within the 'posts' collection in MongoDB.
 * Represents the properties and format of tags stored in MongoDB.
 */
const TagSchema = new Schema(
    {
        name: { type: String, required: true }, // Name of the tag
    },
    {
        _id: false, // Disable the default _id field for individual tags
    },
);

/**
 * Validates that a field contains at least one value.
 * @param {string} field - The field to be validated
 * @returns {boolean} - Returns true if the field has at least one value
 */
const validateField = (field) => field.length > 0; // Validation function checks for non-empty field

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
                message: 'Body must have at least one tag',
            },
        }, // Content of the post body, ensuring presence of at least one associated tag
        title: { type: String, required: true }, // Title of the post
        image: { type: String }, // Image associated with the post (optional)
        isPublic: { type: Boolean, default: false }, // Indicates if the post is public or not
        reactions: { type: Number, default: 0 }, // Number of reactions on the post
        userId: { type: Schema.Types.ObjectId, required: true }, // ID of the user who created the post
        createdAt: { type: Date, default: () => new Date().getTime() }, // Timestamp when the post was created
        updatedAt: { type: Date, default: null }, // Timestamp when the post was last updated
        tags: {
            type: [TagSchema], // Array of tags associated with the post
            validate: {
                validator: (tags) => tags.length > 0,
                message: 'Tags must have at least one tag',
            },
        },
    },
    { timestamps: true }, // Automatically manages 'createdAt' and 'updatedAd' timestamps
);

/**
 * PostModel
 * Mongoose model based on PostSchema, represents the 'posts' collection.
 * Provides access to CRUD operations for posts in MongoDB.
 * @exports PostModel
 */
const PostModel = model('posts', PostSchema);

/**
 * Exports the PostModel to enable its use throughout the application.
 * @module postModel
 */
module.exports = PostModel;
