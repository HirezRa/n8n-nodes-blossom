import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMemberships = {
	resource: ['memberships'],
};

export const membershipsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMemberships,
		},
		options: [
			{
				name: 'Attach User to Group',
				value: 'attachUserToGroup',
				description: 'Attach user to a group object (Group/Course/Ou/Qualification/Workplan)',
				action: 'Attach user to group',
			},
			{
				name: 'Detach User From Group',
				value: 'detachUserFromGroup',
				description: 'Detach user from a group object',
				action: 'Detach user from group',
			},
			{
				name: 'Detach User From OU',
				value: 'detachUserFromOu',
				description: 'Detach user from its only OU',
				action: 'Detach user from OU',
			},
			{
				name: 'Import Groups Members CSV',
				value: 'importGroupsMembersCSV',
				description: 'Attach multiple users to workspaces using CSV/Excel',
				action: 'Import group members from CSV',
			},
		],
		default: 'attachUserToGroup',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForMemberships,
				operation: ['attachUserToGroup', 'detachUserFromGroup', 'detachUserFromOu'],
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
				...showOnlyForMemberships,
				operation: ['attachUserToGroup', 'detachUserFromGroup', 'detachUserFromOu'],
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
		displayName: 'Group Identifier',
		name: 'groupIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForMemberships,
				operation: ['attachUserToGroup', 'detachUserFromGroup', 'attachManager', 'detachManager'],
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
		displayName: 'Manager Type',
		name: 'managerType',
		type: 'string',
		default: 'all',
		displayOptions: {
			show: {
				...showOnlyForMemberships,
				operation: ['attachManager'],
			},
		},
		description: 'Manager permissions name OR \'all\'/\'none\'',
	},
	{
		displayName: 'Set Primary',
		name: 'setPrimary',
		type: 'options',
		options: [
			{ name: 'No', value: '0', description: 'Do not set as primary' },
			{ name: 'Yes', value: '1', description: 'Set manager as primary' },
			{ name: 'Remove Others and Set Primary', value: '2', description: 'Remove existing managers and add this manager as primary' },
		],
		default: '0',
		displayOptions: {
			show: {
				...showOnlyForMemberships,
				operation: ['attachManager'],
			},
		},
		description: 'Set manager as primary',
	},
	{
		displayName: 'CSV File',
		name: 'csvFile',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForMemberships,
				operation: ['importGroupsMembersCSV'],
			},
		},
		description: 'CSV file content or file path',
	},
	{
		displayName: 'Import Options',
		name: 'importOptions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForMemberships,
				operation: ['importGroupsMembersCSV'],
			},
		},
		options: [
			{
				name: 'options',
				displayName: 'Options',
				values: [
					{
						displayName: 'Clean OU',
						name: 'clean_ou',
						type: 'boolean',
						default: false,
						description: 'Whether to remove empty org units',
					},
				],
			},
		],

	},
];
