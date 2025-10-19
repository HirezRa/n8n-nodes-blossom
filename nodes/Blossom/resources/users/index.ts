import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUsers = {
	resource: ['users'],
};

export const usersDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Delete User',
				value: 'deleteUser',
				action: 'Delete a user',
			},
			{
				name: 'Delete Users CSV',
				value: 'deleteUsersCSV',
				description: 'Delete multiple users using CSV/Excel',
				action: 'Delete users from CSV',
			},
			{
				name: 'Import Users CSV',
				value: 'importUsersCSV',
				description: 'Import multiple users using CSV/Excel',
				action: 'Import users from CSV',
			},
			{
				name: 'Set Avatar',
				value: 'setAvatar',
				description: 'Update or remove user avatar',
				action: 'Set user avatar',
			},
			{
				name: 'Update User',
				value: 'updateUser',
				description: 'Create or update user',
				action: 'Update a user',
			},
		],
		default: 'updateUser',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForUsers,
				operation: ['updateUser', 'deleteUser', 'setAvatar'],
			},
		},
		description: 'Domain name or ID',
	},
	{
		displayName: 'User Details',
		name: 'userDetails',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForUsers,
				operation: ['updateUser'],
			},
		},
		options: [
			{
				name: 'details',
				displayName: 'Details',
				values: [
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Birthday',
						name: 'birthday',
						type: 'dateTime',
						default: '',
						description: 'Birthday (yyyy-mm-dd format)',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Department',
						name: 'department',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Disabled',
						name: 'disabled',
						type: 'boolean',
						default: false,
						description: 'Whether user is disabled',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Email address',
					},
					{
						displayName: 'Employee ID',
						name: 'employee_id',
						type: 'string',
						default: '',
					},
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'External ID from foreign system',
					},
					{
						displayName: 'First Name',
						name: 'firstname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Job Title',
						name: 'job_title',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'lastname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: { password: true },
						default: '',
					},
					{
						displayName: 'Phone (Business)',
						name: 'bphone',
						type: 'string',
						default: '',
						description: 'Business phone',
					},
					{
						displayName: 'Phone (Home)',
						name: 'hphone',
						type: 'string',
						default: '',
						description: 'Home phone',
					},
					{
						displayName: 'Phone (Mobile)',
						name: 'mphone',
						type: 'string',
						default: '',
						description: 'Mobile phone',
					},
					{
						displayName: 'Username',
						name: 'username',
						type: 'string',
						default: '',
					},
					{
						displayName: 'ZIP Code',
						name: 'zip',
						type: 'string',
						default: '',
					},
				],
			},
		],

	},
	{
		displayName: 'User Identifier',
		name: 'userIdentifier',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForUsers,
				operation: ['deleteUser', 'setAvatar'],
			},
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Identifier',
				values: [
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',

					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'string',
						default: '',

					},
					{
						displayName: 'Username',
						name: 'user_name',
						type: 'string',
						default: '',

					},
					{
						displayName: 'Identity Number',
						name: 'identity_num',
						type: 'string',
						default: '',

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
				...showOnlyForUsers,
				operation: ['importUsersCSV', 'deleteUsersCSV'],
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
				...showOnlyForUsers,
				operation: ['importUsersCSV'],
			},
		},
		options: [
			{
				name: 'options',
				displayName: 'Options',
				values: [
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
						default: false,
						description: 'Whether empty cells in import file won\'t erase current profile field values',
					},
					{
						displayName: 'Manager OU',
						name: 'manager_ou',
						type: 'boolean',
						default: false,
						description: 'Whether to create org unit tree based on management relation',
					},
					{
						displayName: 'New User Notification',
						name: 'new_user_notification',
						type: 'boolean',
						default: false,
						description: 'Whether to send users details by mail (requires valid email)',
					},
					{
						displayName: 'Password Not Required',
						name: 'password_not_required',
						type: 'boolean',
						default: false,
						description: 'Whether to not require password for new users (SSO only)',
					},
					{
						displayName: 'Temp Password',
						name: 'temp_password',
						type: 'boolean',
						default: false,
						description: 'Whether to set temporary password for new users',
					},
				],
			},
		],

	},
	{
		displayName: 'Avatar File',
		name: 'avatarFile',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForUsers,
				operation: ['setAvatar'],
			},
		},
		description: 'Avatar file content or file path (JPG/PNG)',
	},
	{
		displayName: 'Remove Avatar',
		name: 'removeAvatar',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForUsers,
				operation: ['setAvatar'],
			},
		},
		description: 'Whether to remove current avatar',
	},
];
