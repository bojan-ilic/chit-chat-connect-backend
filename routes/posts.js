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
router.get('/all', require('../controllers/postController/getAllPosts'));

/**
 * @description Route to search for posts
 * @route GET /api/posts/search
 */
// router.get('/search', require('../controllers/postController/searchPost'));

/**
 * @description Route to filter posts
 * @route GET /api/posts/filter
 */
// router.get('/filter', require('../controllers/postController/filterPosts'));

/**
 * @description Route to get a single post by ID
 * @route GET /api/posts/:id
 */
router.get('/:id', require('../controllers/postController/getSinglePost'));

/**
 * @description Route to add a new post
 * @route POST /api/posts/add
 * @middleware verifyToken - Ensures user authentication before adding a post
 */
router.post(
    '/add',
    verifyToken,
    require('../controllers/postController/addPost'),
);

/**
 * @description Route to update a specific post by ID
 * @route PUT /api/posts/:id
 * @param {string} id - The ID of the post to update
 * @middleware verifyToken - Ensures user authentication before updating the post
 */
router.put(
    '/:id',
    verifyToken,
    require('../controllers/postController/updatePost'),
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
    require('../controllers/postController/deletePost'),
);

/**
 * Exports the router for post-related operations to enable its use throughout the application.
 * @module Routes/Posts
 */
module.exports = router;
