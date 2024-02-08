// Import the Router module from Express
const { Router } = require('express');

// Import the token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Create a new instance of the Express router
const router = new Router();

/**
 * @description Route to fetch all messages related to the authenticated user
 * @route GET /api/messages
 * @middleware verifyToken - Ensures user authentication before fetching user-specific messages
 */
router.get(
    '/',
    verifyToken,
    require('../controllers/messageController/getAllMessages'),
);

/**
 * @description Route to add a new message
 * @route POST /api/messages/addMessage/:userId
 * @param {string} userId - The ID of the message receiver
 * @middleware verifyToken - Ensures user authentication before adding a message
 */
router.post(
    '/addMessage/:userId',
    verifyToken,
    require('../controllers/messageController/addMessage'),
);

/**
 * Exports the router for message-related operations to enable its use throughout the application.
 * Manages routes for adding messages to specific users and retrieving user-specific messages.
 * @module Routes/Messages
 */
module.exports = router;
