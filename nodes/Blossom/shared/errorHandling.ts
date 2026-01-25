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
function getHttpErrorGuidance(statusCode: number, endpoint?: string): string {
	const guidance: Record<number, string> = {
		400: '💡 Bad Request - Check the parameters sent to the API',
		401: '💡 Unauthorized - Verify your API credentials (username and password) are correct',
		403: '💡 Forbidden - Your API user may not have permission for this operation',
		404: '💡 Not Found - The endpoint or resource was not found. Check the Base URL and endpoint path',
		409: '💡 Conflict - Data conflict detected, the resource may already exist',
		422: '💡 Validation Error - The data sent failed server-side validation. Check required fields',
		429: '💡 Rate Limited - You have exceeded the API rate limit (30 requests/second). Please wait and try again',
		500: '💡 Server Error - The Blossom API server encountered an error. This may indicate an invalid endpoint or server issue',
		502: '💡 Bad Gateway - Communication issue with the Blossom server. Check your network connection',
		503: '💡 Service Unavailable - The Blossom service is currently unavailable. Try again later',
	};
	
	let message = guidance[statusCode] || '';
	
	// Add specific guidance for Test operation
	if (endpoint && endpoint.includes('/Test')) {
		if (statusCode === 500) {
			message += '\n   📌 For Test operation:';
			message += '\n      - Ensure Base URL is correct (e.g., https://your-instance.blossom-kc.com)';
			message += '\n      - Do NOT include /WebServices/sync_2 in the Base URL field';
			message += '\n      - The endpoint /WebServices/sync_2/Test will be added automatically';
			message += '\n      - If you see "WebServices function missing", check for duplicate paths in the URL';
		} else if (statusCode === 401) {
			message += '\n   📌 For Test operation:';
			message += '\n      - Verify your username and password in the credentials';
			message += '\n      - Check that the API user has proper permissions';
			message += '\n      - Ensure credentials are saved correctly';
		} else if (statusCode === 404) {
			message += '\n   📌 For Test operation:';
			message += '\n      - Check that your Base URL points to the correct Blossom instance';
			message += '\n      - Verify the instance is accessible (try in browser)';
			message += '\n      - Ensure Base URL format is: https://your-instance.blossom-kc.com';
		} else if (statusCode === 403) {
			message += '\n   📌 For Test operation:';
			message += '\n      - Your API user may not have permission to use the Test endpoint';
			message += '\n      - Contact your Blossom administrator to verify API user permissions';
		}
	}
	
	return message;
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
	details.push(`📍 Full URL: ${requestDetails.endpoint}`);
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
		const responseData = error.response.data as Record<string, unknown>;
		
		// Handle Blossom API error format
		if (responseData.res === 'error') {
			details.push(`   Error Code: ${responseData.error_code || 'N/A'}`);
			details.push(`   Error Message: ${responseData.error_msg || responseData.error || 'No error message'}`);
			
			// Add specific guidance for Blossom API errors
			if (responseData.error_msg) {
				const errorMsg = String(responseData.error_msg).toLowerCase();
				if (errorMsg.includes('function missing') || errorMsg.includes('webservices function missing')) {
					details.push(`\n   🔧 This usually means:`);
					details.push(`      - The endpoint path is incorrect or duplicated`);
					details.push(`      - Check that Base URL is correct (should NOT include /WebServices/sync_2)`);
					details.push(`      - Current Base URL might be: ${requestDetails.endpoint.split('/WebServices')[0]}`);
					details.push(`      - Expected format: https://your-instance.blossom-kc.com`);
					details.push(`      - Verify the operation name matches the API documentation`);
					
					// Check if URL has duplicate path
					if (requestDetails.endpoint.includes('/WebServices/sync_2/WebServices/sync_2')) {
						details.push(`\n   ⚠️  DETECTED: Duplicate /WebServices/sync_2 in URL`);
						details.push(`      This indicates Base URL includes /WebServices/sync_2 when it shouldn't`);
						details.push(`      Solution: Remove /WebServices/sync_2 from Base URL field`);
					}
				} else if (errorMsg.includes('domain') || errorMsg.includes('invalid domain')) {
					details.push(`\n   🔧 This usually means:`);
					details.push(`      - The domain parameter is invalid or missing`);
					details.push(`      - Check that the domain ID exists in your Blossom instance`);
				} else if (errorMsg.includes('unauthorized') || errorMsg.includes('authentication')) {
					details.push(`\n   🔧 This usually means:`);
					details.push(`      - Invalid username or password`);
					details.push(`      - The API user may not have permission for this operation`);
					details.push(`      - Verify credentials in the Blossom account settings`);
				}
			}
		} else {
			details.push(`   ${JSON.stringify(sanitizeData(error.response.data), null, 2)}`);
		}
	} else if (error.body) {
		details.push(`\n📥 Server Response:`);
		const bodyData = error.body as Record<string, unknown>;
		
		// Handle Blossom API error format
		if (bodyData && typeof bodyData === 'object' && 'res' in bodyData && bodyData.res === 'error') {
			details.push(`   Error Code: ${bodyData.error_code || 'N/A'}`);
			details.push(`   Error Message: ${bodyData.error_msg || bodyData.error || 'No error message'}`);
			
			// Add specific guidance for Blossom API errors
			if (bodyData.error_msg) {
				const errorMsg = String(bodyData.error_msg).toLowerCase();
				if (errorMsg.includes('function missing') || errorMsg.includes('webservices function missing')) {
					details.push(`\n   🔧 This usually means:`);
					details.push(`      - The endpoint path is incorrect or duplicated`);
					details.push(`      - Check that Base URL is correct (should NOT include /WebServices/sync_2)`);
					details.push(`      - Current Base URL might be: ${requestDetails.endpoint.split('/WebServices')[0]}`);
					details.push(`      - Expected format: https://your-instance.blossom-kc.com`);
					details.push(`      - Verify the operation name matches the API documentation`);
					
					// Check if URL has duplicate path
					if (requestDetails.endpoint.includes('/WebServices/sync_2/WebServices/sync_2')) {
						details.push(`\n   ⚠️  DETECTED: Duplicate /WebServices/sync_2 in URL`);
						details.push(`      This indicates Base URL includes /WebServices/sync_2 when it shouldn't`);
						details.push(`      Solution: Remove /WebServices/sync_2 from Base URL field`);
					}
				} else if (errorMsg.includes('domain') || errorMsg.includes('invalid domain')) {
					details.push(`\n   🔧 This usually means:`);
					details.push(`      - The domain parameter is invalid or missing`);
					details.push(`      - Check that the domain ID exists in your Blossom instance`);
				} else if (errorMsg.includes('unauthorized') || errorMsg.includes('authentication')) {
					details.push(`\n   🔧 This usually means:`);
					details.push(`      - Invalid username or password`);
					details.push(`      - The API user may not have permission for this operation`);
					details.push(`      - Verify credentials in the Blossom account settings`);
				}
			}
		} else {
			// Handle string responses (like "(Basic) Authentication failed")
			const bodyStr = typeof error.body === 'string' ? error.body : JSON.stringify(error.body);
			if (bodyStr.toLowerCase().includes('authentication') || bodyStr.toLowerCase().includes('unauthorized')) {
				details.push(`   ${bodyStr}`);
				details.push(`\n   🔧 Authentication Error:`);
				details.push(`      - Invalid username or password`);
				details.push(`      - Verify your credentials in the Blossom account settings`);
				details.push(`      - Check that the API user has proper permissions`);
			} else {
				details.push(`   ${JSON.stringify(sanitizeData(error.body), null, 2)}`);
			}
		}
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
		const guidance = getHttpErrorGuidance(statusCode, requestDetails.endpoint);
		if (guidance) {
			details.push(`\n${guidance}`);
		}
	}
	
	// Additional troubleshooting for connection issues
	if (error.message) {
		const errorMsg = String(error.message);
		
		if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo')) {
			details.push(`\n🔧 Troubleshooting - DNS/Connection Error:`);
			details.push(`   - Verify the Base URL is correct and accessible`);
			details.push(`   - Check your network connection`);
			details.push(`   - Ensure the Blossom instance is running`);
			details.push(`   - Base URL format: https://your-instance.blossom-kc.com (without /WebServices/sync_2)`);
			details.push(`   - Try accessing the URL in a browser to verify it's reachable`);
		} else if (errorMsg.includes('ECONNREFUSED')) {
			details.push(`\n🔧 Troubleshooting - Connection Refused:`);
			details.push(`   - The server is not accepting connections`);
			details.push(`   - Check if the Blossom instance is running`);
			details.push(`   - Verify the Base URL port (should be 443 for HTTPS, 80 for HTTP)`);
			details.push(`   - Check firewall settings`);
		} else if (errorMsg.includes('ETIMEDOUT') || errorMsg.includes('timeout')) {
			details.push(`\n🔧 Troubleshooting - Timeout Error:`);
			details.push(`   - The server took too long to respond`);
			details.push(`   - Check your network connection`);
			details.push(`   - The server may be overloaded, try again later`);
			details.push(`   - Verify the Base URL is correct`);
		} else if (errorMsg.includes('CERT') || errorMsg.includes('SSL') || errorMsg.includes('TLS')) {
			details.push(`\n🔧 Troubleshooting - SSL/TLS Error:`);
			details.push(`   - SSL certificate validation failed`);
			details.push(`   - Verify the Base URL uses the correct protocol (https://)`);
			details.push(`   - Check if the SSL certificate is valid`);
			details.push(`   - Contact your Blossom administrator if certificate issues persist`);
		} else if (errorMsg.includes('Invalid URL') || errorMsg.includes('URL format')) {
			details.push(`\n🔧 Troubleshooting - Invalid URL Format:`);
			details.push(`   - Base URL must start with http:// or https://`);
			details.push(`   - Correct format: https://your-instance.blossom-kc.com`);
			details.push(`   - Do NOT include /WebServices/sync_2 in the Base URL field`);
			details.push(`   - Example: https://YOUR-COMPANY.blossom-kc.com`);
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
