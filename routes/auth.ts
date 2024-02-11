// Import the Router type from the 'express' module for handling routes
import {Router} from 'express';

// Create a new instance of the Express router
const router: Router = Router();

/**
 * Routes for managing user authentication operations.
 * Handles user registration and login.
 * Base URL: /api/auth
 * @module Routes/Auth
 */

/**
 * @description Register a new user
 * @route POST /api/auth/register
 */
router.post('/register', require('../controllers/authController/register'));

/**
 * @description Route to log in an existing user
 * @route	POST /api/auth/login
 */
router.post('/login', require('../controllers/authController/login'));

/**
 * Express Router instance.
 * Responsible for defining and handling API routes related to authentication.
 * @type {express.Router}
 * @module auth
 */
export default router;
