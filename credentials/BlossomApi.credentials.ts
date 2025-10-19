import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class BlossomApi implements ICredentialType {
	name = 'blossomApi';

	displayName = 'Blossom API';

	icon: Icon = { light: 'file:../icons/blossom.svg', dark: 'file:../icons/blossom.dark.svg' };

	documentationUrl = 'https://mer-group.blossom-kc.com/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://mer-group.blossom-kc.com/',
			required: true,
			description: 'The base URL of your Blossom instance (e.g., https://mer-group.blossom-kc.com/)',
		},
		{
			displayName: 'Authentication Type',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'Basic Auth',
					value: 'basic',
					description: 'Use username and password for Basic Authentication',
				},
				{
					name: 'API Key',
					value: 'apiKey',
					description: 'Use API key for authentication',
				},
			],
			default: 'basic',
			description: 'The authentication method to use',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					authType: ['basic'],
				},
			},
			description: 'Username for Basic Authentication',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authType: ['basic'],
				},
			},
			description: 'Password for Basic Authentication',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authType: ['apiKey'],
				},
			},
			description: 'Your API key for authentication',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/WebServices/sync_2',
			method: 'GET',
		},
	};
}
