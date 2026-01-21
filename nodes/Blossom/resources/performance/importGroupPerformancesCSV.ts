import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPerformanceImportGroup = {
	operation: ['importGroupPerformancesCSV'],
	resource: ['performance'],
};

export const performanceImportGroupPerformancesCSVDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceImportGroup,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'CSV File',
		name: 'csvFile',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceImportGroup,
		},
		description: 'Name of the binary property containing the CSV file. Required column: user_name or user_external_id.',
	},
];
