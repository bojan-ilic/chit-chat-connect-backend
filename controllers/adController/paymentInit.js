// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the Stripe secret key from the configuration
const { STRIPE_SK } = require('../../config/config');

// Import the Stripe library and initialize it with the secret key
const stripe = require('stripe')(STRIPE_SK);

/**
 * Controller function to initialize a payment using Stripe.
 * Initiates a transaction by creating a payment intent and returns client secret key for payment confirmation.
 * @param {Object} req - The request object representing the incoming request and containing 'price' and 'currency' in its body for payment initiation.
 * @param {Object} res - The response object representing the server's response, used to send success or error messages after payment initiation.
 * @returns {Object} - Returns a response object representing the server's reply with the client secret for payment confirmation upon success or an error message if payment initiation fails.
 */
const paymentInit = async (req, res) => {
    try {
        // Extracts 'price' and 'currency' from the request body, required for Stripe payment initiation
        const { price, currency } = req.body;

        // Create payment intent using Stripe API to initialize a transaction
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price, // The amount of the transaction obtained from the request body
            currency: currency, // The currency for the transaction obtained from the request body
            automatic_payment_methods: { enabled: true }, // Enabling automatic payment methods if available
        });

        // Send a success response after confirming payment for further processing
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Payment confirmed and ready for processing',
            client_secret: paymentIntent.client_secret, // Include the client secret key for payment confirmation in the success response
        });
    } catch (error) {
        // Error response if payment initiation fails
        res.status(httpStatus.SERVICE_ERROR.status).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Payment initiation failed',
            error: error.message,
        });
    }
};

/**
 * Exports the paymentInit controller function to enable its use throughout the application for initiating Stripe payments.
 * @module paymentInit
 * @exports {Function} paymentInit - Function for initiating a payment using Stripe
 */
module.exports = paymentInit;
