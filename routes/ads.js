// Import the Router module from Express
const { Router } = require('express');

// Import the token verification middleware
const verifyToken = require('../middleware/verifyToken');

// Create a new instance of the Express router
const router = new Router();

/**
 * Routes for managing advertisement-related operations.
 * Handles fetching all ads, adding new ads, and initializing payments for ads.
 * Base URL: /api/ads
 * @module Routes/Ads
 */

/**
 * @description Route to fetch all ads
 * @route GET /api/ads
 */
// router.get('/', require('../controllers/adController/getAllAds;'));

/**
 * @description Route to add a new ad
 * @route POST /api/ads
 * @middleware verifyToken - Ensures user authentication before adding the ad
 */
router.post('/', verifyToken, require('../controllers/adController/addAd'));

/**
 * @description Route to initialize payment for an ad
 * @route POST /api/ads/paymentInit
 * @middleware verifyToken - Ensures user authentication before initializing payment
 */
// router.post(
//     '/paymentInit',
//     verifyToken,
//     require('../controllers/adController/paymentInit'),
// );

/**
 * Exports the router for advertisement-related operations to enable its use throughout the application.
 * @module Routes/Ads
 */
module.exports = router;
