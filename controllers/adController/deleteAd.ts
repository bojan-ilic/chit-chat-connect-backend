// Import Request and Response types from 'express' for type-checking and autocompletion
import {Request, Response} from 'express';

// Import HTTP status codes and messages for response handling
import {httpStatus} from '../../config/constants';

// Import AdModel representing the Mongoose model for advertisements based on AdSchema and Ad interface for TypeScript support
import AdModel, {Ad} from '../../models/adModel';

/**
 * Interface extending the Express Request type to include 'locals' property with authentication-related data.
 * This interface is used to provide specific type information for the request object, including the authenticated user's ID and role.
 */
interface AuthenticatedRequest extends Request {
	locals: {
		_id: string;
		role: string;
	};
}

/**
 * Controller function to delete an advertisement from the database.
 * Manages the deletion process based on the provided ad ID and user permissions.
 * @param {AuthenticatedRequest} req - The request object representing the incoming request and containing the ad ID intended for deletion.
 * @param {Response} res - The response object representing the server's response and used to send a success message or error message upon attempting to delete an advertisement from the database.
 * @returns {Promise<void>} - Resolves when the advertisement is deleted successfully, or rejects with an error message if the deletion is unsuccessful.
 */
const deleteAd = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		// Extract user data from the token representing the logged-in user
		const loggedInUser = req.locals;

		// Extract the advertisement ID from the request parameters with the alias 'adId'
		const {id: adId} = req.params;

		// Find the advertisement by ID
		const ad = await AdModel.findById(adId);

		// Check if the advertisement exists
		if (!ad) {
			res.status(httpStatus.NOT_FOUND.code).send({
				status: 'error',
				message: httpStatus.NOT_FOUND.message,
				customMessage: 'Advertisement not found.'
			});
		}

		// Check user permission: Only the user who created the ad or an admin can delete it
		if (
			loggedInUser.role !== 'admin' &&
			loggedInUser._id.toString() !== ad.userId.toString()
		) {
			res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
				status: 'error',
				message: httpStatus.NOT_HAVE_PERMISSION.message,
				customMessage:
					"You don't have permission to delete this advertisement."
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
				deletedAd // Include the deleted advertisement data in the success response
			});
		} else {
			res.status(httpStatus.NOT_FOUND.code).send({
				status: 'error',
				message: httpStatus.NOT_FOUND.message,
				customMessage: 'Advertisement not found or deletion failed.'
			});
		}
	} catch (error) {
		// Error handling and sending appropriate error response
		res.status(httpStatus.SERVICE_ERROR.code).send({
			status: 'error',
			message: httpStatus.SERVICE_ERROR.message,
			customMessage: 'Failed to delete the advertisement.',
			error: error.message
		});
	}
};

/**
 * Exports the deleteAd controller function to enable its use throughout the application.
 * @module deleteAd
 * @exports {Function} deleteAd - Function for deleting an advertisement
 */
export default deleteAd;
