import { Blossom } from '../nodes/Blossom/Blossom.node';

describe('Blossom Node', () => {
	it('should have correct name and displayName', () => {
		const node = new Blossom();
		expect(node.description.name).toBe('blossom');
		expect(node.description.displayName).toBe('Blossom');
	});

	it('should have required credentials', () => {
		const node = new Blossom();
		expect(node.description.credentials).toBeDefined();
		expect(node.description.credentials?.length).toBe(1);
		expect(node.description.credentials?.[0].name).toBe('blossomSyncApi');
		expect(node.description.credentials?.[0].required).toBe(true);
	});

	it('should have resource options', () => {
		const node = new Blossom();
		const resourceProperty = node.description.properties.find(p => p.name === 'resource');
		expect(resourceProperty).toBeDefined();
		expect(resourceProperty?.type).toBe('options');
		expect(resourceProperty?.options).toBeDefined();
		expect(resourceProperty?.options?.length).toBeGreaterThan(0);
	});

	it('should have all required resources', () => {
		const node = new Blossom();
		const resourceProperty = node.description.properties.find(p => p.name === 'resource');
		const resourceValues = resourceProperty?.options?.map(opt => (opt as { value: string }).value) || [];
		
		expect(resourceValues).toContain('users');
		expect(resourceValues).toContain('groups');
		expect(resourceValues).toContain('memberships');
		expect(resourceValues).toContain('utilities');
		expect(resourceValues).toContain('suppliers');
		expect(resourceValues).toContain('performances');
		expect(resourceValues).toContain('managers');
	});

	it('should be usable as tool', () => {
		const node = new Blossom();
		expect(node.description.usableAsTool).toBe(true);
	});
});
