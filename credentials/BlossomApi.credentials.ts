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

	icon: Icon = 'file:../nodes/Blossom/blossom.svg';

	documentationUrl = 'https://docs.blossom-kc.com/api';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://your-instance.blossom-kc.com',
			description: 'Base URL of the Blossom API instance (e.g., https://your-instance.blossom-kc.com). Do not include /WebServices/sync_2 in the URL.',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'API username for Basic Authentication',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API password for Basic Authentication',
			required: true,
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
			baseURL: '={{$credentials.baseUrl.endsWith("/WebServices/sync_2") ? $credentials.baseUrl.slice(0, -20) : $credentials.baseUrl.endsWith("/WebServices/sync_2/") ? $credentials.baseUrl.slice(0, -21) : $credentials.baseUrl}}',
			url: '/WebServices/sync_2/Test',
			method: 'GET',
		},
	};
}
