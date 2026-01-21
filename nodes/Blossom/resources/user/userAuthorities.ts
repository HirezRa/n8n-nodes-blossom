import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserAuthorities = {
	operation: ['userAuthorities'],
	resource: ['user'],
};

export const userAuthoritiesDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserAuthorities,
		},
		description: 'Domain ID',
		routing: {
			send: {
				type: 'body',
				property: 'domain',
			},
		},
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
			show: showOnlyForUserAuthorities,
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
			show: showOnlyForUserAuthorities,
		},
		description: 'The value of the user identifier',
	},
	{
		displayName: 'Authorities',
		name: 'authorities',
		type: 'collection',
		placeholder: 'Add Authority',
		default: {},
		displayOptions: {
			show: showOnlyForUserAuthorities,
		},
		options: [
			{
				displayName: 'HR Manager External ID',
				name: 'user_hr_manager_id',
				type: 'string',
				default: '',
				description: 'External ID of HR manager (empty to clear)',
			},
			{
				displayName: 'Professional Manager External ID',
				name: 'user_professional_manager_id',
				type: 'string',
				default: '',
				description: 'External ID of professional manager (empty to clear)',
			},
			{
				displayName: 'Coach External ID',
				name: 'user_coach_id',
				type: 'string',
				default: '',
				description: 'External ID of coach (empty to clear)',
			},
			{
				displayName: 'Authorization Supervisor External ID',
				name: 'user_auth_supervisor_id',
				type: 'string',
				default: '',
				description: 'External ID of authorization supervisor (empty to clear)',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'authorities',
			},
		},
	},
];
