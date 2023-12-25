// Import UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

// Import 'bcrypt' library for password hashing and comparison
const bcrypt = require('bcrypt');

// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Utility function for JWT token generation
const createToken = require('../../utils/jwt');

/**
 * Controller function for user login authentication.
 * Validates user credentials and generates a JWT (JSON Web Token) for authentication.
 * @param {Object} req - The request object representing the incoming request and containing user login details.
 * @param {Object} res - The response object representing the server's response, used to send success message or error message when handling user login.
 * @returns {Object} - Returns a response object representing the server's reply containing user data and a JWT upon successful login or an error message for unsuccessful login attempts.
 */
const login = async (req, res) => {
    try {
        // Extracts user login details (email and password) from the request body according to the UserSchema
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });

        // Checks if a user object exists based on the provided email
        if (user) {
            // Compare the provided password with the hashed password stored in the user object and retrieve a boolean indicating password validity
            const isPasswordValid = await bcrypt.compare(
                password, // Provided password
                user.password, // Hashed password stored in the user object
            );

            // Check if the provided password matches the stored password for the user
            if (isPasswordValid) {
                // Convert 'user' from Mongoose document to a plain JavaScript object ('currentUser'), excluding 'password' for security purposes
                const { password: userPassword, ...currentUser } =
                    user.toObject();

                // Generate a JSON Web Token (JWT) using user data and a specified expiration time
                const token = createToken(
                    {
                        _id: currentUser._id, // User's unique identifier
                        firstName: currentUser.firstName, // User's first name
                        lastName: currentUser.lastName, // User's last name
                        role: currentUser.role, // User's role or permissions
                        time: new Date().getTime(), // Timestamp for token creation
                    },
                    '1d', // Token expiration time (1 day)
                );

                // Send success response with the user data and token after successful login
                res.status(httpStatus.SUCCESS.code).send({
                    status: 'success',
                    message: httpStatus.SUCCESS.message,
                    customMessage: 'Login successful.',
                    user: currentUser,
                    token,
                });
            } else {
                // Send error response for invalid password scenario
                res.status(httpStatus.INVALID_DATA.code).send({
                    status: 'error',
                    message: httpStatus.INVALID_DATA.message,
                    customMessage: 'Password is not valid.',
                });
            }
        } else {
            // Send error response for a user not found scenario
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'User not found.',
            });
        }
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Server encountered an error during login process.',
            error: error.message,
        });
    }
};

/**
 * Exports the Login authentication handler function to enable its use throughout the application.
 * @module loginHandler
 * @exports {Function} login - Function for handling user login authentication
 */
module.exports = login;
