import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManagers = {
	resource: ['managers'],
};

export const managersDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForManagers,
		},
		options: [
			{
				name: 'Attach Manager',
				value: 'attachManager',
				description: 'Attach manager to a group object',
				action: 'Attach manager',
			},
			{
				name: 'Detach Manager',
				value: 'detachManager',
				description: 'Detach manager from a group object',
				action: 'Detach manager',
			},
			{
				name: 'Power Manager',
				value: 'powerManager',
				description: 'Set or unset power manager role',
				action: 'Set power manager',
			},
			{
				name: 'User Authorities',
				value: 'userAuthorities',
				description: 'Set user authorities (HR manager, professional manager, coach, supervisor)',
				action: 'Set user authorities',
			},
		],
		default: 'attachManager',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: showOnlyForManagers,
		},
		description: 'Domain ID or name',
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
				...showOnlyForManagers,
				operation: ['attachManager', 'detachManager', 'powerManager', 'userAuthorities'],
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
				...showOnlyForManagers,
				operation: ['attachManager', 'detachManager'],
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
		displayName: 'Manager Type',
		name: 'managerType',
		type: 'string',
		default: 'all',
		displayOptions: {
			show: {
				...showOnlyForManagers,
				operation: ['attachManager'],
			},
		},
		description: 'Permission name OR \'all\'/\'none\'',
	},
	{
		displayName: 'Set Primary',
		name: 'setPrimary',
		type: 'options',
		options: [
			{
				name: 'Regular Manager',
				value: '0',
				description: 'Set as regular manager',
			},
			{
				name: 'Primary Manager',
				value: '1',
				description: 'Set as primary manager',
			},
			{
				name: 'Remove Existing and Set Primary',
				value: '2',
				description: 'Remove existing managers and set as primary',
			},
		],
		default: '0',
		displayOptions: {
			show: {
				...showOnlyForManagers,
				operation: ['attachManager'],
			},
		},
		description: 'Manager role type',
	},
	{
		displayName: 'Power Manager Type',
		name: 'powerManagerType',
		type: 'options',
		options: [
			{
				name: 'Power Manager',
				value: 'PowerManager',
				description: 'Grant power manager role',
			},
			{
				name: 'User',
				value: 'User',
				description: 'Revoke power manager role',
			},
		],
		default: 'PowerManager',
		displayOptions: {
			show: {
				...showOnlyForManagers,
				operation: ['powerManager'],
			},
		},
		description: 'Power manager role type',
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
				...showOnlyForManagers,
				operation: ['userAuthorities'],
			},
		},
		options: [
			{
				name: 'authority',
				displayName: 'Authority',
				values: [
					{
						displayName: 'HR Manager',
						name: 'hr_manager',
						type: 'string',
						default: '',
						description: 'Human resources coordinator (external_id or user_id=123)',
					},
					{
						displayName: 'Professional Manager',
						name: 'professional_manager',
						type: 'string',
						default: '',
						description: 'Professional manager (external_id or user_id=123)',
					},
					{
						displayName: 'Coach',
						name: 'coach',
						type: 'string',
						default: '',
						description: 'Personal coach (external_id or user_id=123)',
					},
					{
						displayName: 'Supervisor',
						name: 'supervisor',
						type: 'string',
						default: '',
						description: 'Supervisor (external_id or user_id=123)',
					},
				],
			},
		],
	},
];
