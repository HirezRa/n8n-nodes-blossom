import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupDelete = {
	operation: ['delete'],
	resource: ['group'],
};

export const groupDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupDelete,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'Group Identifier Type',
		name: 'groupIdentifierType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'Group ID', value: 'group_id' },
		],
		default: 'external_id',
		required: true,
		displayOptions: {
			show: showOnlyForGroupDelete,
		},
		description: 'How to identify the group',
	},
	{
		displayName: 'Group Identifier Value',
		name: 'groupIdentifierValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupDelete,
		},
		description: 'The value of the group identifier',
	},
];
