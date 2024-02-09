// Library for JSON Web Token functionality
import jwt from 'jsonwebtoken';

// Import Express types (Request, Response, NextFunction) for middleware
import {Request, Response, NextFunction} from 'express';

// Import the configuration module for the application settings
import config from '../config/config';

// Retrieve the JWT secret key from the configuration module
const {JWT_KEY} = config;

// Import the UserModel representing the Mongoose model for users based on UserSchema
import UserModel from '../models/userModel';

// Import HTTP status codes and messages for response handling
import {httpStatus} from '../config/constants';

/**
 * Middleware function for validating JSON Web Token (JWT) present in the request headers.
 * @param {Request} req - Express request object containing client data.
 * @param {Response} res - Express response object for sending server responses.
 * @param {NextFunction} next - Express next middleware function to pass control.
 */

const verifyToken: MiddlewareFunction = async (req, res, next) => {
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
					customMessage: 'Token has expired. Please log in again.'
				});
			} else {
				// Token successfully verified
				try {
					// Find user based on decoded token information
					const user = await UserModel.findOne({_id: decode._id});
					if (user) {
						// Set user information in 'req.locals' and proceed to the next middleware
						req.locals = {
							firstName: user.firstName,
							lastName: user.lastName,
							role: user.role,
							_id: decode._id
						};
						next();
					} else {
						// Invalid token, user not found, send appropriate error response
						res.status(httpStatus.TOKEN_EXPIRED.code).send({
							message: httpStatus.TOKEN_EXPIRED.message,
							customMessage:
								'Token is invalid, authorization denied.'
						});
					}
				} catch (error) {
					// Error occurred during user retrieval, send service error response
					res.status(httpStatus.SERVICE_ERROR.code).send({
						status: 'error',
						message: httpStatus.SERVICE_ERROR.message,
						customMessage:
							'Error occurred while fetching user data.',
						error: error.message
					});
				}
			}
		});
	} else {
		// 'authorization' property not found in request headers, user not logged in
		res.status(httpStatus.TOKEN_EXPIRED.code).send({
			message: httpStatus.TOKEN_EXPIRED.message,
			customMessage: 'You are not logged in, authentication required.'
		});
	}
};

/**
 * Type definition for Express middleware function.
 */
type MiddlewareFunction = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

/**
 * Exports the verifyToken middleware function to enable its usage throughout the application.
 * @module verifyToken
 * @exports {MiddlewareFunction} verifyToken - Middleware for validating JWT tokens
 */
export default verifyToken;
