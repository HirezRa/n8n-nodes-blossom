import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupUpdate = {
	operation: ['update'],
	resource: ['group'],
};

export const groupUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupUpdate,
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
		displayName: 'External ID',
		name: 'external_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupUpdate,
		},
		description: 'External ID of the group',
		routing: {
			send: {
				type: 'body',
				property: 'details.external_id',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupUpdate,
		},
		description: 'Group name',
		routing: {
			send: {
				type: 'body',
				property: 'details.name',
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Course', value: 'course' },
			{ name: 'Group', value: 'group' },
			{ name: 'Org Unit (OU)', value: 'ou' },
			{ name: 'Qualification', value: 'qualification' },
			{ name: 'Role', value: 'role' },
			{ name: 'Template', value: 'template' },
			{ name: 'Workplan', value: 'workplan' },
		],
		default: 'group',
		required: true,
		displayOptions: {
			show: showOnlyForGroupUpdate,
		},
		description: 'Group type',
		routing: {
			send: {
				type: 'body',
				property: 'details.type',
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		displayOptions: {
			show: showOnlyForGroupUpdate,
		},
		description: 'Group description',
		routing: {
			send: {
				type: 'body',
				property: 'details.description',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForGroupUpdate,
		},
		options: [
			{
				displayName: 'Close Date',
				name: 'close_date',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.close_date',
					},
				},
			},
			{
				displayName: 'Custom Field 1',
				name: 'field_1',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.field_1',
					},
				},
			},
			{
				displayName: 'Custom Field 2',
				name: 'field_2',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.field_2',
					},
				},
			},
			{
				displayName: 'Open Date',
				name: 'open_date',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.open_date',
					},
				},
			},
			{
				displayName: 'Parent External ID',
				name: 'parent_external_id',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.parent_external_id',
					},
				},
			},
			{
				displayName: 'Passing Grade',
				name: 'passing_grade',
				type: 'number',
				default: 0,
				routing: {
					send: {
						type: 'body',
						property: 'details.passing_grade',
					},
				},
			},
			{
				displayName: 'Template External ID',
				name: 'template_external_id',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.template_external_id',
					},
				},
			},
		],
	},
];
