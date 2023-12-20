// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the TagModel module representing the schema and functionalities for tags
const TagModel = require('../../models/tagModel');

/**
 * Controller function to delete a specific tag by ID.
 * @param {Object} req - The request object representing the incoming request and containing the tag ID intended for deletion.
 * @param {Object} res - The response object representing the server's response and used to send a success message or error message upon attempting to delete a tag from the database.
 * @returns {Object} - Returns a response object representing the server's reply indicating either the success of the tag deletion operation or an error message upon an unsuccessful attempt to delete the tag from the database.
 */
const deleteTag = async (req, res) => {
    try {
        // User data from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Extract the tag ID from the request parameters with the alias 'tagId'
        const { id: tagId } = req.params;

        // Retrieve the tag details
        const tag = await TagModel.findById(tagId);

        // Check if the tag exists
        if (!tag) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Tag not found.',
            });
        }

        // Check user permission: Only the user who created the tag or an admin can delete it
        if (
            loggedInUser.role !== 'admin' &&
            loggedInUser._id.toString() !== tag.userId.toString()
        ) {
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage: "You don't have permission to delete this tag.",
            });
        }

        // Attempt to delete the tag based on its ID
        const deletedTag = await TagModel.findByIdAndDelete(tagId);

        // Send appropriate response based on deletion status
        if (deletedTag) {
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Tag deleted successfully.',
            });
        } else {
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Tag not found or deletion failed.',
            });
        }
    } catch (error) {
        // Handling unexpected errors that occurred during the deletion process
        return res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'An unexpected error occurred while deleting the tag.',
            error: error.message,
        });
    }
};

/**
 * Exports the deleteTag controller function to enable its use throughout the application.
 * @module deleteTag
 * @exports {Function} deleteTag - Function for deleting a tag
 */
module.exports = deleteTag;
