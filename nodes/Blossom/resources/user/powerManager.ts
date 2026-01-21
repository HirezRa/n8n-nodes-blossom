import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserPowerManager = {
	operation: ['powerManager'],
	resource: ['user'],
};

export const userPowerManagerDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserPowerManager,
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
			show: showOnlyForUserPowerManager,
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
			show: showOnlyForUserPowerManager,
		},
		description: 'The value of the user identifier',
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Grant Power Manager', value: 'grant' },
			{ name: 'Revoke Power Manager', value: 'revoke' },
		],
		default: 'grant',
		required: true,
		displayOptions: {
			show: showOnlyForUserPowerManager,
		},
		description: 'Grant or revoke Power Manager privileges',
	},
];
