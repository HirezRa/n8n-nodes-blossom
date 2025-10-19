import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroups = {
	resource: ['groups'],
};

export const groupsDescription: INodeProperties[] = [
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
				description: 'Attach Group/Course to a Template',
				action: 'Attach instance',
			},
			{
				name: 'Attach Sub Group',
				value: 'attachSubGroup',
				description: 'Attach sub group to a parent group',
				action: 'Attach sub group',
			},
			{
				name: 'Delete Group',
				value: 'deleteGroup',
				description: 'Delete a group object',
				action: 'Delete a group',
			},
			{
				name: 'Detach Instance',
				value: 'detachInstance',
				description: 'Detach Group/Course from its only Template',
				action: 'Detach instance',
			},
			{
				name: 'Detach Sub Group',
				value: 'detachSubGroup',
				description: 'Detach a sub group from its only parent',
				action: 'Detach sub group',
			},
			{
				name: 'Import Groups CSV',
				value: 'importGroupsCSV',
				description: 'Import multiple workspaces using CSV/Excel',
				action: 'Import groups from CSV',
			},
			{
				name: 'Update Group',
				value: 'updateGroup',
				description: 'Create or update group object (Group/Course/Role/Ou/Template/Qualification/Workplan)',
				action: 'Update a group',
			},
		],
		default: 'updateGroup',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['updateGroup', 'deleteGroup', 'attachSubGroup', 'detachSubGroup', 'attachInstance', 'detachInstance'],
			},
		},
		description: 'Domain name or ID',
	},
	{
		displayName: 'Group Details',
		name: 'groupDetails',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['updateGroup'],
			},
		},
		options: [
			{
				name: 'details',
				displayName: 'Details',
				values: [
					{
						displayName: 'Audience',
						name: 'audience',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Classification',
						name: 'classification',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Close Date',
						name: 'close_date',
						type: 'dateTime',
						default: '',
						description: 'Close date (yyyy-mm-dd format)',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Group description',
					},
					{
						displayName: 'Estimated Budget',
						name: 'estimated_budget',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'External ID from foreign system',
					},
					{
						displayName: 'Gathering Area',
						name: 'gathering_area',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Group name',
					},
					{
						displayName: 'Open Date',
						name: 'open_date',
						type: 'dateTime',
						default: '',
						description: 'Open date (yyyy-mm-dd format)',
					},
					{
						displayName: 'Parent External ID',
						name: 'parent_external_id',
						type: 'string',
						default: '',
						description: 'Parent group external ID',
					},
					{
						displayName: 'Passing Grade',
						name: 'passing_grade',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Template External ID',
						name: 'template_external_id',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Course',
								value: 'course',
							},
							{
								name: 'Group',
								value: 'group',
							},
							{
								name: 'OU',
								value: 'ou',
							},
							{
								name: 'Qualification',
								value: 'qualification',
							},
							{
								name: 'Role',
								value: 'role',
							},
							{
								name: 'Template',
								value: 'template',
							},
							{
								name: 'Workplan',
								value: 'workplan',
							},
						],
						default: 'group',
						description: 'Group type',
					},
			],
			},
		],

	},
	{
		displayName: 'Group Identifier',
		name: 'groupIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['deleteGroup', 'detachSubGroup', 'detachInstance'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'External ID',
						name: 'group_external_id',
						type: 'string',
						default: '',
						description: 'Group external ID',
					},
					{
						displayName: 'Group ID',
						name: 'group_id',
						type: 'string',
						default: '',

					},
				],
			},
		],

	},
	{
		displayName: 'Sub Group Identifier',
		name: 'subGroupIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['attachSubGroup'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'External ID',
						name: 'group_external_id',
						type: 'string',
						default: '',
						description: 'Sub group external ID',
					},
					{
						displayName: 'Group ID',
						name: 'group_id',
						type: 'string',
						default: '',
						description: 'Sub group ID',
					},
				],
			},
		],

	},
	{
		displayName: 'Parent Group Identifier',
		name: 'parentGroupIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['attachSubGroup'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'External ID',
						name: 'group_external_id',
						type: 'string',
						default: '',
						description: 'Parent group external ID',
					},
					{
						displayName: 'Group ID',
						name: 'group_id',
						type: 'string',
						default: '',
						description: 'Parent group ID',
					},
				],
			},
		],

	},
	{
		displayName: 'Template Identifier',
		name: 'templateIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['attachInstance'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'External ID',
						name: 'group_external_id',
						type: 'string',
						default: '',
						description: 'Template external ID',
					},
					{
						displayName: 'Group ID',
						name: 'group_id',
						type: 'string',
						default: '',
						description: 'Template group ID',
					},
				],
			},
		],

	},
	{
		displayName: 'CSV File',
		name: 'csvFile',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['importGroupsCSV'],
			},
		},
		description: 'CSV file content or file path',
	},
	{
		displayName: 'Import Options',
		name: 'importOptions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForGroups,
				operation: ['importGroupsCSV'],
			},
		},
		options: [
			{
				name: 'options',
				displayName: 'Options',
				values: [
					{
						displayName: 'Keep Old Values',
						name: 'keep_old_values',
						type: 'boolean',
						default: false,
						description: 'Whether empty cells in import file won\'t erase current profile field values',
					},
					{
						displayName: 'Manager Type',
						name: 'manager_type',
						type: 'string',
						default: '',
						description: 'Manager permissions name OR \'all\'/\'none\'',
					},
					{
						displayName: 'Override Existing Permissions',
						name: 'override_existing_permissions',
						type: 'boolean',
						default: false,
						description: 'Whether to override existing managers permissions',
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
						description: 'Whether to set as primary manager',
					},
				],
			},
		],

	},
];
