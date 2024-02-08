// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the TagModel representing the Mongoose model for tags based on TagSchema
const TagModel = require('../../models/tagModel');

/**
 * Controller function to handle the addition of a new tag to the database.
 * Extracts required data from the request object and creates a new tag using TagModel.
 * @param {Object} req - The request object representing the incoming request and containing tag data ('name' and 'userId' properties based on the structure defined in TagModel.js) intended for addition to the database.
 * @param {Object} res - The response object representing the server's response and used to send a success message or error message upon attempting to add a new tag to the database.
 * @returns {Object} - Returns a response object representing the server's reply containing either the saved tag data in case of a successful addition or an error message upon an unsuccessful attempt to add the tag to the database.
 */

const addTag = async (req, res) => {
    try {
        // Extracts the tag name from the request body according to the 'name' property in the TagModel schema
        const { name: tagName } = req.body;

        // User ID from the token representing the logged-in user
        const { _id: userId } = req.locals;

        // Check if the tag already exists in the database (case-insensitive)
        const existingTag = await TagModel.findOne({
            // Search for a tag in the database matching the 'name' field from the TagModel schema using the provided tagName from req.body
            name: { $regex: new RegExp(`^${tagName}$`, 'i') },
        });

        // Check if a tag with the same name already exists in the database.
        if (existingTag) {
            return res.status(httpStatus.EXIST.code).send({
                status: 'error',
                message: httpStatus.EXIST.message,
                customMessage: 'Tag with the same name already exists.',
            });
        }

        // Create a new TagModel instance using the provided tag name and user ID
        const newTag = new TagModel({ name: tagName, userId });

        // Save the newly created tag to the database using the TagModel schema
        const savedTag = await newTag.save();

        // Exclude '__v' field from the saved tag
        const { __v, ...tagData } = savedTag.toObject();

        // Send a success response after adding the tag to the database
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Tag added successfully.',
            data: tagData, // Include the tag data in the success response (excluding '__v' field)
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to add tag.',
            error: error.message,
        });
    }
};

/**
 * Exports the AddTag controller function to enable its use throughout the application.
 * @module addTagController
 * @exports {Function} addTag - Function for adding a new tag
 */
module.exports = addTag;
