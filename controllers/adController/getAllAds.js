// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the Advertisement Model module representing the schema and functionalities for advertisements
const AdModel = require('../../models/adModel');

// Importing pre-defined pipeline stages for joining related collections (posts, users) to enrich advertisement data
const { joinPostUser } = require('../../stages/joins');

// Importing Moment.js for date manipulation
const moment = require('moment/moment');

/**
 * Controller function to retrieve all advertisements from the database.
 * @param {Object} req - The request object used to filter advertisements based on date criteria.
 * @param {Object} res - The response object used to send the retrieved advertisements or error messages.
 * @returns {Object} - Returns a response with the list of advertisements or an error message.
 */

const getAllAds = async (req, res) => {
    try {
        const currentDate = new Date(moment().format('YYYY-MM-DD'));

        const ads = await AdModel.aggregate([
            { $match: { endDate: { $gte: currentDate } } },
            { $match: { startDate: { $lte: currentDate } } },
            ...joinPostUser,
        ]);

        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'All advertisements were successfully retrieved.',
            data: ads,
        });
    } catch (error) {
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
