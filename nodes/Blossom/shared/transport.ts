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
 * Normalize base URL by removing /WebServices/sync_2 if present
 * This allows users to enter either:
 * - https://your-instance.blossom-kc.com (preferred)
 * - https://your-instance.blossom-kc.com/WebServices/sync_2 (also works)
 */
export function normalizeBaseUrl(baseUrl: string): string {
	return baseUrl.replace(/\/WebServices\/sync_2\/?$/, '');
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
	const baseUrl = normalizeBaseUrl(rawBaseUrl);

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
