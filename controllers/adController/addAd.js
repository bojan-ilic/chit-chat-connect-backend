// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the AdModel module representing the schema and functionalities for advertisements
const AdModel = require('../../models/adModel');

// Importing Moment.js for date manipulation
const moment = require('moment/moment');

/**
 * Controller function to add a new advertisement to the database.
 * Extracts necessary data from the request and creates a new ad using AdModel.
 * @param {Object} req - The request object containing advertisement details
 * @param {Object} res - The response object used to send success message or error message when adding advertisement
 * @returns {Object} - Returns a response with the saved advertisement or an error message
 */
const addAd = async (req, res) => {
    // Extract user ID from the request locals
    const { _id: userId } = req.locals;

    // Extracts advertisement details from the request body according to the AdModel schema
    let { startDate, endDate, ...reqBody } = req.body;

    // Format the start and end dates using Moment.js
    startDate = new Date(moment(startDate).format('YYYY-MM-DD'));
    endDate = new Date(moment(endDate).format('YYYY-MM-DD'));

    try {
        // Creates a new advertisement using AdModel schema
        const newAd = new AdModel({ ...reqBody, startDate, endDate, userId });

        // Save the new advertisement to the database
        const saveAd = await newAd.save();

        // Send the saved advertisement or an error message based on the result
        if (saveAd) {
            res.send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Advertisement added successfully.',
                data: saveAd,
            });
        } else {
            res.status(httpStatus.SERVICE_ERROR.code).send({
                status: 'error',
                message: httpStatus.SERVICE_ERROR.message,
                customMessage: 'Advertisement addition unsuccessful.',
            });
        }
    } catch (error) {
        // Handling errors and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to save advertisement to database.',
            error: error.message,
        });
    }
};

/**
 * Exports the AddAd controller function to enable its use throughout the application.
 * @module addAdController
 * @exports {Function} addAd - Function for adding a new advertisement
 */
module.exports = addAd;
