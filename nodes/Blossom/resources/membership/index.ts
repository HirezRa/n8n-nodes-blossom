import type { INodeProperties } from 'n8n-workflow';
import { membershipAttachDescription } from './attach';
import { membershipDetachDescription } from './detach';
import { membershipImportGroupsMembersCSVDescription } from './importGroupsMembersCSV';

const showOnlyForMembership = {
	resource: ['membership'],
};

export const membershipDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMembership,
		},
		options: [
			{
				name: 'Attach User to Group',
				value: 'attach',
				action: 'Attach a user to a group',
				description: 'Attach a user to a group/workspace',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/AttachUserToGroup/{{$parameter.domain}}/{{$parameter.userExternalId}}/{{$parameter.groupExternalId}}',
					},
				},
			},
			{
				name: 'Detach User From Group',
				value: 'detach',
				action: 'Detach a user from a group',
				description: 'Detach a user from a group/workspace (leave Group External ID empty to detach from all OUs)',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/{{$parameter.groupExternalId ? "DetachUserFromGroup" : "DetachUserFromOu"}}/{{$parameter.domain}}/{{$parameter.userExternalId}}{{$parameter.groupExternalId ? "/" + $parameter.groupExternalId : ""}}',
					},
				},
			},
			{
				name: 'Import Groups Members CSV',
				value: 'importGroupsMembersCSV',
				action: 'Import group members from CSV',
				description: 'Import group members from CSV file (requires programmatic execution). Limit: 4 calls per 24 hours.',
			},
		],
		default: 'attach',
	},
	...membershipAttachDescription,
	...membershipDetachDescription,
	...membershipImportGroupsMembersCSVDescription,
];
