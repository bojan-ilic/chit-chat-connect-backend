// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import AdModel representing the Mongoose model for advertisements based on AdSchema
const AdModel = require('../../models/adModel');

// Import Moment.js for date and time manipulation and formatting
const moment = require('moment/moment');

/**
 * Controller function to handle the addition of a new advertisement to the database.
 * Extracts required data from the request object and creates a new ad using AdModel.
 * @param {Object} req - The request object representing the incoming request and containing advertisement data for database addition.
 * @param {Object} res - The response object representing the server's response, used to send success message or error message when adding advertisement.
 * @returns {Object} - Returns a response object representing the server's reply containing saved advertisement data in case of a successful addition or an error message upon an unsuccessful attempt to add the advertisement to the database.
 */
const addAd = async (req, res) => {
    try {
        // Extract user ID from the token representing the logged-in user
        const { _id: userId } = req.locals;

        // Extracts advertisement details from the request body according to the AdModel schema
        let { title, startDate, endDate, ...reqBody } = req.body;

        // Format the start and end dates using Moment.js
        startDate = new Date(moment(startDate).format('YYYY-MM-DD'));
        endDate = new Date(moment(endDate).format('YYYY-MM-DD'));

        // Check if an ad with the same title already exists for this user
        const existingAd = await AdModel.findOne({ title, userId });

        if (existingAd) {
            return res.status(httpStatus.EXIST.code).send({
                status: 'error',
                message: httpStatus.EXIST.message,
                customMessage:
                    'An advertisement with the same title already exists for this user.',
            });
        }

        // Creates a new advertisement using AdModel schema, including all required fields explicitly
        const newAd = new AdModel({
            ...reqBody,
            title,
            startDate,
            endDate,
            userId,
        });

        // Save the new advertisement to the database
        const saveAd = await newAd.save();

        // Send a success response after adding the advertisement to the database
        res.send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Advertisement added successfully.',
            data: saveAd, // Include the advertisement data in the success response
        });
    } catch (error) {
        // Error handling and sending appropriate error response
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
