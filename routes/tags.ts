// Import the Router module from Express
const { Router } = require('express');

// Import the token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Create a new instance of the Express router
const router = new Router();

/**
 * Routes for managing tag-related operations.
 * Handles fetching all tags, adding, updating, and deleting tags.
 * Base URL: /api/tags
 * @module Routes/Tags
 */

/**
 * @description Route to fetch all tags
 * @route GET /api/tags
 */
router.get('/', require('../controllers/tagController/getAllTags'));

/**
 * @description Route to add a new tag
 * @route POST /api/tags
 * @middleware verifyToken - Ensures user authentication before adding the tag
 */
router.post('/', verifyToken, require('../controllers/tagController/addTag'));

/**
 * @description Route to update a specific tag by ID
 * @route PUT /api/tags/:id
 * @param {string} id - The ID of the tag to update
 * @middleware verifyToken - Ensures user authentication before updating the tag
 */
router.put(
    '/:id',
    verifyToken,
    require('../controllers/tagController/updateTag'),
);

/**
 * @description Route to delete a specific tag by ID
 * @route DELETE /api/tags/:id
 * @param {string} id - The ID of the tag to delete
 * @middleware verifyToken - Ensures user authentication before deleting the tag
 */
router.delete(
    '/:id',
    verifyToken,
    require('../controllers/tagController/deleteTag'),
);

/**
 * Exports the router for tag-related operations to enable its use throughout the application.
 * @module Routes/Tags
 */
module.exports = router;
