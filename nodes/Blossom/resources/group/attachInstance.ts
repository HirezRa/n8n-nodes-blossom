import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupAttachInstance = {
	operation: ['attachInstance'],
	resource: ['group'],
};

export const groupAttachInstanceDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupAttachInstance,
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
		displayName: 'Group External ID',
		name: 'groupExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupAttachInstance,
		},
		description: 'External ID of the group/course instance',
		routing: {
			send: {
				type: 'body',
				property: 'group_identifier.external_id',
			},
		},
	},
	{
		displayName: 'Template External ID',
		name: 'templateExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupAttachInstance,
		},
		description: 'External ID of the template',
		routing: {
			send: {
				type: 'body',
				property: 'template_identifier.external_id',
			},
		},
	},
];
