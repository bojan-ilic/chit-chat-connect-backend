/**
 * Middleware function for validating JSON Web Token (JWT) present in the request headers.
 * @param {Object} req - Express request object containing client data.
 * @param {Object} res - Express response object for sending server responses.
 * @param {Object} next - Express next middleware function to pass control.
 */

// Importing required modules and constants for token verification.
const jwt = require('jsonwebtoken'); // Library for JSON Web Token functionality
const { JWT_KEY } = require('../config/config'); // Secret key for JWT encoding/decoding
const UserModel = require('../models/userModel'); // User model to interact with the database
const { httpStatus } = require('../config/constants'); // HTTP status codes and messages

// Middleware function that takes in the Express request, response, and next function as parameters
const verifyToken = (req, res, next) => {
    // Check if the 'authorization' property exists in the request headers
    if (req.headers.hasOwnProperty('authorization')) {
        // Extracts the JWT token from the 'authorization' header in the request
        let token = req.headers.authorization;

        // Verify the token using JWT
        jwt.verify(token, JWT_KEY, async (error, decode) => {
            if (error) {
                // Token verification failed or expired, send appropriate error response
                res.status(httpStatus.TOKEN_EXPIRED.status).send(
                    httpStatus.TOKEN_EXPIRED.message,
                );
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
                        res.status(httpStatus.TOKEN_EXPIRED.status).send({
                            msg: 'Token is invalid',
                        });
                    }
                } catch (error) {
                    // Error occurred during user retrieval, send service error response
                    res.status(httpStatus.SERVICE_ERROR.status).send(
                        httpStatus.SERVICE_ERROR.message,
                    );
                }
            }
        });
    } else {
        // 'authorization' property not found in request headers, user not logged in
        res.status(httpStatus.TOKEN_EXPIRED.status).send({
            msg: 'You are not logged in',
        });
    }
};

/**
 * Exports the verifyToken middleware function to enable its usage throughout the application.
 * @module verifyToken
 */
module.exports = verifyToken;
