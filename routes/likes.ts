// Import the Router module from Express
const { Router } = require('express');

// Import the token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Import like-related controllers
const addLike = require('../controllers/likeController/addLike');
const removeLike = require('../controllers/likeController/removeLike');

// Create a new instance of the Express router
const router = new Router();

/**
 * Routes for managing like-related operations.
 * Handles adding and removing likes for a specific post.
 * Base URL: /api/likes
 * @module Routes/Likes
 */

/**
 * @description Route to add or remove like for a specific post
 * @route POST /api/likes/addRemove/:postId
 * @param {string} postId - The ID of the post to add/remove likes for
 * @middleware verifyToken - Ensures user authentication before adding/removing like
 */
router.post('/addRemove/:postId', verifyToken, addLike, removeLike);

/**
 * Exports the router for like-related operations to enable its use throughout the application.
 * @module Routes/Likes
 */
module.exports = router;
