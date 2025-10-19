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
		}
	} else if (authType === 'apiKey') {
		const apiKey = credentials?.apiKey as string;
		if (apiKey) {
			options.headers = {
				...options.headers,
				'Authorization': `Bearer ${apiKey}`,
			};
		}
	} else if (authType === 'jwt') {
		const jwtToken = credentials?.jwtToken as string;
		if (jwtToken) {
			options.headers = {
				...options.headers,
				'Authorization': `Bearer ${jwtToken}`,
			};
		}
	} else if (authType === 'oauth2') {
		const oauth2Token = credentials?.oauth2Token as string;
		if (oauth2Token) {
			options.headers = {
				...options.headers,
				'Authorization': `Bearer ${oauth2Token}`,
			};
		}
	}

	return this.helpers.httpRequest(options);
}

export function getBaseUrl(credentials: unknown): string {
	const baseUrl = (credentials as { baseUrl?: string })?.baseUrl;
	if (!baseUrl) {
		throw new Error('Base URL is required');
	}
	return baseUrl.replace(/\/$/, '');
}
