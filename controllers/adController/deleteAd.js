// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the Advertisement Model module representing the schema and functionalities for advertisements
const AdModel = require('../../models/adModel');

/**
 * Controller function to delete an advertisement from the database.
 * @param {Object} req - The request object containing the ad ID in the URL parameters.
 * @param {Object} res - The response object used to send the success or error response for advertisement deletion.
 * @returns {Object} - Returns a response confirming the deletion or an error message.
 */
const deleteAd = async (req, res) => {
    try {
        // Extract the advertisement ID from the request parameters
        const { id: adId } = req.params;

        // Find the advertisement by ID and remove it from the database
        const deletedAd = await AdModel.findByIdAndDelete(adId);

        if (!deletedAd) {
            // If the advertisement was not found
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Advertisement not found.',
            });
        }

        // Respond with a success message upon successful deletion
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Advertisement deleted successfully.',
            deletedAd,
        });
    } catch (error) {
        // Handle errors during the deletion process
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
