import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserUpdate = {
	operation: ['update'],
	resource: ['user'],
};

export const userUpdateDescription: INodeProperties[] = [
	{
		displayName: 'External ID',
		name: 'external_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUserUpdate,
		},
		description: 'External ID of the user (usually from foreign system)',
		routing: {
			send: {
				type: 'body',
				property: 'details.external_id',
			},
		},
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserUpdate,
		},
		description: 'Domain ID',
		routing: {
			send: {
				type: 'body',
				property: 'domain',
			},
		},
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForUserUpdate,
		},

		routing: {
			send: {
				type: 'body',
				property: 'details.username',
			},
		},
	},
	{
		displayName: 'First Name',
		name: 'firstname',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForUserUpdate,
		},

		routing: {
			send: {
				type: 'body',
				property: 'details.firstname',
			},
		},
	},
	{
		displayName: 'Last Name',
		name: 'lastname',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForUserUpdate,
		},

		routing: {
			send: {
				type: 'body',
				property: 'details.lastname',
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: {
			show: showOnlyForUserUpdate,
		},
		description: 'Email address',
		routing: {
			send: {
				type: 'body',
				property: 'details.email',
			},
		},
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: showOnlyForUserUpdate,
		},
		description: 'User password',
		routing: {
			send: {
				type: 'body',
				property: 'details.password',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForUserUpdate,
		},
		options: [
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.birthday',
					},
				},
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.company',
					},
				},
			},
			{
				displayName: 'Custom Field 1',
				name: 'field_1',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.field_1',
					},
				},
			},
			{
				displayName: 'Custom Field 2',
				name: 'field_2',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.field_2',
					},
				},
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.department',
					},
				},
			},
			{
				displayName: 'Disabled',
				name: 'disabled',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'details.disabled',
					},
				},
			},
			{
				displayName: 'Employee ID',
				name: 'employee_id',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.employee_id',
					},
				},
			},
			{
				displayName: 'Job Title',
				name: 'job_title',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'details.job_title',
					},
				},
			},
		],
	},
];
