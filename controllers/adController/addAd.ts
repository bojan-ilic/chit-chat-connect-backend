// Import Request and Response types from 'express' for type-checking and autocompletion
import {Request, Response} from 'express';

// Import HTTP status codes and messages for response handling
import {httpStatus} from '../../config/constants';

// Import AdModel representing the Mongoose model for advertisements based on AdSchema and Ad interface for TypeScript support
import AdModel, {Ad} from '../../models/adModel';

// Import Moment.js for date and time manipulation and formatting
import moment = require('moment');

/**
 * Interface extending the Express Request type to include 'locals' property with authentication-related data.
 * This interface is necessary to provide specific type information for the request object, as 'any' is not ideal.
 */
interface AuthenticatedRequest extends Request {
	locals: {
		_id: string;
	};
}


interface ApiResponse {
	status: string;
	message: string;
	customMessage?: string;
	data?: any;
	error?: string;
}

/**
 * Controller function to handle the addition of a new advertisement to the database.
 * Extracts required data from the request object and creates a new ad using AdModel.
 * @param {AuthenticatedRequest} req - The incoming request object containing advertisement data for database addition.
 * @param {Response} res - The server response object used to send success or error messages when adding an advertisement.
 * @returns {Promise<void>} - Resolves when the advertisement is added successfully, or rejects with an error message if the addition is unsuccessful.
 */
const addAd = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
	try {
		// Extract user ID from the token representing the logged-in user
		const {_id: userId} = req.locals;

		// Extracts advertisement details from the request body according to the AdSchema
		let {title, startDate, endDate, ...reqBody} = req.body;

		// Format dates using moment
		const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
		const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

		// Create Date objects
		const startDateObj = new Date(formattedStartDate);
		const endDateObj = new Date(formattedEndDate);

		// Check if an ad with the same title already exists for this user
		const existingAd = await AdModel.findOne({title, userId});

		if (existingAd) {
			res.status(httpStatus.EXIST.code).send({
				status: 'error',
				message: httpStatus.EXIST.message,
				customMessage:
					'An advertisement with the same title already exists for this user.'
			});
		}

		// Creates a new advertisement using AdModel schema, including all required fields explicitly
		const newAd: Ad = new AdModel({
			...reqBody,
			title,
			startDate: startDateObj,
			endDate: endDateObj,
			userId
		});

		// Save the new advertisement to the database
		const saveAd = await newAd.save();

		// Send a success response after adding the advertisement to the database
		const successResponse: ApiResponse = {
			status: 'success',
			message: httpStatus.SUCCESS.message,
			customMessage: 'Advertisement added successfully.',
			data: saveAd // Include the advertisement data in the success response
		};
		res.status(httpStatus.SUCCESS.code).send(successResponse);
		return successResponse;
	} catch (error) {
		// Error handling and sending an appropriate error response
		const errorResponse: ApiResponse = {
			status: 'error',
			message: httpStatus.SERVICE_ERROR.message,
			customMessage: 'Failed to save advertisement to the database.',
			error: (error as Error).message
		};
		res.status(httpStatus.SERVICE_ERROR.code).send(errorResponse);

		return errorResponse;
	}
};

/**
 * Exports the AddAd controller function to enable its use throughout the application.
 * @module addAdController
 * @exports {Function} addAd - Function for adding a new advertisement
 */
export default addAd;
