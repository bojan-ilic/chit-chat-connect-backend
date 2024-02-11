// Import the Router module from Express
import {Router} from 'express';

// Import the token verification middleware
import verifyToken from '../middleware/verifyToken';

// Create a new instance of the Express router
const router: Router = Router();

/**
 * Routes for managing advertisement-related operations.
 * Handles fetching all ads, adding new ads, and initializing payments for advertisements.
 * Base URL: /api/ads
 * @module Routes/Ads
 */

/**
 * @description Route to fetch all advertisements
 * @route GET /api/ads
 */
router.get('/', require('../controllers/adController/getAllAds'));

/**
 * @description Route to add a new advertisement
 * @route POST /api/ads
 * @middleware verifyToken - Ensures user authentication before adding the ad
 */
router.post('/', verifyToken, require('../controllers/adController/addAd'));

/**
 * @description Route to initialize payment for an advertisement
 * @route POST /api/ads/paymentInit
 * @middleware verifyToken - Ensures user authentication before initializing payment
 */
router.post(
	'/paymentInit',
	verifyToken,
	require('../controllers/adController/paymentInit')
);

/**
 * @description Route to delete a specific advertisement by ID
 * @route DELETE /api/ads/:id
 * @param {string} id - The ID of the advertisement to delete
 * @middleware verifyToken - Ensures user authentication before deleting the ad
 */
router.delete(
	'/:id',
	verifyToken,
	require('../controllers/adController/deleteAd')
);

/**
 * Exports the router for advertisement-related operations to enable its use throughout the application.
 * @module Routes/Ads
 */
export default router;
