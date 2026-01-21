import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createBlossomApiError, type RequestDetails } from './errorHandling';
import { normalizeBaseUrl } from './transport';

/**
 * Extract binary file from item
 */
export async function extractBinaryFile(
	this: IExecuteFunctions,
	itemIndex: number,
	propertyName: string,
	defaultFileName: string,
	defaultMimeType: string,
): Promise<{ fileBuffer: Buffer; fileName: string; mimeType: string }> {
	try {
		const binaryData = this.helpers.assertBinaryData(itemIndex, propertyName);
		const fileBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, propertyName);
		const fileName = binaryData.fileName || defaultFileName;
		let mimeType = binaryData.mimeType || defaultMimeType;

		// Ensure UTF-8 charset for CSV files
		if (mimeType === 'text/csv' && !mimeType.includes('charset')) {
			mimeType = 'text/csv; charset=utf-8';
		}

		if (fileBuffer.length === 0) {
			throw new NodeOperationError(this.getNode(), 'File is empty', {
				description: `The binary property "${propertyName}" contains an empty file. Please ensure the file has content.`,
			});
		}

		return { fileBuffer, fileName, mimeType };
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}
		throw new NodeOperationError(this.getNode(), `Failed to extract binary file: ${(error as Error).message}`, {
			description: `Error reading binary property "${propertyName}". Make sure the property exists and contains valid file data.`,
		});
	}
}

/**
 * Upload file to Blossom API using form-data
 */
export async function blossomFileUpload(
	this: IExecuteFunctions,
	endpoint: string,
	fileBuffer: Buffer | Uint8Array,
	fileName: string,
	mimeType: string,
	fieldName: string = 'sheet_file',
	operationName: string = 'File Upload',
): Promise<IDataObject> {
	const credentials = await this.getCredentials('blossomApi');
	const rawBaseUrl = (credentials.baseUrl as string) || 'https://your-instance.blossom-kc.com';
	const baseUrl = normalizeBaseUrl(rawBaseUrl);

	if (!credentials.username || !credentials.password) {
		throw new NodeOperationError(this.getNode(), 'Missing credentials for file upload', {
			description: 'Username and password are required for file uploads. Please check your credentials configuration.',
		});
	}

	const url = `${baseUrl}${endpoint}`;

	const requestDetails: RequestDetails = {
		endpoint: url,
		method: 'POST',
		params: {
			fileName,
			mimeType,
			fieldName,
			fileSize: fileBuffer.length,
		},
	};

	// Use n8n's request helper with formData
	const requestOptions: Record<string, unknown> = {
		method: 'POST',
		uri: url,
		formData: {
			[fieldName]: {
				value: fileBuffer,
				options: {
					filename: fileName,
					contentType: mimeType,
				},
			},
		},
		auth: {
			user: credentials.username as string,
			pass: credentials.password as string,
		},
		resolveWithFullResponse: false,
		timeout: 120000,
		followAllRedirects: true,
		maxRedirects: 5,
	};

	try {
		// eslint-disable-next-line @n8n/community-nodes/no-deprecated-workflow-functions
		const rawResponse = await this.helpers.request(requestOptions);

		// Parse response
		let response: IDataObject;
		if (typeof rawResponse === 'string') {
			try {
				response = JSON.parse(rawResponse);
			} catch {
				// If JSON parsing fails, create a structured error
				const error = {
					message: 'Invalid JSON response from server',
					statusCode: 200, // Server returned 200 but invalid JSON
					response: {
						data: rawResponse.substring(0, 500),
					},
				};
				throw createBlossomApiError(operationName, error, requestDetails, this.getNode());
			}
		} else {
			response = rawResponse as IDataObject;
		}

		// Check for Blossom API error response format
		if (response.res === 'error') {
			const errorObj: {
				message: string;
				statusCode: number;
				response: { data: unknown };
			} = {
				message: (response.error_msg as string) || 'Unknown error from Blossom API',
				statusCode: (response.error_code as number) || 500,
				response: {
					data: response,
				},
			};
			throw createBlossomApiError(operationName, errorObj, requestDetails, this.getNode());
		}

		return response;
	} catch (error) {
		// If it's already a NodeApiError or NodeOperationError, re-throw it
		if (error instanceof NodeOperationError || (error as { name?: string }).name === 'NodeApiError') {
			throw error;
		}
		// Otherwise, wrap it
		throw createBlossomApiError(operationName, error, requestDetails, this.getNode());
	}
}

