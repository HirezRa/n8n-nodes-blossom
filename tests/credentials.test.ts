import { BlossomApi } from '../credentials/BlossomApi.credentials';

describe('BlossomApi Credentials', () => {
	it('should have correct name and displayName', () => {
		const credentials = new BlossomApi();
		expect(credentials.name).toBe('blossomApi');
		expect(credentials.displayName).toBe('Blossom API');
	});

	it('should have required properties', () => {
		const credentials = new BlossomApi();
		expect(credentials.properties).toBeDefined();
		expect(credentials.properties.length).toBeGreaterThan(0);
	});

	it('should have baseUrl property', () => {
		const credentials = new BlossomApi();
		const baseUrlProperty = credentials.properties.find(p => p.name === 'baseUrl');
		expect(baseUrlProperty).toBeDefined();
		expect(baseUrlProperty?.required).toBe(true);
	});

	it('should have authType property', () => {
		const credentials = new BlossomApi();
		const authTypeProperty = credentials.properties.find(p => p.name === 'authType');
		expect(authTypeProperty).toBeDefined();
		expect(authTypeProperty?.type).toBe('options');
	});

	it('should have domain property for basic auth', () => {
		const credentials = new BlossomApi();
		const domainProperty = credentials.properties.find(p => p.name === 'domain');
		expect(domainProperty).toBeDefined();
		expect(domainProperty?.required).toBe(true);
	});
});
