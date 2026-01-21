import type { JsonObject, INode } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export interface RequestDetails {
	endpoint: string;
	method: string;
	params?: Record<string, unknown>;
	body?: Record<string, unknown>;
	queryString?: Record<string, unknown>;
}

/**
 * Get user-friendly guidance for HTTP error codes
 */
function getHttpErrorGuidance(statusCode: number): string {
	const guidance: Record<number, string> = {
		400: '💡 Bad Request - Check the parameters sent',
		401: '💡 Unauthorized - Check API credentials',
		403: '💡 Forbidden - No permission for this operation, check permissions',
		404: '💡 Not Found - Resource not found, check ID or endpoint',
		409: '💡 Conflict - Data conflict, resource may already exist',
		422: '💡 Validation Error - Data failed server validation',
		429: '💡 Rate Limited - Exceeded request limit, wait and try again',
		500: '💡 Server Error - Server error, try again later',
		502: '💡 Bad Gateway - Communication issue with server',
		503: '💡 Service Unavailable - Service currently unavailable',
	};
	return guidance[statusCode] || '';
}

/**
 * Sanitize sensitive data from objects
 */
function sanitizeData(data: unknown): unknown {
	if (typeof data !== 'object' || data === null) {
		return data;
	}

	if (Array.isArray(data)) {
		return data.map(sanitizeData);
	}

	const sanitized: Record<string, unknown> = {};
	const sensitiveKeys = ['password', 'token', 'apiKey', 'api_key', 'secret', 'authorization', 'auth'];

	for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
		const lowerKey = key.toLowerCase();
		if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
			sanitized[key] = '***REDACTED***';
		} else if (typeof value === 'object' && value !== null) {
			sanitized[key] = sanitizeData(value);
		} else {
			sanitized[key] = value;
		}
	}

	return sanitized;
}

/**
 * Build detailed error description for debugging
 */
export function buildDetailedErrorDescription(
	error: {
		statusCode?: number;
		code?: number | string;
		message?: string;
		name?: string;
		constructor?: { name?: string };
		response?: { data?: unknown; headers?: Record<string, unknown>; statusCode?: number };
		body?: unknown;
	},
	requestDetails: RequestDetails,
): string {
	const details: string[] = [];

	// Request details
	details.push(`📍 Endpoint: ${requestDetails.endpoint}`);
	details.push(`📤 Method: ${requestDetails.method}`);

	if (requestDetails.queryString && Object.keys(requestDetails.queryString).length > 0) {
		details.push(
			`📋 Query String: ${JSON.stringify(sanitizeData(requestDetails.queryString), null, 2)}`,
		);
	}

	if (requestDetails.params && Object.keys(requestDetails.params).length > 0) {
		details.push(`📋 Params: ${JSON.stringify(sanitizeData(requestDetails.params), null, 2)}`);
	}

	if (requestDetails.body && Object.keys(requestDetails.body).length > 0) {
		details.push(`📦 Request Body: ${JSON.stringify(sanitizeData(requestDetails.body), null, 2)}`);
	}

	// Error details
	details.push(`\n❌ Error Details:`);
	const statusCode = error.statusCode || error.code || error.response?.statusCode || 'N/A';
	details.push(`   Status Code: ${statusCode}`);
	details.push(`   Error Type: ${error.name || error.constructor?.name || 'Unknown'}`);
	details.push(`   Message: ${error.message || 'No message provided'}`);

	// Server response if available
	if (error.response?.data) {
		details.push(`\n📥 Server Response:`);
		details.push(`   ${JSON.stringify(sanitizeData(error.response.data), null, 2)}`);
	} else if (error.body) {
		details.push(`\n📥 Server Response:`);
		details.push(`   ${JSON.stringify(sanitizeData(error.body), null, 2)}`);
	}

	// Headers if relevant for debugging
	if (error.response?.headers) {
		const relevantHeaders: Record<string, unknown> = {
			'x-request-id': error.response.headers['x-request-id'],
			'x-correlation-id': error.response.headers['x-correlation-id'],
			'retry-after': error.response.headers['retry-after'],
			'content-type': error.response.headers['content-type'],
		};
		const filtered = Object.fromEntries(
			Object.entries(relevantHeaders).filter(([, v]) => v),
		);
		if (Object.keys(filtered).length > 0) {
			details.push(`\n🔍 Debug Headers: ${JSON.stringify(filtered)}`);
		}
	}

	// HTTP error guidance
	if (typeof statusCode === 'number') {
		const guidance = getHttpErrorGuidance(statusCode);
		if (guidance) {
			details.push(`\n${guidance}`);
		}
	}

	// Timestamp for correlation
	details.push(`\n🕐 Timestamp: ${new Date().toISOString()}`);

	return details.join('\n');
}

/**
 * Create a NodeApiError with detailed description
 */
export function createBlossomApiError(
	operationName: string,
	error: {
		statusCode?: number;
		code?: number | string;
		message?: string;
		name?: string;
		response?: { data?: unknown; headers?: Record<string, unknown>; statusCode?: number };
		body?: unknown;
	},
	requestDetails: RequestDetails,
	node: INode,
): NodeApiError {
	const statusCode = error.statusCode || error.code || error.response?.statusCode;
	const errorMessage = error.message || 'Unknown error occurred';

	return new NodeApiError(node, error as JsonObject, {
		message: `${operationName} failed: ${errorMessage}`,
		description: buildDetailedErrorDescription(error, requestDetails),
		httpCode: statusCode?.toString(),
	});
}
