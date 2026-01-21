import type { INodeProperties } from 'n8n-workflow';
import { managerAttachDescription } from './attach';
import { managerDetachDescription } from './detach';

const showOnlyForManager = {
	resource: ['manager'],
};

export const managerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForManager,
		},
		options: [
			{
				name: 'Attach Manager',
				value: 'attach',
				action: 'Attach a manager to a user in a group',
				description: 'Attach a manager to a user in a group/workspace',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/AttachManager/{{$parameter.domain}}/{{$parameter.userExternalId}}/{{$parameter.groupExternalId}}/{{$parameter.managerType}}/{{$parameter.setPrimary}}',
					},
				},
			},
			{
				name: 'Detach Manager',
				value: 'detach',
				action: 'Detach a manager from a user in a group',
				description: 'Detach a manager from a user in a group/workspace',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/DetachManager/{{$parameter.domain}}/{{$parameter.userExternalId}}/{{$parameter.groupExternalId}}',
					},
				},
			},
		],
		default: 'attach',
	},
	...managerAttachDescription,
	...managerDetachDescription,
];
