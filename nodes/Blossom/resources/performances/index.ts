import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPerformances = {
	resource: ['performances'],
};

export const performancesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPerformances,
		},
		options: [
			{
				name: 'Import Assignment Performances CSV',
				value: 'importAssignmentPerformancesCSV',
				description: 'Import assignment performances using CSV/Excel',
				action: 'Import assignment performances from CSV',
			},
			{
				name: 'Import Group Performances CSV',
				value: 'importGroupPerformancesCSV',
				description: 'Import performances for qualifications and courses using CSV/Excel',
				action: 'Import group performances from CSV',
			},
		],
		default: 'importAssignmentPerformancesCSV',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: showOnlyForPerformances,
		},
		description: 'Domain name or ID',
	},
	{
		displayName: 'CSV File',
		name: 'csvFile',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForPerformances,
		},
		description: 'CSV file content or file path',
	},
];
