import { BlossomApi } from '../credentials/BlossomApi.credentials';

describe('BlossomApi Credentials', () => {
	it('should have correct name and displayName', () => {
		const credentials = new BlossomApi();
		expect(credentials.name).toBe('blossomSyncApi');
		expect(credentials.displayName).toBe('Blossom Sync API');
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

	it('should have authMethod property', () => {
		const credentials = new BlossomApi();
		const authMethodProperty = credentials.properties.find(p => p.name === 'authMethod');
		expect(authMethodProperty).toBeDefined();
		expect(authMethodProperty?.type).toBe('options');
	});

	it('should have username and password for basic auth', () => {
		const credentials = new BlossomApi();
		const usernameProperty = credentials.properties.find(p => p.name === 'username');
		const passwordProperty = credentials.properties.find(p => p.name === 'password');
		expect(usernameProperty).toBeDefined();
		expect(passwordProperty).toBeDefined();
		expect(usernameProperty?.required).toBe(true);
		expect(passwordProperty?.required).toBe(true);
	});
});
