import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUtilityRunScheduledImports = {
	operation: ['runScheduledImports'],
	resource: ['utility'],
};

export const utilityRunScheduledImportsDescription: INodeProperties[] = [
	{
		displayName: 'Important Notice',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForUtilityRunScheduledImports,
		},
		default: '',
		description: 'Cannot run at midnight (runs automatically). Limit: 4 calls per 24 hours.',
	},
];
