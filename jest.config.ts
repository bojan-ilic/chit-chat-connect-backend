// Import the 'Config' type from '@jest/types' to define the structure of Jest configuration options
import type {Config} from '@jest/types';

// Jest configuration options
const config: Config.InitialOptions = {
	// Use 'ts-jest' preset for TypeScript
	preset: 'ts-jest',

	// Specify the test environment as 'node'
	testEnvironment: 'node',

	// Specify the test environment as 'node'
	verbose: true,

	// Enable coverage reporting during tests
	collectCoverage: true,

	// Specify the files from which coverage information should be collected
	collectCoverageFrom: [
		'<rootDir>/backend/**/*.ts' // Include all TypeScript files in the backend directory
	],

	// Specify the pattern for finding test files
	testMatch: [
		'<rootDir>/tests/**/*.test.ts' // Include all test files in the backend directory
	],

	// Specify the directory where coverage reports should be generated
	coverageDirectory: '<rootDir>/coverage'
};

// Export the Jest configuration
export default config;