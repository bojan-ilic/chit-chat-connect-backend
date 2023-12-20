// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the TagModel module representing the schema and functionalities for tags
const TagModel = require('../../models/tagModel');

/**
 * Controller function to update a specific tag by ID.
 * @param {Object} req - The request object representing the incoming request and containing tag ID and updated tag data ('name' property based on the structure defined in TagModel.js) intended for modification in the database.
 * @param {Object} res - The response object representing the server's response and used to send a success message or error message upon attempting to update a tag in the database.
 * @returns {Object} - Returns a response object representing the server's reply indicating either the success of the tag update operation along with the updated tag data or an error message upon an unsuccessful attempt to update the tag in the database.
 */
const updateTag = async (req, res) => {
    try {
        // Extract tag name from the request body according to the 'name' property in the TagModel schema
        const { name: tagName } = req.body;

        // Extract the tag ID from the request parameters with the alias 'tagId'
        const { id: tagId } = req.params;

        // User data from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Retrieve tag details to verify the tag's creator
        const tag = await TagModel.findById(tagId);

        // Check if the tag exists and if the logged-in user is authorized to update it
        if (
            !tag ||
            (loggedInUser.role !== 'admin' &&
                loggedInUser._id.toString() !== tag.userId.toString())
        ) {
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage: "You don't have permission to update this tag.",
            });
        }

        // Find the tag by ID and update its name
        const updatedTag = await TagModel.findByIdAndUpdate(
            tagId, // Extracted 'tagId' from the request parameters
            { name: tagName }, // Update the name field with the extracted 'tagName' from the request body
            { new: true }, // Return the updated document
        );

        // Check if the tag was not found or the update operation failed
        if (!updatedTag) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Tag not found or update failed.',
            });
        }

        // Exclude '__v' field from the updated tag
        const { __v, ...tagData } = updatedTag.toObject();

        // Send a success response with the updated tag information
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Tag updated successfully.',
            data: tagData, // Include the updated tag data in the success response (excluding '__v' field)
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'An unexpected error occurred while updating the tag.',
            error: error.message,
        });
    }
};

/**
 * Exports the updateTag controller function to enable its use throughout the application.
 * @module updateTag
 * @exports {Function} updateTag - Function for updating a tag
 */
module.exports = updateTag;
