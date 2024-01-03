// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

/**
 * Controller function to delete a user.
 * Handles the deletion of a user profile based on user ID and user role permissions.
 * @param {Object} req - The request object representing the incoming request containing user deletion information.
 * @param {Object} res - The response object representing the server's response used to send the deletion success or error message.
 * @returns {Object} - Returns a response object representing the server's reply with the deletion status message or error.
 */

const deleteUser = async (req, res) => {
    try {
        // Extracts role and user ID from the request's local data
        const { role, _id } = req.locals;

        // Extracts 'id' from request parameters and assigns it to 'userId'
        const { id: userId } = req.params;

        // Check if the user exists before attempting deletion
        const userToDelete = await UserModel.findById(userId);

        // Check if the user to delete doesn't exist
        if (!userToDelete) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: "User doesn't exist.",
            });
        }

        // Check if the user has permission to delete
        if (role === 'admin' || userId === _id) {
            // Deletes the user by their ID
            await UserModel.deleteOne({ _id: userId });
            res.send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'User deleted successfully.',
            });
        } else {
            res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage: "You don't have permission to delete user.",
            });
        }
    } catch (error) {
        // Send an error response if there is an issue while deleting the user
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            error: error.message,
        });
    }
};

/**
 * Exports the deleteUser controller function to enable its use throughout the application.
 * @module deleteUser
 * @exports {Function} deleteUser - Function for deleting a user
 */
module.exports = deleteUser;
