import type { INodeProperties } from 'n8n-workflow';
import { performanceImportAssignmentPerformancesCSVDescription } from './importAssignmentPerformancesCSV';
import { performanceImportGroupPerformancesCSVDescription } from './importGroupPerformancesCSV';
import { performanceUploadDiplomaDescription } from './uploadDiploma';

const showOnlyForPerformance = {
	resource: ['performance'],
};

export const performanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPerformance,
		},
		options: [
			{
				name: 'Import Assignment Performances CSV',
				value: 'importAssignmentPerformancesCSV',
				action: 'Import assignment performances from CSV',
				description: 'Import assignment performances from CSV file (requires programmatic execution)',
			},
			{
				name: 'Import Group Performances CSV',
				value: 'importGroupPerformancesCSV',
				action: 'Import group performances from CSV',
				description: 'Import group performances from CSV file (requires programmatic execution)',
			},
			{
				name: 'Upload Diploma',
				value: 'uploadDiploma',
				action: 'Upload or remove diploma',
				description: 'Upload or remove diploma for a user in a group (requires programmatic execution)',
			},
		],
		default: 'importAssignmentPerformancesCSV',
	},
	...performanceImportAssignmentPerformancesCSVDescription,
	...performanceImportGroupPerformancesCSVDescription,
	...performanceUploadDiplomaDescription,
];
