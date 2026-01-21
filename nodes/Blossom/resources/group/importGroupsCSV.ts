import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroupImportCSV = {
	operation: ['importGroupsCSV'],
	resource: ['group'],
};

export const groupImportGroupsCSVDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForGroupImportCSV,
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
			show: showOnlyForGroupImportCSV,
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
			show: showOnlyForGroupImportCSV,
		},
		options: [
			{
				displayName: 'Keep Old Values',
				name: 'keep_old_values',
				type: 'boolean',
				default: true,
				description: 'Whether empty cells will not erase current values',
			},
			{
				displayName: 'Manager Type',
				name: 'manager_type',
				type: 'string',
				default: 'all',
				description: 'Type of manager to set (e.g., "all", "hr", "professional")',
			},
			{
				displayName: 'Override Existing Permissions',
				name: 'override_existing_permissions',
				type: 'boolean',
				default: false,
				description: 'Whether to override existing permissions',
			},
			{
				displayName: 'Remove Existing Managers',
				name: 'remove_existing_managers',
				type: 'boolean',
				default: false,
				description: 'Whether to remove existing managers',
			},
			{
				displayName: 'Set Primary Manager',
				name: 'set_primary_manager',
				type: 'boolean',
				default: false,
				description: 'Whether to set primary manager',
			},
		],
	},
];
