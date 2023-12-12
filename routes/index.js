/**
 * Module defining and organizing the API endpoint structure.
 * Responsible for managing routes related to users, authentication, posts, comments, likes, tags, ads, and messages.
 * @module routes/index
 */

// Import the Express framework
const express = require('express');

// Create a new instance of Express router
const router = new express.Router();

// Routes related to managing users' data
router.use('/users', require('./users'));

// Routes handling user authentication, login, and signup
router.use('/auth', require('./auth'));

// Routes for creating, fetching, and deleting posts
router.use('/posts', require('./posts'));

// Routes managing comments on posts
router.use('/comments', require('./comments'));

// Routes for managing likes on posts or comments
// router.use('/likes', require('./likes'));

// Routes managing tags associated with posts
// router.use('/tags', require('./tags'));

// Routes handling advertisement-related operations
router.use('/ads', require('./ads'));

// Routes managing direct messages between users
// router.use('/messages', require('./messages'));

/**
 * Exports the defined router instance to be used as the main API router.
 * @exports router
 */
module.exports = router;
