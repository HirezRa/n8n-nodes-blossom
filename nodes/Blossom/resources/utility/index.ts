import type { INodeProperties } from 'n8n-workflow';
import { utilityTestDescription } from './test';
import { utilityRunAutoEnrollmentRulesDescription } from './runAutoEnrollmentRules';
import { utilityRunScheduledImportsDescription } from './runScheduledImports';
import { utilityRemoveEmptyOrgUnitsDescription } from './removeEmptyOrgUnits';

const showOnlyForUtility = {
	resource: ['utility'],
};

export const utilityDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUtility,
		},
		options: [
			{
				name: 'Test',
				value: 'test',
				action: 'Test API connection',
				description: 'Test the connection to Blossom API',
				routing: {
					request: {
						method: 'GET',
						url: '/WebServices/sync_2/Test',
					},
				},
			},
			{
				name: 'Run Auto Enrollment Rules',
				value: 'runAutoEnrollmentRules',
				action: 'Run auto enrollment rules',
				description: 'Run auto enrollment rules (call once after entire sync is complete)',
				routing: {
					request: {
						method: 'GET',
						url: '/WebServices/sync_2/RunAutoEnrollmentRules',
					},
				},
			},
			{
				name: 'Run Scheduled Imports',
				value: 'runScheduledImports',
				action: 'Run scheduled imports',
				description: 'Run scheduled imports (cannot run at midnight)',
				routing: {
					request: {
						method: 'GET',
						url: '/WebServices/sync_2/RunScheduledImports',
					},
				},
			},
			{
				name: 'Remove Empty Org Units',
				value: 'removeEmptyOrgUnits',
				action: 'Remove empty organizational units',
				description: 'Remove empty organizational units',
				routing: {
					request: {
						method: 'GET',
						url: '/WebServices/sync_2/RemoveEmptyOrgUnits/{{$parameter.domain}}',
					},
				},
			},
		],
		default: 'test',
	},
	...utilityTestDescription,
	...utilityRunAutoEnrollmentRulesDescription,
	...utilityRunScheduledImportsDescription,
	...utilityRemoveEmptyOrgUnitsDescription,
];
