// Import the User model to interact with the database
const UserModel = require('../../models/userModel.js');

// Import the bcrypt for password hashing
const bcrypt = require('bcrypt');

// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Set the number of salt rounds for password hashing
const saltRounds = 10;

/**
 * Handles user registration.
 * @function register
 * @param {Object} req - The request object containing user registration details.
 * @param {Object} res - The response object to send back appropriate responses.
 * @returns {Promise} -  A promise indicating the completion of the registration process.
 * @throws {Error} - Throws an error if the registration process encounters an issue.
 */
const register = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if user with provided email already exists
        const userExists = await UserModel.exists({ email });

        if (userExists) {
            return res
                .status(httpStatus.EXIST.code)
                .send(httpStatus.EXIST.message);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with hashed password
        const newUser = new UserModel({
            ...req.body,
            password: hashedPassword,
        });

        // Save the new user
        const savedUser = await newUser.save();

        // Send the created user in the response
        res.send(savedUser);
    } catch (error) {
        // Handle errors
        console.error('Registration error:', error);
        res.status(httpStatus.SERVICE_ERROR.code).send(
            httpStatus.SERVICE_ERROR.message,
        );
    }
};

/**
 * Exports the Register controller function to enable its use throughout the application.
 * @module registerController
 * @exports {Function} register - Function for registering a new user
 */
module.exports = register;
