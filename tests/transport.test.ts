import { getBaseUrl, getDomain } from '../nodes/Blossom/shared/transport';

describe('Transport Functions', () => {
	describe('getBaseUrl', () => {
		it('should return clean base URL', () => {
			const credentials = { baseUrl: 'https://example.com/' };
			const result = getBaseUrl(credentials);
			expect(result).toBe('https://example.com');
		});

		it('should throw error for missing baseUrl', () => {
			const credentials = {};
			expect(() => getBaseUrl(credentials)).toThrow('Base URL is required');
		});
	});

	describe('getDomain', () => {
		it('should return domain', () => {
			const credentials = { domain: 'test-domain' };
			const result = getDomain(credentials);
			expect(result).toBe('test-domain');
		});

		it('should throw error for missing domain', () => {
			const credentials = {};
			expect(() => getDomain(credentials)).toThrow('Domain is required');
		});
	});
});
