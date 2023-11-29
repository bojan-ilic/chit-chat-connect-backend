/**
 * Controller for handling the addition of a new advertisement.
 * Handles the creation and storage of a new advertisement in the database.
 * @module addAd
 */

// Import necessary modules and models
const AdModel = require('../../models/adModel'); // Importing the Advertisement Model
const { httpStatus } = require('../../config/constants'); // Importing HTTP status codes
const moment = require('moment/moment'); // Importing Moment.js for date manipulation

/**
 * AddAd
 * Controller function to add a new advertisement to the database.
 * Extracts necessary data from the request and creates a new ad using AdModel.
 * @param {Object} req - Express request object containing ad details in the body
 * @param {Object} res = Express response object for sending the result
 * @returns {Object} - JSON response indicating the success or error in adding the ad
 */
const AddAd = async (req, res) => {
    // Extract user ID from the request locals
    const { _id: userId } = req.locals; // Extracts data from adModel.js

    // Extract necessary data from the request body
    let { startDate, endDate, ...reqBody } = req.body; // Extracts data from adModel.js

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
            res.send(saveAd);
        } else {
            res.status(httpStatus.SERVICE_ERROR.code).send({
                error: 'The ad is not saved in the database.',
            });
        }
    } catch (error) {
        // Handling errors and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            error: error.message,
        });
    }
};

/**
 * Exports the AddAd controller function to enable its use throughout the application.
 * @module addAdController
 * @exports {Function} AddAd - Function for adding a new advertisement
 */
module.exports = AddAd;
