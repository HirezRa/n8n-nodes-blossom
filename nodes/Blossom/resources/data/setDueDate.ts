import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSetDueDate = {
	operation: ['setDueDate'],
	resource: ['data'],
};

export const setDueDateDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForSetDueDate,
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
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSetDueDate,
		},
		description: 'Date or relative: "-0hours" for immediate expiration',
		placeholder: '2030-01-01 or -0hours',
		routing: {
			send: {
				type: 'body',
				property: 'due_date',
			},
		},
	},
	{
		displayName: 'Group',
		name: 'group',
		type: 'collection',
		placeholder: 'Add Group Identifier',
		default: {},
		required: true,
		displayOptions: {
			show: showOnlyForSetDueDate,
		},
		options: [
			{
				displayName: 'Group External ID',
				name: 'group_external_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'group',
			},
		},
	},
	{
		displayName: 'User',
		name: 'user',
		type: 'collection',
		placeholder: 'Add User Identifier',
		default: {},
		required: true,
		displayOptions: {
			show: showOnlyForSetDueDate,
		},
		options: [
			{
				displayName: 'User External ID',
				name: 'user_external_id',
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
				displayName: 'User Name',
				name: 'user_name',
				type: 'string',
				default: '',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'user',
			},
		},
	},
];
