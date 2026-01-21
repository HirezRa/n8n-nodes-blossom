import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupAttachSubGroup = {
	operation: ['attachSubGroup'],
	resource: ['group'],
};

export const groupAttachSubGroupDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupAttachSubGroup,
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
		displayName: 'Sub Group External ID',
		name: 'subGroupExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupAttachSubGroup,
		},
		description: 'External ID of the sub group',
		routing: {
			send: {
				type: 'body',
				property: 'sub_group_identifier.external_id',
			},
		},
	},
	{
		displayName: 'Parent Group External ID',
		name: 'parentGroupExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupAttachSubGroup,
		},
		description: 'External ID of the parent group',
		routing: {
			send: {
				type: 'body',
				property: 'parent_group_identifier.external_id',
			},
		},
	},
];
