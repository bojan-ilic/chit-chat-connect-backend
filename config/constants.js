/**
 * Constants file containing HTTP status codes and their corresponding messages.
 * These codes represent various response statuses across systems and interactions.
 */

module.exports = {
    httpStatus: {
        /**
         * Client Errors
         */
        // Indicates that the server did not find the requested resource
        NOT_FOUND: {
            code: 404,
            message: 'Resource not found',
        },
        // Indicates that the request could not be completed due to a conflict with the current state of the target resource
        EXIST: {
            code: 409,
            message: 'Already exists',
        },
        // Indicates that the server understands the content type of the request entity but was unable to process the contained instructions
        INVALID_DATA: {
            code: 422,
            message: 'Invalid data',
        },
        // Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource
        TOKEN_EXPIRED: {
            code: 401,
            message: 'Token has expired',
        },
        // Indicates that the server understood the request but refuses to authorize it
        NOT_HAVE_PERMISSION: {
            code: 403,
            message: "You don't have permission",
        },

        /**
         * Success
         */
        // Indicates successful completion of the request
        SUCCESS: {
            code: 200,
            message: 'Success',
        },

        /**
         * Server Errors
         */
        // Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request
        SERVICE_ERROR: {
            code: 500,
            message: 'Service error',
        },
    },
};
