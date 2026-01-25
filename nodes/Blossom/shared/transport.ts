import type {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { createBlossomApiError, type RequestDetails } from './errorHandling';

type BlossomFunctions =
	| IExecuteFunctions
	| IExecuteSingleFunctions
	| ILoadOptionsFunctions
	| IHookFunctions;

/**
 * Validate base URL format
 */
function validateBaseUrl(baseUrl: string): void {
	if (!baseUrl || typeof baseUrl !== 'string') {
		throw new Error('Base URL is required and must be a string');
	}
	
	// Check if it's a valid URL format
	if (!baseUrl.match(/^https?:\/\/.+/)) {
		throw new Error(
			`Invalid Base URL format: "${baseUrl}". ` +
			'Base URL must start with http:// or https:// (e.g., https://your-instance.blossom-kc.com)'
		);
	}
}

/**
 * Normalize base URL by removing /WebServices/sync_2 if present
 * This allows users to enter either:
 * - https://your-instance.blossom-kc.com (preferred)
 * - https://your-instance.blossom-kc.com/WebServices/sync_2 (also works)
 */
export function normalizeBaseUrl(baseUrl: string): string {
	validateBaseUrl(baseUrl);
	return baseUrl.replace(/\/WebServices\/sync_2\/?$/, '').replace(/\/$/, '');
}

export async function blossomApiRequest(
	this: BlossomFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | undefined = undefined,
	qs: IDataObject = {},
	options: Partial<IHttpRequestOptions> = {},
	operationName: string = 'API Request',
): Promise<IDataObject> {
	const credentials = await this.getCredentials('blossomApi');
	const rawBaseUrl = (credentials.baseUrl as string) || 'https://your-instance.blossom-kc.com';
	
	let baseUrl: string;
	try {
		baseUrl = normalizeBaseUrl(rawBaseUrl);
	} catch (error) {
		// Provide better error message for Base URL validation
		const requestDetails: RequestDetails = {
			endpoint: `${rawBaseUrl}${endpoint}`,
			method,
			body: body as Record<string, unknown>,
			queryString: qs as Record<string, unknown>,
		};
		throw createBlossomApiError(
			operationName,
			{
				message: error instanceof Error ? error.message : 'Invalid Base URL',
				name: 'ValidationError',
			},
			requestDetails,
			this.getNode(),
		);
	}

	const fullUrl = `${baseUrl}${endpoint}`;

	const requestDetails: RequestDetails = {
		endpoint: fullUrl,
		method,
		body: body as Record<string, unknown>,
		queryString: qs as Record<string, unknown>,
	};

	const requestOptions: IHttpRequestOptions = {
		method,
		url: fullUrl,
		json: true,
		...options,
	};

	if (Object.keys(qs).length > 0) {
		requestOptions.qs = qs;
	}

	if (body) {
		requestOptions.body = body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'blossomApi', requestOptions);
	} catch (error) {
		throw createBlossomApiError(operationName, error, requestDetails, this.getNode());
	}
}
