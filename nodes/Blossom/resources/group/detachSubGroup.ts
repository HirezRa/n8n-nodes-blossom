import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupDetachSubGroup = {
	operation: ['detachSubGroup'],
	resource: ['group'],
};

export const groupDetachSubGroupDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupDetachSubGroup,
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
			show: showOnlyForGroupDetachSubGroup,
		},
		description: 'External ID of the group to detach',
	},
];
