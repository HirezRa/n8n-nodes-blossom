import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUtilities = {
	resource: ['utilities'],
};

export const utilitiesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUtilities,
		},
		options: [
			{
				name: 'Remove Empty Org Units',
				value: 'removeEmptyOrgUnits',
				description: 'Delete org units with no members, managers, or relevant hierarchy',
				action: 'Remove empty org units',
			},
			{
				name: 'Run Auto Enrollment Rules',
				value: 'runAutoEnrollmentRules',
				description: 'Execute auto enrollment rules for all workspaces and users',
				action: 'Run auto enrollment rules',
			},
			{
				name: 'Run Scheduled Imports',
				value: 'runScheduledImports',
				description: 'Execute scheduled imports from SFTP or local folder',
				action: 'Run scheduled imports',
			},
			{
				name: 'Test',
				value: 'test',
				description: 'Test method - returns protocol and random number',
				action: 'Test connection',
			},
		],
		default: 'test',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForUtilities,
				operation: ['removeEmptyOrgUnits', 'test'],
			},
		},
		description: 'Domain name or ID',
	},
];