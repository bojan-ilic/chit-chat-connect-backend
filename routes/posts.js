// Import Express Router
const { Router } = require('express');

// Import token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Initialize Express router
const router = new Router();

/**
 * Routes for managing post-related operations.
 * Handles fetching, creation, updating, and deletion of posts.
 * Base URL: /api/posts
 * @module Routes/Posts
 */

/**
 * @description Route to fetch all posts
 * @route GET /api/posts/all
 */
router.get('/all', require('../controller/postController/allPosts'));

/**
 * @description Route to search for posts
 * @route GET /api/posts/search
 */
router.get('/search', require('../controller/postController/searchPost'));

/**
 * @description Route to filter posts
 * @route GET /api/posts/filter
 */
router.get('/filter', require('../controller/postController/filterPosts'));

/**
 * @description Route to get a single post by ID
 * @route GET /api/posts/:id
 */
router.get('/:id', require('../controller/postController/getSinglePost'));

/**
 * @description Route to add a new post
 * @route POST /api/posts/add
 * @middleware verifyToken - Ensures user authentication before adding a post
 */
router.post(
    '/add',
    verifyToken,
    require('../controller/postController/addPost'),
);

/**
 * @description Route to delete a specific post by ID
 * @route DELETE /api/posts/:id
 * @param {string} id - The ID of the post to delete
 * @middleware verifyToken - Ensures user authentication before deleting a post
 */
router.delete(
    '/:id',
    verifyToken,
    require('../controller/postController/deletePost'),
);

/**
 * Exports the router for post-related operations to enable its use throughout the application.
 * @module Routes/Posts
 */
module.exports = router;
