import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class BlossomApi implements ICredentialType {
	name = 'blossomSyncApi';

	displayName = 'Blossom Sync API';

	icon: Icon = { light: 'file:../icons/blossom.svg', dark: 'file:../icons/blossom.dark.svg' };

	documentationUrl = 'https://blossom-kc.com/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://blossom-kc.com/WebServices/sync_2',
			placeholder: 'https://blossom-kc.com/WebServices/sync_2',
			required: true,
			description: 'The full API URL of your Blossom instance',
		},
		{
			displayName: 'Auth Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{ name: 'Basic', value: 'basic' },
				{ name: 'JWT (Server must enable)', value: 'jwt' },
				{ name: 'OAuth2 (Server must enable)', value: 'oauth2' },
			],
			default: 'basic',
			description: 'JWT/OAuth2 are disabled by default on server side.',
		},
		// Basic
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			typeOptions: { alwaysOpenEditWindow: true },
			displayOptions: { show: { authMethod: ['basic'] } },
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: { show: { authMethod: ['basic'] } },
			required: true,
		},
		// JWT (optional)
		{
			displayName: 'JWT Issuer (iss)',
			name: 'jwtIss',
			type: 'string',
			default: '',
			displayOptions: { show: { authMethod: ['jwt'] } },
		},
		{
			displayName: 'JWT Secret (server password)',
			name: 'jwtSecret',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			displayOptions: { show: { authMethod: ['jwt'] } },
		},
		// OAuth2 (optional, token-only endpoint)
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			displayOptions: { show: { authMethod: ['oauth2'] } },
			description: 'Acquire token via ?auth_token when server enables OAuth2',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/Test',
			method: 'POST',
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};
}
