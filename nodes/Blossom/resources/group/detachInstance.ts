import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupDetachInstance = {
	operation: ['detachInstance'],
	resource: ['group'],
};

export const groupDetachInstanceDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupDetachInstance,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'Group External ID',
		name: 'groupExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupDetachInstance,
		},
		description: 'External ID of the group to detach from template',
	},
];
