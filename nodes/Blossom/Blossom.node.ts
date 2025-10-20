import { 
	NodeConnectionTypes, 
	type INodeType, 
	type INodeTypeDescription,
	type IExecuteFunctions,
	type INodeExecutionData,
	type IHttpRequestMethods,
	type IDataObject
} from 'n8n-workflow';
import { blossomApiRequest } from './shared/transport';
import { usersDescription } from './resources/users';
import { groupsDescription } from './resources/groups';
import { membershipsDescription } from './resources/memberships';
import { utilitiesDescription } from './resources/utilities';
import { suppliersDescription } from './resources/suppliers';
import { performancesDescription } from './resources/performances';

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
						name: 'Group',
						value: 'groups',
						description: 'Manage groups, courses, roles, and organizational units',
					},
					{
						name: 'Membership',
						value: 'memberships',
						description: 'Manage user-group memberships and managers',
					},
					{
						name: 'Performance',
						value: 'performances',
						description: 'Import assignment and group performances',
					},
					{
						name: 'Supplier',
						value: 'suppliers',
						description: 'Manage suppliers and external institutions',
					},
					{
						name: 'User',
						value: 'users',
						description: 'Manage users (create, update, delete, import)',
					},
					{
						name: 'Utility',
						value: 'utilities',
						description: 'Utility functions (test, auto-enrollment, authorities)',
					},
				],
				default: 'users',
			},
			...usersDescription,
			...groupsDescription,
			...membershipsDescription,
			...utilitiesDescription,
			...suppliersDescription,
			...performancesDescription,
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

				// Users operations
				if (resource === 'users') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'updateUser') {
						const userDetails = this.getNodeParameter('userDetails.details', i, {}) as Record<string, unknown>;
						responseData = await blossomApiRequest.call(this, 'POST', `UpdateUser`, {}, {
							domain: parseInt(domain),
							details: userDetails
						} as IDataObject);
					} else if (operation === 'deleteUser') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteUser`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier
						} as IDataObject);
					} else if (operation === 'getUser') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `GetUser`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier
						} as IDataObject);
					} else if (operation === 'getUsers') {
						const filters = this.getNodeParameter('filters.filter', i, {}) as Record<string, unknown>;
						const qs: Record<string, string> = { domain };
						Object.entries(filters).forEach(([key, value]) => {
							if (value !== undefined && value !== '') {
								qs[key] = String(value);
							}
						});
						responseData = await blossomApiRequest.call(this, 'POST', `GetUsers`, qs);
					} else if (operation === 'importUsersCSV') {
						const csvFile = this.getNodeParameter('csvFile', i) as string;
						const importOptions = this.getNodeParameter('importOptions.options', i, {}) as Record<string, unknown>;
						
						// Add options as query parameters
						const qs: Record<string, string> = { domain };
						Object.entries(importOptions).forEach(([key, value]) => {
							qs[key] = String(value);
						});
						
						// For CSV uploads, we need to use multipart form data
						const formData = {
							sheet_file: {
								value: csvFile,
								options: {
									filename: 'users.csv',
									contentType: 'text/csv'
								}
							}
						};
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportUsersCSV/${domain}`, qs, formData as IDataObject);
					} else if (operation === 'deleteUsersCSV') {
						const csvFile = this.getNodeParameter('csvFile', i) as string;
						
						const formData = {
							sheet_file: {
								value: csvFile,
								options: {
									filename: 'delete_users.csv',
									contentType: 'text/csv'
								}
							}
						};
						
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteUsersCSV/${domain}`, {}, formData as IDataObject);
					} else if (operation === 'setAvatar') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const avatarFile = this.getNodeParameter('avatarFile', i) as string;
						const removeAvatar = this.getNodeParameter('removeAvatar', i) as boolean;
						
						let formData: IDataObject = {};
						if (!removeAvatar && avatarFile) {
							formData = {
								avatarfile: {
									value: avatarFile,
									options: {
										filename: 'avatar.jpg',
										contentType: 'image/jpeg'
									}
								}
							};
						}
						
						responseData = await blossomApiRequest.call(this, 'POST', `AvatarSet/${domain}/${Object.entries(userIdentifier).map(([k, v]) => `${k}=${v}`).join(',')}/${removeAvatar ? '1' : '0'}`, {}, formData);
					}
				}
				// Groups operations
				else if (resource === 'groups') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'updateGroup') {
						const groupDetails = this.getNodeParameter('groupDetails.details', i, {}) as Record<string, unknown>;
						responseData = await blossomApiRequest.call(this, 'POST', `UpdateGroup`, {}, {
							domain: parseInt(domain),
							details: groupDetails
						} as IDataObject);
					} else if (operation === 'deleteGroup') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteGroup`, {}, {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						} as IDataObject);
					} else if (operation === 'getGroup') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `GetGroup`, {}, {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						} as IDataObject);
					} else if (operation === 'getGroups') {
						const filters = this.getNodeParameter('filters.filter', i, {}) as Record<string, unknown>;
						const qs: Record<string, string> = { domain };
						Object.entries(filters).forEach(([key, value]) => {
							if (value !== undefined && value !== '') {
								qs[key] = String(value);
							}
						});
						responseData = await blossomApiRequest.call(this, 'POST', `GetGroups`, qs);
					} else if (operation === 'getGroupMembers') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `GetGroupMembers`, {}, {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						} as IDataObject);
					} else if (operation === 'importGroupsCSV') {
						const csvFile = this.getNodeParameter('csvFile', i) as string;
						const importOptions = this.getNodeParameter('importOptions.options', i, {}) as Record<string, unknown>;
						
						const formData = {
							sheet_file: {
								value: csvFile,
								options: {
									filename: 'groups.csv',
									contentType: 'text/csv'
								}
							}
						};
						
						const qs: Record<string, string> = { domain };
						Object.entries(importOptions).forEach(([key, value]) => {
							qs[key] = String(value);
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportGroupsCSV/${domain}`, qs, formData as IDataObject);
					} else if (operation === 'attachSubGroup') {
						const subGroupIdentifier = this.getNodeParameter('subGroupIdentifier.identifier', i, {}) as Record<string, string>;
						const parentGroupIdentifier = this.getNodeParameter('parentGroupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `AttachSubGroup`, {}, {
							domain: parseInt(domain),
							sub_group_identifier: subGroupIdentifier,
							parent_group_identifier: parentGroupIdentifier
						} as IDataObject);
					} else if (operation === 'detachSubGroup') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DetachSubGroup`, {}, {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						} as IDataObject);
					} else if (operation === 'attachInstance') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						const templateIdentifier = this.getNodeParameter('templateIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `AttachInstance`, {}, {
							domain: parseInt(domain),
							group_identifier: groupIdentifier,
							template_identifier: templateIdentifier
						} as IDataObject);
					} else if (operation === 'detachInstance') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DetachInstance`, {}, {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						} as IDataObject);
					}
				}
				// Memberships operations
				else if (resource === 'memberships') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'attachUserToGroup') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `AttachUserToGroup`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier
						} as IDataObject);
					} else if (operation === 'detachUserFromGroup') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DetachUserFromGroup`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier
						} as IDataObject);
					} else if (operation === 'detachUserFromOu') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DetachUserFromOu`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier
						} as IDataObject);
					} else if (operation === 'getMemberships') {
						const filters = this.getNodeParameter('filters.filter', i, {}) as Record<string, unknown>;
						const qs: Record<string, string> = { domain };
						Object.entries(filters).forEach(([key, value]) => {
							if (value !== undefined && value !== '') {
								qs[key] = String(value);
							}
						});
						responseData = await blossomApiRequest.call(this, 'POST', `GetMemberships`, qs);
					} else if (operation === 'getUserGroups') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `GetUserGroups`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier
						} as IDataObject);
					} else if (operation === 'importGroupsMembersCSV') {
						const csvFile = this.getNodeParameter('csvFile', i) as string;
						const importOptions = this.getNodeParameter('importOptions.options', i, {}) as Record<string, unknown>;
						
						const formData = {
							sheet_file: {
								value: csvFile,
								options: {
									filename: 'group_members.csv',
									contentType: 'text/csv'
								}
							}
						};
						
						const qs: Record<string, string> = { domain };
						Object.entries(importOptions).forEach(([key, value]) => {
							qs[key] = String(value);
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportGroupsMembersCSV/${domain}`, qs, formData as IDataObject);
					} else if (operation === 'attachManager') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						const managerType = this.getNodeParameter('managerType', i) as string;
						const setPrimary = this.getNodeParameter('setPrimary', i) as string;
						responseData = await blossomApiRequest.call(this, 'POST', `AttachManager`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier,
							manager_type: managerType,
							set_primary: parseInt(setPrimary)
						} as IDataObject);
					} else if (operation === 'detachManager') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', `DetachManager`, {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier
						} as IDataObject);
					}
				}
				// Utilities operations
				else if (resource === 'utilities') {
					if (operation === 'test') {
						responseData = await blossomApiRequest.call(this, 'POST', 'Test');
					} else if (operation === 'getSystemInfo') {
						responseData = await blossomApiRequest.call(this, 'POST', 'GetSystemInfo');
					} else if (operation === 'getDomainInfo') {
						const domain = this.getNodeParameter('domain', i) as string;
						responseData = await blossomApiRequest.call(this, 'POST', 'GetDomainInfo', {}, {
							domain: parseInt(domain)
						} as IDataObject);
					} else if (operation === 'runAutoEnrollmentRules') {
						responseData = await blossomApiRequest.call(this, 'POST', 'RunAutoEnrollmentRules');
					} else if (operation === 'runScheduledImports') {
						responseData = await blossomApiRequest.call(this, 'POST', 'RunScheduledImports');
					} else if (operation === 'removeEmptyOrgUnits') {
						const domain = this.getNodeParameter('domain', i) as string;
						responseData = await blossomApiRequest.call(this, 'POST', 'RemoveEmptyOrgUnits', {}, {
							domain: parseInt(domain)
						} as IDataObject);
					} else if (operation === 'userAuthorities') {
						const domain = this.getNodeParameter('domain', i) as string;
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const authorities = this.getNodeParameter('authorities.authorities', i, {}) as Record<string, string>;
						responseData = await blossomApiRequest.call(this, 'POST', 'UserAuthorities', {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							authorities: authorities
						} as IDataObject);
					} else if (operation === 'powerManager') {
						const domain = this.getNodeParameter('domain', i) as string;
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const powerManagerType = this.getNodeParameter('powerManagerType', i) as string;
						responseData = await blossomApiRequest.call(this, 'POST', 'PowerManager', {}, {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							type: powerManagerType
						} as IDataObject);
					} else if (operation === 'uploadDiploma') {
						const domain = this.getNodeParameter('domain', i) as string;
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						const diplomaFile = this.getNodeParameter('diplomaFile', i) as string;
						const removeDiploma = this.getNodeParameter('removeDiploma', i) as boolean;
						
						let formData: IDataObject = {};
						if (!removeDiploma && diplomaFile) {
							formData = {
								diploma_file: {
									value: diplomaFile,
									options: {
										filename: 'diploma.pdf',
										contentType: 'application/pdf'
									}
								}
							};
						}
						
						responseData = await blossomApiRequest.call(this, 'POST', `UploadDiploma/${domain}/${Object.entries(userIdentifier).map(([k, v]) => `${k}=${v}`).join(',')}/${Object.entries(groupIdentifier).map(([k, v]) => `${k}=${v}`).join(',')}/${removeDiploma ? '1' : '0'}`, {}, formData);
					}
				}
				// Suppliers operations
				else if (resource === 'suppliers') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'updateSupplier') {
						const supplierType = this.getNodeParameter('supplierType', i) as string;
						const supplierDetails = this.getNodeParameter('supplierDetails.details', i, {}) as Record<string, unknown>;
						responseData = await blossomApiRequest.call(this, 'POST', `UpdateSupplier`, {}, {
							domain: parseInt(domain),
							type: supplierType,
							details: supplierDetails
						} as IDataObject);
					} else if (operation === 'deleteSupplier') {
						const externalId = this.getNodeParameter('externalId', i) as string;
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteSupplier`, {}, {
							domain: parseInt(domain),
							ext_id: externalId
						} as IDataObject);
					}
				}
				// Performances operations
				else if (resource === 'performances') {
					const domain = this.getNodeParameter('domain', i) as string;
					const csvFile = this.getNodeParameter('csvFile', i) as string;
					
					if (operation === 'importAssignmentPerformancesCSV') {
						const formData = {
							sheet_file: {
								value: csvFile,
								options: {
									filename: 'assignment_performances.csv',
									contentType: 'text/csv'
								}
							}
						};
						responseData = await blossomApiRequest.call(this, 'POST', `ImportAssignmentPerformancesCSV/${domain}`, {}, formData as IDataObject);
					} else if (operation === 'importGroupPerformancesCSV') {
						const formData = {
							sheet_file: {
								value: csvFile,
								options: {
									filename: 'group_performances.csv',
									contentType: 'text/csv'
								}
							}
						};
						responseData = await blossomApiRequest.call(this, 'POST', `ImportGroupPerformancesCSV/${domain}`, {}, formData as IDataObject);
					}
				}
				// Generic API operations
				else if (resource === 'generic') {
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
