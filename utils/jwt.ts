// Importing the 'jsonwebtoken' library for handling JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// Extracting the 'JWT_KEY' constant from the configuration file to facilitate JWT encoding and decoding
const { JWT_KEY } = require('../config/config');

/**
 * createToken function generates a JSON Web Token (JWT) based on the provided payload and expiration parameters.
 * @param {Object} payload - Data to be included in the token.
 * @param {string | number} expiresIn - Expiration period for the token (e.g., '1d' for 1 day).
 * @returns {string} - Generated JWT token.
 */
const createToken = (payload, expiresIn) => {
    return jwt.sign(payload, JWT_KEY, { expiresIn });
};

/**
 * Exports the 'createToken' function to enable its usage throughout the application.
 * @module createToken
 */
module.exports = createToken;
