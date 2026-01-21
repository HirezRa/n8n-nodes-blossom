import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMeetings = {
	operation: ['getMeetings'],
	resource: ['data'],
};

export const getMeetingsDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGetMeetings,
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
			show: showOnlyForGetMeetings,
		},
		description: 'Start date and time (ISO 8601 format)',
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
			show: showOnlyForGetMeetings,
		},
		description: 'End date and time (ISO 8601 format)',
		routing: {
			send: {
				type: 'body',
				property: 'end_date',
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
			show: showOnlyForGetMeetings,
		},
		options: [
			{
				displayName: 'User Names',
				name: 'user_name',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Array of user names',
			},
			{
				displayName: 'Group External IDs',
				name: 'group_external_id',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Array of group external IDs',
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
