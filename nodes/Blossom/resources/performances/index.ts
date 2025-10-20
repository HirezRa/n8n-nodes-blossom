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
			{
				name: 'Upload Diploma',
				value: 'uploadDiploma',
				description: 'Upload or remove diploma file for a user in a group object',
				action: 'Upload diploma',
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
			show: {
				...showOnlyForPerformances,
				operation: ['importAssignmentPerformancesCSV', 'importGroupPerformancesCSV'],
			},
		},
		description: 'CSV file content or file path',
	},
	{
		displayName: 'User Identifier',
		name: 'userIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForPerformances,
				operation: ['uploadDiploma'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'External ID from foreign system',
					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'string',
						default: '',
						description: 'Internal user ID',
					},
					{
						displayName: 'Username',
						name: 'user_name',
						type: 'string',
						default: '',

					},
					{
						displayName: 'Identity Number',
						name: 'identity_num',
						type: 'string',
						default: '',

					},
				],
			},
		],
	},
	{
		displayName: 'Group Identifier',
		name: 'groupIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForPerformances,
				operation: ['uploadDiploma'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'Group External ID',
						name: 'group_external_id',
						type: 'string',
						default: '',
						description: 'External ID from foreign system',
					},
					{
						displayName: 'Group ID',
						name: 'group_id',
						type: 'string',
						default: '',
						description: 'Internal group ID',
					},
				],
			},
		],
	},
	{
		displayName: 'Diploma File',
		name: 'diplomaFile',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPerformances,
				operation: ['uploadDiploma'],
			},
		},
		description: 'Diploma file content or file path',
	},
	{
		displayName: 'Remove Diploma',
		name: 'removeDiploma',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForPerformances,
				operation: ['uploadDiploma'],
			},
		},
		description: 'Whether to remove the diploma instead of uploading',
	},
];
