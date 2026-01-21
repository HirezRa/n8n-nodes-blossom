import type { INodeProperties } from 'n8n-workflow';
import { groupUpdateDescription } from './update';
import { groupDeleteDescription } from './delete';
import { groupAttachSubGroupDescription } from './attachSubGroup';
import { groupDetachSubGroupDescription } from './detachSubGroup';
import { groupAttachInstanceDescription } from './attachInstance';
import { groupDetachInstanceDescription } from './detachInstance';
import { groupImportGroupsCSVDescription } from './importGroupsCSV';

const showOnlyForGroups = {
	resource: ['group'],
};

export const groupDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForGroups,
		},
		options: [
			{
				name: 'Attach Instance',
				value: 'attachInstance',
				action: 'Attach group to template',
				description: 'Attach a Group/Course to a Template',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/sync_2/AttachInstance/{{$parameter.domain}}',
					},
				},
			},
			{
				name: 'Attach Sub Group',
				value: 'attachSubGroup',
				action: 'Attach sub workspace to parent',
				description: 'Attach a sub workspace to a parent workspace (same type required)',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/sync_2/AttachSubGroup/{{$parameter.domain}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a group',
				description: 'Delete a group',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/DeleteGroup/{{$parameter.domain}}/{{$parameter.groupIdentifierType}}={{$parameter.groupIdentifierValue}}',
					},
				},
			},
			{
				name: 'Detach Instance',
				value: 'detachInstance',
				action: 'Detach group from template',
				description: 'Detach a Group/Course from its Template',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/DetachInstance/{{$parameter.domain}}/{{$parameter.groupExternalId}}',
					},
				},
			},
			{
				name: 'Detach Sub Group',
				value: 'detachSubGroup',
				action: 'Detach sub workspace from parent',
				description: 'Detach a sub workspace from its parent',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/DetachSubGroup/{{$parameter.domain}}/{{$parameter.groupExternalId}}',
					},
				},
			},
			{
				name: 'Import Groups CSV',
				value: 'importGroupsCSV',
				action: 'Import groups from CSV',
				description: 'Import groups/workspaces from CSV file (requires programmatic execution). Limit: 4 calls per 24 hours.',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Create or update a group',
				description: 'Create or update a group/workspace',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/sync_2/UpdateGroup/{{$parameter.domain}}',
					},
				},
			},
		],
		default: 'update',
	},
	...groupUpdateDescription,
	...groupDeleteDescription,
	...groupAttachSubGroupDescription,
	...groupDetachSubGroupDescription,
	...groupAttachInstanceDescription,
	...groupDetachInstanceDescription,
	...groupImportGroupsCSVDescription,
];
