import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManagerAttach = {
	operation: ['attach'],
	resource: ['manager'],
};

export const managerAttachDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForManagerAttach,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'User External ID',
		name: 'userExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForManagerAttach,
		},
		description: 'External ID of the user',
	},
	{
		displayName: 'Group External ID',
		name: 'groupExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForManagerAttach,
		},
		description: 'External ID of the group',
	},
	{
		displayName: 'Manager Type',
		name: 'managerType',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Authorization Supervisor', value: 'auth' },
			{ name: 'Coach', value: 'coach' },
			{ name: 'HR Manager', value: 'hr' },
			{ name: 'Professional Manager', value: 'professional' },
		],
		default: 'all',
		required: true,
		displayOptions: {
			show: showOnlyForManagerAttach,
		},
		description: 'Type of manager to attach',
	},
	{
		displayName: 'Set Primary',
		name: 'setPrimary',
		type: 'options',
		options: [
			{ name: 'No', value: '0' },
			{ name: 'Set as Primary', value: '1' },
			{ name: 'Make Exclusive (Remove Existing, Set as Primary)', value: '2' },
		],
		default: '0',
		required: true,
		displayOptions: {
			show: showOnlyForManagerAttach,
		},
		description: 'Whether to set as primary manager',
	},
];
