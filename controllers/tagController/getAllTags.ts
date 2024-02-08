// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the TagModel representing the Mongoose model for tags based on TagSchema
const TagModel = require('../../models/tagModel');

/**
 * Controller function to fetch all tags from the database.
 * @param {Object} req - The request object used to retrieve tags.
 * @param {Object} res - The response object used to send the retrieved tags or error messages.
 * @returns {Object} - Returns an object containing the tags retrieved successfully or appropriate error messages.
 */
const getAllTags = async (req, res) => {
    try {
        // Fetch all tags from the TagModel
        const tags = await TagModel.aggregate([
            { $project: { __v: 0 } }, // Excludes the '__v' field from the retrieved tags
        ]);

        // Check if no tags are found in the database
        if (tags.length === 0) {
            // If no tags are found, send a 'Not Found' response with an empty array
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'success',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'No tags found.',
                data: [],
            });
        }

        // Send the retrieved tags in the response
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'All tags retrieved successfully.',
            data: tags, // Include the retrieved tags in the response
        });
    } catch (error) {
        // Handling errors and sending an appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to retrieve tags.',
            error: error.message,
        });
    }
};

/**
 * Exports the getAllTags controller function to enable its use throughout the application.
 * @module getAllTagsController
 * @exports {Function} getAllTags - Function for fetching all tags
 */
module.exports = getAllTags;
