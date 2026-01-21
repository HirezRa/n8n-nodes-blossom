import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManagerDetach = {
	operation: ['detach'],
	resource: ['manager'],
};

export const managerDetachDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForManagerDetach,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'User External ID',
		name: 'userExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForManagerDetach,
		},
		description: 'External ID of the user',
	},
	{
		displayName: 'Group External ID',
		name: 'groupExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForManagerDetach,
		},
		description: 'External ID of the group',
	},
];
