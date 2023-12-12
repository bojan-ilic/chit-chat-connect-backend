// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the Stripe secret key from the configuration
const { STRIPE_SK } = require('../../config/config');

// Import the Stripe library and initialize it with the secret key
const stripe = require('stripe')(STRIPE_SK);

/**
 * Initiates a payment using Stripe based on the provided request data.
 * @param {Object} req - The HTTP request object containing price and currency information in the body.
 * @param {Object} res - The HTTP response object used to send the client secret back to the client for payment confirmation.
 * @returns {Promise<void>} - Returns a promise that resolves when the payment initiation process is completed.
 * @throws {Object} -Throws an error if payment initiation fails, sending an appropriate error status and message.
 *
 */
const paymentInit = async (req, res) => {
    try {
        // Destructuring 'price' and 'currency' from 'req.body'
        const { price, currency } = req.body;

        // Create payment intent using Stripe API to initialize a transaction
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price, // The amount of the transaction obtained from the request body
            currency: currency, // The currency for the transaction obtained from the request body
            automatic_payment_methods: { enabled: true }, // Enabling automatic payment methods if available
        });

        // Successful response with client secret for payment confirmation
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Payment confirmed and ready for processing',
            client_secret: paymentIntent.client_secret, // Sending the client secret back to the client for payment confirmation
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
