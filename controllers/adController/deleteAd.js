// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import AdModel representing the Mongoose model for advertisements based on AdSchema
const AdModel = require('../../models/adModel');

/**
 * Controller function to delete an advertisement from the database.
 * Manages the deletion process based on the provided ad ID and user permissions.
 * @param {Object} req - The request object representing the incoming request and containing the ad ID intended for deletion.
 * @param {Object} res - The response object representing the server's response and used to send a success message or error message upon attempting to delete an advertisement from the database.
 * @returns {Object} - Returns a response object representing the server's reply indicating either the success of the advertisement deletion operation or an error message upon an unsuccessful attempt to delete the advertisement from the database.
 */
const deleteAd = async (req, res) => {
    try {
        // Extract user data from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Extract the advertisement ID from the request parameters with the alias 'adId'
        const { id: adId } = req.params;

        // Find the advertisement by ID
        const ad = await AdModel.findById(adId);

        // Check if the advertisement exists
        if (!ad) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Advertisement not found.',
            });
        }

        // Check user permission: Only the user who created the ad or an admin can delete it
        if (
            loggedInUser.role !== 'admin' &&
            loggedInUser._id.toString() !== ad.userId.toString()
        ) {
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage:
                    "You don't have permission to delete this advertisement.",
            });
        }

        // Delete the advertisement
        const deletedAd = await AdModel.findByIdAndDelete(adId);

        // Respond based on deletion status
        if (deletedAd) {
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Advertisement deleted successfully.',
                deletedAd, // Include the deleted advertisement data in the success response
            });
        } else {
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Advertisement not found or deletion failed.',
            });
        }
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to delete the advertisement.',
            error: error.message,
        });
    }
};

/**
 * Exports the deleteAd controller function to enable its use throughout the application.
 * @module deleteAd
 * @exports {Function} deleteAd - Function for deleting an advertisement
 */
module.exports = deleteAd;
