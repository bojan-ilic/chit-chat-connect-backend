// Importing the Router module from Express for handling routes
const { Router } = require('express');

// Creating a new instance of the Router class
const router = new Router();

/**
 * @route 	POST /api/auth/register
 * @desc 	Register a new user
 */
router.post('/register', require('../controllers/authController/register'));

/**
 * @route	POST /api/auth/login
 * @desc	Login an existing user
 */
router.post('/login', require('../controllers/authController/login'));

/**
 * Express Router instance.
 * Responsible for defining and handling API routes related to authentication.
 * @type {express.Router}
 * @module auth
 */
module.exports = router;
