import type {
	IHookFunctions,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function blossomApiRequest(
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
): Promise<unknown> {
	const credentials = await this.getCredentials('blossomApi');
	const baseUrl = credentials?.baseUrl as string;
	const authType = credentials?.authType as string;
	
	if (!baseUrl) {
		throw new Error('Base URL is required');
	}

	if (!authType) {
		throw new Error('Authentication type is required');
	}

	// Remove trailing slash from baseUrl and leading slash from endpoint
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: `${cleanBaseUrl}/${cleanEndpoint}`,
		json: !body || typeof body === 'object' && !body.sheet_file && !body.avatarfile && !body.diploma_file,
		timeout: 30000,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	// Debug logging
	console.log('Blossom API Request:', {
		method,
		url: `${cleanBaseUrl}/${cleanEndpoint}`,
		body: body ? JSON.stringify(body, null, 2) : 'No body',
		authType,
		json: options.json
	});

	// Add authentication based on type
	if (authType === 'basic') {
		const username = credentials?.username as string;
		const password = credentials?.password as string;
		if (username && password) {
			options.auth = {
				username,
				password,
			};
		} else {
			throw new Error('Username and password are required for Basic Authentication');
		}
	} else if (authType === 'apiKey') {
		const apiKey = credentials?.apiKey as string;
		if (apiKey) {
			options.headers = {
				...options.headers,
				'Authorization': `Bearer ${apiKey}`,
			};
		} else {
			throw new Error('API Key is required for API Key Authentication');
		}
	} else if (authType === 'jwt') {
		const jwtToken = credentials?.jwtToken as string;
		if (jwtToken) {
			options.headers = {
				...options.headers,
				'Authorization': `Bearer ${jwtToken}`,
			};
		} else {
			throw new Error('JWT Token is required for JWT Authentication');
		}
	} else if (authType === 'oauth2') {
		const oauth2Token = credentials?.oauth2Token as string;
		if (oauth2Token) {
			options.headers = {
				...options.headers,
				'Authorization': `Bearer ${oauth2Token}`,
			};
		} else {
			throw new Error('OAuth 2.0 Token is required for OAuth 2.0 Authentication');
		}
	} else {
		throw new Error('Authentication type is required');
	}

	return this.helpers.httpRequest(options).catch((error) => {
		// Provide more helpful error messages
		if (error.response?.status === 401) {
			throw new Error(`Authentication failed (401). Please check your credentials:
- Base URL: ${cleanBaseUrl}
- Auth Type: ${authType}
- Domain: ${credentials?.domain || 'Not set'}
- Username: ${authType === 'basic' ? (credentials?.username ? 'Set' : 'Missing') : 'N/A'}
- Password: ${authType === 'basic' ? (credentials?.password ? 'Set' : 'Missing') : 'N/A'}
- API Key: ${authType === 'apiKey' ? (credentials?.apiKey ? 'Set' : 'Missing') : 'N/A'}
- JWT Token: ${authType === 'jwt' ? (credentials?.jwtToken ? 'Set' : 'Missing') : 'N/A'}
- OAuth2 Token: ${authType === 'oauth2' ? (credentials?.oauth2Token ? 'Set' : 'Missing') : 'N/A'}

Common issues:
1. Wrong username/password (use API credentials, not login credentials)
2. Wrong domain (check with your Blossom admin)
3. Wrong Base URL (should end with /WebServices/sync_2)
4. Server not accessible from your network`);
		} else if (error.response?.status === 404) {
			throw new Error(`Endpoint not found (404). Please check:
- Base URL: ${cleanBaseUrl}
- Endpoint: ${cleanEndpoint}
- Domain: ${credentials?.domain || 'Not set'}
- Make sure the Blossom instance URL is correct
- Verify the endpoint path is correct`);
		} else if (error.response?.status >= 500) {
			throw new Error(`Server error (${error.response.status}). The Blossom server is experiencing issues.
- Base URL: ${cleanBaseUrl}
- Try again later or contact your Blossom administrator`);
		} else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
			throw new Error(`Connection failed. Please check:
- Base URL: ${cleanBaseUrl}
- Network connectivity
- Firewall settings
- Proxy configuration
- Server availability`);
		} else {
			throw new Error(`Request failed: ${error.message}
- Base URL: ${cleanBaseUrl}
- Endpoint: ${cleanEndpoint}
- Auth Type: ${authType}`);
		}
	});
}

export function getBaseUrl(credentials: unknown): string {
	const baseUrl = (credentials as { baseUrl?: string })?.baseUrl;
	if (!baseUrl) {
		throw new Error('Base URL is required');
	}
	return baseUrl.replace(/\/$/, '');
}

export function getDomain(credentials: unknown): string {
	const domain = (credentials as { domain?: string })?.domain;
	if (!domain) {
		throw new Error('Domain is required');
	}
	return domain;
}
