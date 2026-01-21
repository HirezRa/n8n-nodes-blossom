import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUtilityRunAutoEnrollmentRules = {
	operation: ['runAutoEnrollmentRules'],
	resource: ['utility'],
};

export const utilityRunAutoEnrollmentRulesDescription: INodeProperties[] = [
	{
		displayName: 'Important Notice',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForUtilityRunAutoEnrollmentRules,
		},
		default: '',
		description: 'Call this once after entire sync process is complete. Run outside working hours. Limit: 4 calls per 24 hours.',
	},
];
