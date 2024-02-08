// Library for JSON Web Token functionality
const jwt = require('jsonwebtoken');

// Secret key for JWT encoding/decoding
const { JWT_KEY } = require('../config/config');

// Import the UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../models/userModel');

// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../config/constants');

/**
 * Middleware function for validating JSON Web Token (JWT) present in the request headers.
 * @param {Object} req - Express request object containing client data.
 * @param {Object} res - Express response object for sending server responses.
 * @param {Object} next - Express next middleware function to pass control.
 */

const verifyToken = (req, res, next) => {
    // Check if the 'authorization' property exists in the request headers
    if (req.headers.hasOwnProperty('authorization')) {
        // Extracts the JWT token from the 'authorization' header in the request
        let token = req.headers.authorization;

        // Verify the token using JWT
        jwt.verify(token, JWT_KEY, async (error, decode) => {
            if (error) {
                // Token verification failed or expired, send appropriate error response
                res.status(httpStatus.TOKEN_EXPIRED.code).send({
                    message: httpStatus.TOKEN_EXPIRED.message,
                    customMessage: 'Token has expired. Please log in again.',
                });
            } else {
                // Token successfully verified
                try {
                    // Find user based on decoded token information
                    const user = await UserModel.findOne({ _id: decode._id });
                    if (user) {
                        // Set user information in 'req.locals' and proceed to the next middleware
                        req.locals = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            _id: decode._id,
                        };
                        next();
                    } else {
                        // Invalid token, user not found, send appropriate error response
                        res.status(httpStatus.TOKEN_EXPIRED.code).send({
                            message: httpStatus.TOKEN_EXPIRED.message,
                            customMessage:
                                'Token is invalid, authorization denied.',
                        });
                    }
                } catch (error) {
                    // Error occurred during user retrieval, send service error response
                    res.status(httpStatus.SERVICE_ERROR.code).send({
                        status: 'error',
                        message: httpStatus.SERVICE_ERROR.message,
                        customMessage:
                            'Error occurred while fetching user data.',
                        error: error.message,
                    });
                }
            }
        });
    } else {
        // 'authorization' property not found in request headers, user not logged in
        res.status(httpStatus.TOKEN_EXPIRED.code).send({
            message: httpStatus.TOKEN_EXPIRED.message,
            customMessage: 'You are not logged in, authentication required.',
        });
    }
};

/**
 * Exports the verifyToken middleware function to enable its usage throughout the application.
 * @module verifyToken
 * @exports {Function} verifyToken - Middleware for validating JWT tokens
 */
module.exports = verifyToken;
