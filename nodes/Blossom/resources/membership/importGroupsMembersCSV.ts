import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMembershipImportCSV = {
	operation: ['importGroupsMembersCSV'],
	resource: ['membership'],
};

export const membershipImportGroupsMembersCSVDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForMembershipImportCSV,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'CSV File',
		name: 'csvFile',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForMembershipImportCSV,
		},
		description: 'Name of the binary property containing the CSV file with workspace_external_id and user_external_id columns',
	},
	{
		displayName: 'Important Notice',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForMembershipImportCSV,
		},
		default: '',
		description: 'Limit: 4 calls per 24 hours',
	},
];
