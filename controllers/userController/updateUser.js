// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

/**
 * Controller function to update a user's information.
 * Handles the modification of user profile data based on user ID.
 * Admins can modify any user's data; regular users can only update their own profile.
 * @param {Object} req - The request object representing the incoming request containing the user ID and updated information.
 * @param {Object} res - The response object representing the server's response, used to send the updated user information or error message.
 * @returns {Object} - Returns a response object representing the server's reply containing the updated user data or an error message indicating the status.
 */

const updateUser = async (req, res) => {
    try {
        // User data from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Extracting the request body containing user update information
        const userDataToUpdate = req.body;

        // Extract the user ID from request parameters
        const { id: userId } = req.params;

        // Destructure the request body to get updated fields
        const { role, email, createdAt, updatedAt, _id, ...updatedData } =
            userDataToUpdate;

        // Check if the current user has admin privileges to modify roles
        if (loggedInUser.role === 'admin') {
            updatedData.role = role;
        } else if (
            userId !== loggedInUser._id &&
            loggedInUser.role !== 'admin'
        ) {
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage:
                    "You don't have permission to change another user!",
            });
        }

        // Update the user data based on the provided user ID
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId }, // Finding the user by their ID
            updatedData, // Data containing the updates for the user
            {
                new: true, // Returns the updated user document
                projection: { password: 0 }, // Excludes the password field from the updated data
            },
        );

        if (updatedUser) {
            // If the user is updated successfully, send a success response with the updated user data
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'User information updated successfully.',
                data: updatedUser,
            });
        } else {
            // If the user update fails, send an appropriate error response
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'User not found or update failed.',
            });
        }
    } catch (error) {
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'An unexpected error occurred while updating the user.',
            error: error.message,
        });
    }
};

/**
 * Exports the updateUser controller function to enable its use throughout the application.
 * @module updateUser
 * @exports {Function} updateUser - Function for updating a user's information
 */
module.exports = updateUser;
