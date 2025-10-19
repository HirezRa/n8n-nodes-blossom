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
	};

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
- Make sure your username/password or API key is correct
- Verify the Base URL is correct and accessible`);
		} else if (error.response?.status === 404) {
			throw new Error(`Endpoint not found (404). Please check:
- Base URL: ${cleanBaseUrl}
- Endpoint: ${cleanEndpoint}
- Make sure the Blossom instance URL is correct`);
		} else if (error.response?.status >= 500) {
			throw new Error(`Server error (${error.response.status}). The Blossom server is experiencing issues.`);
		} else {
			throw new Error(`Request failed: ${error.message}`);
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
