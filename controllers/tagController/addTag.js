// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the TagModel representing the schema and functionalities for tags
const TagModel = require('../../models/tagModel');

/**
 * Controller function to handle the addition of a new tag to the database.
 * @param {Object} req - The request object containing tag data ('name' property based on the structure defined in TagModel.js) intended for addition to the database.
 * @param {Object} res - The response object used to send success message or error message when adding a new tag.
 * @returns {Object} - Returns a response with the saved tag or an error message upon unsuccessful addition.
 */
const addTag = async (req, res) => {
    try {
        // Extracts the tag name from the request body according to the 'name' property in the TagModel schema
        const { name: tagName } = req.body;

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

        // Create a new TagModel instance using the provided tag name
        const newTag = new TagModel({ name: tagName });

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
