import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserImportCSV = {
	operation: ['importUsersCSV'],
	resource: ['user'],
};

export const userImportUsersCSVDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserImportCSV,
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
			show: showOnlyForUserImportCSV,
		},
		description: 'Name of the binary property containing the CSV file',
	},
	{
		displayName: 'Import Options',
		name: 'importOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForUserImportCSV,
		},
		options: [
			{
				displayName: 'Clean OU',
				name: 'clean_ou',
				type: 'boolean',
				default: false,
				description: 'Whether to remove empty org units',
			},
			{
				displayName: 'Keep Old Values',
				name: 'keep_old_values',
				type: 'boolean',
				default: true,
				description: 'Whether empty cells will not erase current values',
			},
			{
				displayName: 'Manager OU',
				name: 'manager_ou',
				type: 'boolean',
				default: false,
				description: 'Whether to create org unit tree based on management',
			},
			{
				displayName: 'New User Notification',
				name: 'new_user_notification',
				type: 'boolean',
				default: false,
				description: 'Whether to send welcome email to new users',
			},
			{
				displayName: 'Password Not Required',
				name: 'password_not_required',
				type: 'boolean',
				default: false,
				description: 'Whether to allow SSO-only users without password',
			},
			{
				displayName: 'Temp Password',
				name: 'temp_password',
				type: 'boolean',
				default: false,
				description: 'Whether password is single-use and must be changed on first login',
			},
			{
				displayName: 'Update Password',
				name: 'update_password',
				type: 'boolean',
				default: false,
				description: 'Whether to update password for existing users',
			},
		],
	},
];
