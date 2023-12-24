// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import AdModel representing the Mongoose model for advertisements based on AdSchema
const AdModel = require('../../models/adModel');

// Import pre-defined pipeline stages for joining related collections (posts, users) to enrich advertisement data
const { joinPostUser } = require('../../stages/joins');

// Import Moment.js for date and time manipulation and formatting
const moment = require('moment/moment');

/**
 * Controller function to retrieve all advertisements from the database.
 * Fetches advertisements based on date criteria and enriched data.
 * @param {Object} req - The request object representing the incoming request with criteria for fetching advertisements
 * @param {Object} res - The response object representing the server's response, used to send the retrieved advertisements or error messages.
 * @returns {Object} - Returns a response object representing the server's reply containing the list of advertisements or an error message in case of failure to retrieve ads from the database.
 */

const getAllAds = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date(moment().format('YYYY-MM-DD'));

        // Fetch advertisements based on date criteria and enriched data
        const ads = await AdModel.aggregate([
            {
                $match: {
                    $and: [
                        { startDate: { $lte: currentDate } }, // Find ads where the start date is on or before the current date
                        { endDate: { $gte: currentDate } }, // Find ads where the end date is on or after the current date
                    ],
                },
            },
            ...joinPostUser, // Include stages that enhance advertisement details by linking them with related posts and users
        ]);

        // If no ads are found based on the criteria, send a 'not found' response
        if (ads.length === 0) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'success',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'No advertisements found.',
                data: [], // As no advertisements were found, an empty array is sent as data
            });
        }

        // Send a success response with retrieved ads
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'All advertisements were successfully retrieved.',
            data: ads, // Include the retrieved advertisements in the success response
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'Failed to retrieve all ads due to an internal server error.',
            error: error.message,
        });
    }
};

/**
 * Exports the getAllAds controller function to enable its use throughout the application.
 * @module getAllAds
 * @exports {Function} getAllAds - Function for fetching all advertisements
 */
module.exports = getAllAds;
