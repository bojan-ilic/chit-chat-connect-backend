/**
 * Constants file containing HTTP status codes and their corresponding messages.
 * These codes represent various response statuses across systems and interactions.
 */

/**
 * HTTP Status Interface
 * Defines the structure of HTTP status codes and their corresponding messages.
 * @interface HttpStatus
 */
interface HttpStatus {
	/**
	 * Client Errors
	 */
	NOT_FOUND: {
		code: number;
		message: string;
	};
	EXIST: {
		code: number;
		message: string;
	};
	INVALID_DATA: {
		code: number;
		message: string;
	};
	TOKEN_EXPIRED: {
		code: number;
		message: string;
	};
	NOT_HAVE_PERMISSION: {
		code: number;
		message: string;
	};

	/**
	 * Success
	 */
	SUCCESS: {
		code: number;
		message: string;
	};

	/**
	 * Server Errors
	 */
	SERVICE_ERROR: {
		code: number;
		message: string;
	};
}

// Export an object containing HTTP status codes and messages
export const httpStatus: HttpStatus = {
	/**
	 * Client Errors
	 */
	// Indicates that the server did not find the requested resource
	NOT_FOUND: {
		code: 404,
		message: 'The requested resource was not found'
	},
	// Indicates that the request could not be completed due to a conflict with the current state of the target resource
	EXIST: {
		code: 409,
		message: 'Resource already exists'
	},
	// Indicates that the server understands the content type of the request entity but was unable to process the contained instructions
	INVALID_DATA: {
		code: 422,
		message: 'The request contains invalid data and cannot be processed'
	},
	// Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource
	TOKEN_EXPIRED: {
		code: 401,
		message: 'The authentication token has expired'
	},
	// Indicates that the server understood the request but refuses to authorize it
	NOT_HAVE_PERMISSION: {
		code: 403,
		message: 'Access denied: insufficient permissions'
	},

	/**
	 * Success
	 */
	// Indicates successful completion of the request
	SUCCESS: {
		code: 200,
		message: 'The request has been successfully processed'
	},

	/**
	 * Server Errors
	 */
	// Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request
	SERVICE_ERROR: {
		code: 500,
		message: 'The server encountered an unexpected error'
	}
};
