import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUtilityTest = {
	operation: ['test'],
	resource: ['utility'],
};

export const utilityTestDescription: INodeProperties[] = [
	{
		displayName: 'Test Connection',
		name: 'testInfo',
		type: 'notice',
		displayOptions: {
			show: showOnlyForUtilityTest,
		},
		default: '',
		description: 'Tests the connection to Blossom API and returns protocol and random number',
	},
];
