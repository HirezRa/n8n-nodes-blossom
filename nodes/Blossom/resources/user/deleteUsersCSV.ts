import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserDeleteCSV = {
	operation: ['deleteUsersCSV'],
	resource: ['user'],
};

export const userDeleteUsersCSVDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserDeleteCSV,
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
			show: showOnlyForUserDeleteCSV,
		},
		description: 'Name of the binary property containing the CSV file with user_external_id column',
	},
	{
		displayName: 'Important Notice',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForUserDeleteCSV,
		},
		default: '',
		description: 'This is a soft delete - updating a deleted user restores them. Limit: 4 calls per 24 hours.',
	},
];
