import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUtilityRemoveEmptyOrgUnits = {
	operation: ['removeEmptyOrgUnits'],
	resource: ['utility'],
};

export const utilityRemoveEmptyOrgUnitsDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUtilityRemoveEmptyOrgUnits,
		},
		description: 'Domain ID',
	},
];
