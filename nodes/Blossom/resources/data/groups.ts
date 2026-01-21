import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroups = {
	operation: ['getGroups'],
	resource: ['data'],
};

export const groupsDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroups,
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
		displayName: 'Return as Array',
		name: 'asArray',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForGroups,
		},
		description: 'Whether to return results as an array',
		routing: {
			send: {
				type: 'body',
				property: 'as_array',
				value: '={{$value ? 1 : 0}}',
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
			show: showOnlyForGroups,
		},
		options: [
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
