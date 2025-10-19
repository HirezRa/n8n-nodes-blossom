import { 
	NodeConnectionTypes, 
	type INodeType, 
	type INodeTypeDescription,
	type IExecuteFunctions,
	type INodeExecutionData,
	type IHttpRequestMethods,
	type IDataObject,
	NodeOperationError
} from 'n8n-workflow';
import { blossomApiRequest } from './shared/transport';

export class Blossom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Blossom',
		name: 'blossom',
		icon: { light: 'file:../../icons/blossom.svg', dark: 'file:../../icons/blossom.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Blossom API - Generic integration for any Blossom instance',
		defaults: {
			name: 'Blossom',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'blossomApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generic API',
						value: 'generic',
						description: 'Make generic API requests to any endpoint',
					},
					{
						name: 'WebService',
						value: 'webServices',
						description: 'Use WebServices endpoints for data synchronization',
					},
				],
				default: 'generic',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['generic'],
					},
				},
				options: [
					{
						name: 'Make Request',
						value: 'makeRequest',
						description: 'Make a generic API request to any endpoint',
						action: 'Make request a generic',
					},
				],
				default: 'makeRequest',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webServices'],
					},
				},
				options: [
					{
						name: 'Sync Data',
						value: 'syncData',
						description: 'Sync data using the WebServices/sync_2 endpoint',
						action: 'Sync data a web services',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get the status of sync operations',
						action: 'Get status a web services',
					},
					{
						name: 'List Endpoints',
						value: 'listEndpoints',
						description: 'List all available WebServices endpoints',
						action: 'List endpoints a web services',
					},
				],
				default: 'syncData',
			},
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				default: 'WebServices/sync_2',
				required: true,
				displayOptions: {
					show: {
						resource: ['generic'],
					},
				},
				description: 'The API endpoint to call (relative to base URL)',
			},
			{
				displayName: 'HTTP Method',
				name: 'method',
				type: 'options',
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
				],
				default: 'GET',
				displayOptions: {
					show: {
						resource: ['generic'],
					},
				},
				description: 'The HTTP method to use',
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['generic'],
					},
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameters',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Parameter name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Parameter value',
							},
						],
					},
				],
				description: 'Query parameters to send with the request',
			},
			{
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['generic'],
						method: ['POST', 'PUT', 'PATCH'],
					},
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameters',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Parameter name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Parameter value',
							},
						],
					},
				],
				description: 'Body parameters to send with the request',
			},
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['webServices'],
						operation: ['syncData'],
					},
				},
				options: [
					{ name: 'Create', value: 'create', description: 'Create new records', action: 'Create a web services' },
					{ name: 'Delete', value: 'delete', description: 'Delete records', action: 'Delete a web services' },
					{ name: 'Read', value: 'read', description: 'Read/retrieve records', action: 'Read a web services' },
					{ name: 'Sync', value: 'sync', description: 'Synchronize data', action: 'Sync a web services' },
					{ name: 'Update', value: 'update', description: 'Update existing records', action: 'Update a web services' },
				],
				default: 'read',

			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['webServices'],
						operation: ['syncData'],
					},
				},
				default: '{}',
				description: 'The data to send with the request (JSON format)',
			},
			{
				displayName: 'Entity Type',
				name: 'entityType',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['webServices'],
						operation: ['syncData'],
					},
				},
				default: '',
				placeholder: 'e.g., customers, orders, products',
				description: 'The type of entity to sync',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: unknown;

				if (resource === 'generic') {
					if (operation === 'makeRequest') {
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const method = this.getNodeParameter('method', i) as string;
						const queryParams = this.getNodeParameter('queryParameters.parameters', i, []) as Array<{ name: string; value: string }>;
						const bodyParams = this.getNodeParameter('bodyParameters.parameters', i, []) as Array<{ name: string; value: string }>;

						// Convert parameters to objects
						const qs: { [key: string]: string } = {};
						for (const param of queryParams) {
							qs[param.name] = param.value;
						}

						const body: { [key: string]: string } = {};
						for (const param of bodyParams) {
							body[param.name] = param.value;
						}

						responseData = await blossomApiRequest.call(this, method as IHttpRequestMethods, endpoint, qs, Object.keys(body).length > 0 ? body : undefined);
					}
				} else if (resource === 'webServices') {
					if (operation === 'syncData') {
						const action = this.getNodeParameter('action', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						const entityType = this.getNodeParameter('entityType', i) as string;

						const requestBody: Record<string, unknown> = {
							action,
							entityType,
						};

						if (data && data !== '{}') {
							try {
								requestBody.data = JSON.parse(data);
							} catch {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in data field');
							}
						}

						responseData = await blossomApiRequest.call(this, 'POST', 'WebServices/sync_2', {}, requestBody as IDataObject);
					} else if (operation === 'getStatus') {
						responseData = await blossomApiRequest.call(this, 'GET', 'WebServices/sync_2', { action: 'status' } as IDataObject);
					} else if (operation === 'listEndpoints') {
						responseData = await blossomApiRequest.call(this, 'GET', 'WebServices');
					}
				}

				returnData.push({
					json: responseData as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
