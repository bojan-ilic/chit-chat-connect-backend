// Import the Router type from the 'express' module for handling routes
import {Router} from 'express';

// Import the token verification middleware
import verifyToken from '../middleware/verifyToken';

// Create a new instance of the Express router
const router: Router = Router();

/**
 * Routes for managing message-related operations.
 * Handles fetching all messages related to the authenticated user and adding new messages.
 * Base URL: /api/messages
 * @module Routes/Messages
 */

/**
 * @description Route to fetch all messages related to the authenticated user
 * @route GET /api/messages
 * @middleware verifyToken - Ensures user authentication before fetching user-specific messages
 */
router.get(
	'/',
	verifyToken,
	require('../controllers/messageController/getAllMessages')
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
	require('../controllers/messageController/addMessage')
);

/**
 * Express Router instance for message-related operations.
 * Exports the router for message-related operations to enable its use throughout the application.
 * Manages routes for adding messages to specific users and retrieving user-specific messages.
 * @type {express.Router}
 * @module Routes/Messages
 */
export default router;
