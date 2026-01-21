import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMembersStatus = {
	operation: ['getMembersStatus'],
	resource: ['data'],
};

export const membersStatusDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForMembersStatus,
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
		type: 'string',
		default: '2020-01-01',
		displayOptions: {
			show: showOnlyForMembersStatus,
		},
		description: 'Start date or relative: "-24 hours"',
		routing: {
			send: {
				type: 'body',
				property: 'start_date',
			},
		},
	},
	{
		displayName: 'Group',
		name: 'group',
		type: 'collection',
		placeholder: 'Add Group Filter',
		default: {},
		required: true,
		displayOptions: {
			show: showOnlyForMembersStatus,
		},
		options: [
			{
				displayName: 'Group External ID',
				name: 'group_external_id',
				type: 'string',
				default: '',
				description: 'Single ID or comma-separated list',
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				description: 'Single ID or comma-separated list',
			},
			{
				displayName: 'Group Type',
				name: 'group_type',
				type: 'options',
				options: [
					{ name: 'Course', value: 'course' },
					{ name: 'Group', value: 'group' },
					{ name: 'Qualification', value: 'qualification' },
				],
				default: 'course',
				description: 'Group type (v53+)',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'group',
			},
		},
	},
];
