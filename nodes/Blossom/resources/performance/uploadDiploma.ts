import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPerformanceUploadDiploma = {
	operation: ['uploadDiploma'],
	resource: ['performance'],
};

export const performanceUploadDiplomaDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceUploadDiploma,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'User Identifier Type',
		name: 'userIdentifierType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'User ID', value: 'user_id' },
			{ name: 'User Name', value: 'user_name' },
			{ name: 'Identity Number', value: 'identity_num' },
		],
		default: 'external_id',
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceUploadDiploma,
		},
		description: 'How to identify the user',
	},
	{
		displayName: 'User Identifier Value',
		name: 'userIdentifierValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceUploadDiploma,
		},
		description: 'The value of the user identifier',
	},
	{
		displayName: 'Group Identifier Type',
		name: 'groupIdentifierType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'Group ID', value: 'group_id' },
		],
		default: 'external_id',
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceUploadDiploma,
		},
		description: 'How to identify the group',
	},
	{
		displayName: 'Group Identifier Value',
		name: 'groupIdentifierValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceUploadDiploma,
		},
		description: 'The value of the group identifier',
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Upload Diploma', value: 'upload' },
			{ name: 'Remove Diploma', value: 'remove' },
		],
		default: 'upload',
		required: true,
		displayOptions: {
			show: showOnlyForPerformanceUploadDiploma,
		},
		description: 'Upload or remove diploma',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForPerformanceUploadDiploma,
				action: ['upload'],
			},
		},
		description: 'Name of the binary property containing the diploma file',
	},
];
