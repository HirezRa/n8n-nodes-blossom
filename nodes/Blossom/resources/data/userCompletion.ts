import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserCompletion = {
	operation: ['getCompletion'],
	resource: ['data'],
};

export const userCompletionDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserCompletion,
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
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUserCompletion,
		},
		description: 'Start of completion-date range (ISO 8601 format)',
		routing: {
			send: {
				type: 'body',
				property: 'start_date',
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUserCompletion,
		},
		description: 'End of completion-date range (ISO 8601 format)',
		routing: {
			send: {
				type: 'body',
				property: 'end_date',
			},
		},
	},
	{
		displayName: 'Types',
		name: 'types',
		type: 'multiOptions',
		options: [
			{ name: 'Qualifications', value: 'Qualifications' },
			{ name: 'Courses', value: 'Courses' },
			{ name: 'Assignments', value: 'Assignments' },
		],
		default: ['Courses'],
		required: true,
		displayOptions: {
			show: showOnlyForUserCompletion,
		},
		description: 'Types of completions to retrieve',
		routing: {
			send: {
				type: 'body',
				property: 'types',
				value: '={{$value.join(",")}}',
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForUserCompletion,
		},
		options: [
			{
				displayName: 'Employee ID',
				name: 'employee_id',
				type: 'string',
				default: '',
			},
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
				description: 'Single ID or comma-separated list',
			},
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
				property: 'filters',
			},
		},
	},
];
