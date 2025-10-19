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
		json: true,
		timeout: 30000,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'blossomApi', options);
}

export function getBaseUrl(credentials: unknown): string {
	const baseUrl = (credentials as { baseUrl?: string })?.baseUrl;
	if (!baseUrl) {
		throw new Error('Base URL is required');
	}
	return baseUrl.replace(/\/$/, '');
}
