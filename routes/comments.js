// Import the Router module from Express
const { Router } = require('express');

// Import the token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Create a new instance of the Express router
const router = new Router();

/**
 * Routes for managing comment-related operations.
 * Handles fetching all comments for a specific post, getting a single comment, adding, updating, and deleting comments.
 * Base URL: /api/comments
 * @module Routes/Comments
 */

/**
 * @description Route to fetch all comments for a specific post
 * @route GET /api/comments/all/:postId
 * @param {string} postId - The ID of the post to retrieve comments for
 */
router.get(
    '/all/:postId',
    require('../controllers/commentController/getAllCommentsForPost'),
);

/**
 * @description Route to get a single comment by ID
 * @route GET /api/comments/:id
 * @param {string} id - The ID of the comment to retrieve
 */
router.get(
    '/:id',
    require('../controllers/commentController/getSingleComment'),
);

/**
 * @description Route to add a new comment
 * @route POST /api/comments
 * @middleware verifyToken - Ensures user authentication before adding the comment
 */
router.post(
    '/',
    verifyToken,
    require('../controllers/commentController/addComment'),
);

/**
 * @description Route to update a specific comment by ID
 * @route PUT /api/comments/:id
 * @param {string} id - The ID of the comment to update
 * @middleware verifyToken - Ensures user authentication before updating the comment
 */
router.put(
    '/:id',
    verifyToken,
    require('../controllers/commentController/updateComment'),
);

/**
 * @description Route to delete a specific comment by ID
 * @route DELETE /api/comments/:id
 * @param {string} id - The ID of the comment to delete
 * @middleware verifyToken - Ensures user authentication before deleting the comment
 */
// router.delete(
//     '/:id',
//     verifyToken,
//     require('../controllers/commentController/deleteComment'),
// );

/**
 * Exports the router for comment-related operations to enable its use throughout the application.
 * @module Routes/Comments
 */
module.exports = router;
