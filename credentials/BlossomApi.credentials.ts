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

	documentationUrl = 'https://blossom-kc.com/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://YOUR-COMPANY.blossom-kc.com/',
			required: true,
			description: 'The base URL of your Blossom instance. Replace YOUR-COMPANY with your organization\'s subdomain (e.g., https://mer-group.blossom-kc.com/)',
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
				{
					name: 'JWT',
					value: 'jwt',
					description: 'Use JWT token for authentication',
				},
				{
					name: 'OAuth 2.0',
					value: 'oauth2',
					description: 'Use OAuth 2.0 for authentication',
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
			description: 'Your API user credentials (not your login credentials)',
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
			description: 'Your API user password (not your login password)',
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
		{
			displayName: 'JWT Token',
			name: 'jwtToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authType: ['jwt'],
				},
			},
			description: 'JWT token for authentication. Generate using: {"iss":"<user_name>","exp":<unix_timestamp>}',
		},
		{
			displayName: 'OAuth 2.0 Token',
			name: 'oauth2Token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authType: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 access token. Get from: {{baseUrl}}/WebServices/sync_2?auth_token',
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
			url: '/WebServices/sync_2/Test',
			method: 'GET',
		},
	};
}
