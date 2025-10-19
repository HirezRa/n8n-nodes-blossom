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
				name: 'Get Domain Info',
				value: 'getDomainInfo',
				description: 'Get domain information and settings',
				action: 'Get domain info',
			},
			{
				name: 'Get System Info',
				value: 'getSystemInfo',
				description: 'Get system information and version',
				action: 'Get system info',
			},
			{
				name: 'Power Manager',
				value: 'powerManager',
				description: 'Set/unset user as power manager',
				action: 'Set power manager',
			},
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
			{
				name: 'Upload Diploma',
				value: 'uploadDiploma',
				description: 'Upload or remove diploma file for a user in a group object',
				action: 'Upload diploma',
			},
			{
				name: 'User Authorities',
				value: 'userAuthorities',
				description: 'Attach authorities to user (HR coordinator, Professional manager, etc.)',
				action: 'Set user authorities',
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
				operation: ['removeEmptyOrgUnits', 'userAuthorities', 'powerManager', 'uploadDiploma'],
			},
		},
		description: 'Domain name or ID',
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
				...showOnlyForUtilities,
				operation: ['userAuthorities', 'powerManager', 'uploadDiploma'],
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

					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'string',
						default: '',

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
		displayName: 'Authorities',
		name: 'authorities',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForUtilities,
				operation: ['userAuthorities'],
			},
		},
		options: [
			{
				name: 'authorities',
				displayName: 'Authorities',
				values: [
					{
						displayName: 'HR Manager ID',
						name: 'user_hr_manager_id',
						type: 'string',
						default: '',
						description: 'HR manager external ID or identifier',
					},
					{
						displayName: 'Professional Manager ID',
						name: 'user_professional_manager_id',
						type: 'string',
						default: '',
						description: 'Professional manager external ID or identifier',
					},
					{
						displayName: 'Coach ID',
						name: 'user_coach_id',
						type: 'string',
						default: '',
						description: 'Coach external ID or identifier',
					},
					{
						displayName: 'Auth Supervisor ID',
						name: 'user_auth_supervisor_id',
						type: 'string',
						default: '',
						description: 'Auth supervisor external ID or identifier',
					},
				],
			},
		],
		description: 'User authorities',
	},
	{
		displayName: 'Power Manager Type',
		name: 'powerManagerType',
		type: 'options',
		options: [
			{ name: 'PowerManager', value: 'PowerManager', description: 'Set as power manager' },
			{ name: 'User', value: 'User', description: 'Set as regular user' },
		],
		default: 'PowerManager',
		displayOptions: {
			show: {
				...showOnlyForUtilities,
				operation: ['powerManager'],
			},
		},

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
				...showOnlyForUtilities,
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
						name: 'group_external_id',
						type: 'string',
						default: '',
						description: 'Group external ID',
					},
					{
						displayName: 'Group ID',
						name: 'group_id',
						type: 'string',
						default: '',

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
				...showOnlyForUtilities,
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
				...showOnlyForUtilities,
				operation: ['uploadDiploma'],
			},
		},
		description: 'Whether to remove current diploma',
	},
];
