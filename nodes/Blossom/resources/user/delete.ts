import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserDelete = {
	operation: ['delete'],
	resource: ['user'],
};

export const userDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserDelete,
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
			show: showOnlyForUserDelete,
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
			show: showOnlyForUserDelete,
		},
		description: 'The value of the user identifier',
	},
];
