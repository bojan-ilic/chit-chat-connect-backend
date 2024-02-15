import '@jest/globals';
import addAdController from '../../../controllers/adController/addAd';
import {httpStatus} from '../../../config/constants';

// Mocking the AdModel module
jest.mock('../../../models/adModel.ts');

/**
 * Test suite for the addAdController function.
 */
describe('addAdController test suite', () => {
	/**
	 * Clear mocks after each test.
	 */
	afterEach(() => {
		// Each test starts with a clean state
		jest.clearAllMocks();
	});

	/**
	 * Test case for successful addition of a new advertisement.
	 */
	it('should add a new advertisement to the database', async () => {
		// Arrange:
		const sut = addAdController; // sut: system under test
		const expectedResponse = {
			status: 'success',
			message: httpStatus.SUCCESS.message,
			customMessage: 'Advertisement added successfully.',
			data: {
				_id: 'mockedAdId',
				title: 'New Ad',
				startDate: new Date('2024-12-23T16:36:06.839Z'),
				endDate: new Date('2025-01-22T16:36:06.839Z'),
				userId: 'mockedUserId',
				body: 'Ad body content',
				image: 'image-url.jpg',
				price: 29.99,
				duration: 30
			}
		};

		// Mock request and response objects
		const req: any = {};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn()
		};

		// Act:
		const actual = await sut(req, res);

		// Assert:
		expect(actual).toBeDefined(); // Ensure that the actual result is defined.
		expect(actual.status).toBe(expectedResponse.status);
		expect(actual.message).toBe(expectedResponse.message);
		expect(actual.customMessage).toBe(expectedResponse.customMessage);
		expect(actual.data).toEqual(expectedResponse.data);
	});

	/**
	 * Test case for handling an existing advertisement with the same title.
	 */
	it('should return an error if an ad with the same title already exists', async () => {
		// Arrange:
		const sut = addAdController;
		const expectedStatus = httpStatus.EXIST.code;
		const expectedResponse = {
			status: 'error',
			message: httpStatus.EXIST.message,
			customMessage: 'An advertisement with the same title already exists for this user.'
		};

		// Mock request and response objects
		const req: any = {};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn()
		};

		// Act:
		const actual = await sut(req, res);

		// Assert:
		expect(actual).toBeDefined(); // Ensure that the actual result is defined.
		expect(actual.status).toBe(expectedResponse.status);
		expect(actual.message).toBe(expectedResponse.message);
		expect(actual.customMessage).toBe(expectedResponse.customMessage);
	});

	/**
	 * Test case for handling an error during advertisement database save.
	 */
	it('should return an error if there is an issue saving the advertisement to the database', async () => {
		// Arrange:
		const sut = addAdController;
		const expectedStatus = httpStatus.SERVICE_ERROR.code;
		const expectedResponse = {
			status: 'error',
			message: httpStatus.SERVICE_ERROR.message,
			customMessage: 'Failed to save advertisement to the database.',
			error: 'Database save error'
		};

		// Mock request and response objects
		const req: any = {};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn()
		};

		// Act:
		const actual = await sut(req, res);

		// Assert:
		expect(actual).toBeDefined();
		expect(actual.status).toBe(expectedResponse.status);
		expect(actual.message).toBe(expectedResponse.message);
		expect(actual.customMessage).toBe(expectedResponse.customMessage);
		expect(actual.error).toBe(expectedResponse.error);
	});
});
