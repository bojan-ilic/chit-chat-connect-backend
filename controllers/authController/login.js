// Importing the user model for interacting with user data
const UserModel = require('../../models/userModel');

// Library for password hashing and comparison
const bcrypt = require('bcrypt');

// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Utility function for JWT token generation
const createToken = require('../../utils/jwt');

/**
 * Handles user login asynchronously by validating user credentials and generating a JSON Web Token (JWT) for authentication.
 * @param {Object} req - The request object containing user login details.
 * @param {Object} res - The response object to send back appropriate responses.
 * @returns {Promise<void>} - A promise indicating the completion of the login process.
 */
const login = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });

        if (user) {
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            );

            if (isPasswordValid) {
                // Exclude sensitive data from the user object
                const { password: userPassword, ...currentUser } =
                    user.toObject();

                // Generate JWT token
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

                // Send success response with user data and token
                res.status(httpStatus.SUCCESS.code).send({
                    user: currentUser,
                    token,
                });
            } else {
                // Invalid password
                res.status(httpStatus.INVALID_DATA.code).send({
                    msg: 'Password is not valid!',
                });
            }
        } else {
            // User not found
            res.status(httpStatus.NOT_FOUND.code).send(
                httpStatus.NOT_FOUND.message,
            );
        }
    } catch (error) {
        // Handle errors
        console.error('Login error:', error.message);
        res.status(httpStatus.SERVICE_ERROR.code).send(
            httpStatus.SERVICE_ERROR.send,
        );
    }
};

/**
 * Exports the Login module to enable its use throughout the application.
 * @module login
 */
module.exports = login;
