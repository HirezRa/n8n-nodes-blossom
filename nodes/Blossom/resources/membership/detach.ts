import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMembershipDetach = {
	operation: ['detach'],
	resource: ['membership'],
};

export const membershipDetachDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForMembershipDetach,
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
			show: showOnlyForMembershipDetach,
		},
		description: 'External ID of the user',
	},
			{
				displayName: 'Group External ID',
				name: 'groupExternalId',
				type: 'string',
				default: '',
				displayOptions: {
					show: showOnlyForMembershipDetach,
				},
				description: 'External ID of the group (leave empty to detach from all OUs using DetachUserFromOu)',
			},
];
