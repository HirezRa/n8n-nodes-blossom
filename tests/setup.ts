// Jest setup file
// Mock n8n-workflow for testing
jest.mock('n8n-workflow', () => ({
	IAuthenticateGeneric: {},
	ICredentialTestRequest: {},
	ICredentialType: {},
	INodeProperties: {},
	Icon: {},
	NodeConnectionTypes: {
		Main: 'main',
	},
	INodeType: {},
	INodeTypeDescription: {},
	IExecuteFunctions: {},
	INodeExecutionData: {},
	IHttpRequestMethods: {},
	IDataObject: {},
	IHookFunctions: {},
	IExecuteSingleFunctions: {},
	ILoadOptionsFunctions: {},
	IHttpRequestOptions: {},
	NodeApiError: class extends Error {},
	NodeOperationError: class extends Error {},
}));

// Global test timeout
jest.setTimeout(10000);
