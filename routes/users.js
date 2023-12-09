// Import the Router module from Express
const { Router } = require('express');

// Import the token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Create a new instance of the Express router
const router = new Router();

/**
 * Routes for managing user-related operations.
 * Handles fetching all users, adding, updating, and deleting users.
 * Base URL: /api/users
 * @module Routes/Users
 */

/**
 * @description Route to fetch all users
 * @route GET /api/users
 */
router.get('/', require('../controllers/userController/getAllUsers'));

/**
 * @description Route to add a new user
 * @route POST /api/users
 */
router.post('/', require('../controllers/userController/addUser'));

/**
 * @description Route to update a specific user by IDBCursor
 * @route PUT /api/users/:id
 * @param {string} id - The ID of the user to update
 * @middleware verifyToken - Ensures user authentication before updating the user
 */
// router.put(
//     '/:id',
//     verifyToken,
//     require('../controllers/userController/updateUser'),
// );

/**
 * @description Route to delete a specific user by ID
 * @route DELETE /api/users/:id
 * @param {string} id - The ID of the user to delete
 * @middleware verifyToken - Ensures user authentication before deleting the user
 */
// router.delete(
//     '/:id',
//     verifyToken,
//     require('../controllers/userController/deleteUser'),
// );

/**
 * Exports the router for user-related operations to enable its use throughout the application.
 * @module Routes/Users
 */
module.exports = router;
