import { 
	NodeConnectionTypes, 
	type INodeType, 
	type INodeTypeDescription,
	type IExecuteFunctions,
	type INodeExecutionData,
	type IDataObject
} from 'n8n-workflow';
import { blossomApiRequest } from './shared/transport';
import { usersDescription } from './resources/users';
import { groupsDescription } from './resources/groups';
import { membershipsDescription } from './resources/memberships';
import { managersDescription } from './resources/managers';
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
						name: 'Group',
						value: 'groups',
						description: 'Manage groups, courses, roles, and organizational units',
					},
					{
						name: 'Manager',
						value: 'managers',
						description: 'Manage managers and user authorities',
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
			...managersDescription,
			...membershipsDescription,
			...utilitiesDescription,
			...suppliersDescription,
			...performancesDescription,
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
						
						// Clean up the user details to ensure proper encoding
						const cleanUserDetails: Record<string, unknown> = {};
						Object.entries(userDetails).forEach(([key, value]) => {
							if (value !== undefined && value !== null && value !== '') {
								cleanUserDetails[key] = value;
							}
						});
						
						const requestBody = {
							domain: parseInt(domain),
							details: cleanUserDetails
						};
						
						// Debug logging
						console.log('UpdateUser Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `UpdateUser`, {}, requestBody as IDataObject);
					} else if (operation === 'deleteUser') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier
						};
						
						// Debug logging
						console.log('DeleteUser Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteUser`, {}, requestBody as IDataObject);
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
						
						// Debug logging
						console.log('ImportUsersCSV Request:', {
							queryParams: qs,
							formData: { sheet_file: 'CSV file content' },
							domain: domain,
							endpoint: `ImportUsersCSV/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportUsersCSV/${parseInt(domain)}`, qs, formData as IDataObject);
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
						
						// Debug logging
						console.log('DeleteUsersCSV Request:', {
							formData: { sheet_file: 'CSV file content' },
							domain: domain,
							endpoint: `DeleteUsersCSV/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteUsersCSV/${parseInt(domain)}`, {}, formData as IDataObject);
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
						
						const endpoint = `AvatarSet/${parseInt(domain)}/${Object.entries(userIdentifier).map(([k, v]) => `${k}=${v}`).join(',')}/${removeAvatar ? '1' : '0'}`;
						
						// Debug logging
						console.log('SetAvatar Request:', {
							userIdentifier: userIdentifier,
							removeAvatar: removeAvatar,
							hasAvatarFile: !!avatarFile,
							formData: removeAvatar ? {} : { avatarfile: 'Image file content' },
							domain: domain,
							endpoint: endpoint
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', endpoint, {}, formData);
					}
				}
				// Groups operations
				else if (resource === 'groups') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'updateGroup') {
						const groupDetails = this.getNodeParameter('groupDetails.details', i, {}) as Record<string, unknown>;
						
						const requestBody = {
							domain: parseInt(domain),
							details: groupDetails
						};
						
						// Debug logging
						console.log('UpdateGroup Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `UpdateGroup`, {}, requestBody as IDataObject);
					} else if (operation === 'deleteGroup') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						};
						
						// Debug logging
						console.log('DeleteGroup Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteGroup`, {}, requestBody as IDataObject);
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
						
						// Debug logging
						console.log('ImportGroupsCSV Request:', {
							queryParams: qs,
							formData: { sheet_file: 'CSV file content' },
							domain: domain,
							endpoint: `ImportGroupsCSV/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportGroupsCSV/${parseInt(domain)}`, qs, formData as IDataObject);
					} else if (operation === 'attachSubGroup') {
						const subGroupIdentifier = this.getNodeParameter('subGroupIdentifier.identifier', i, {}) as Record<string, string>;
						const parentGroupIdentifier = this.getNodeParameter('parentGroupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							sub_group_identifier: subGroupIdentifier,
							parent_group_identifier: parentGroupIdentifier
						};
						
						// Debug logging
						console.log('AttachSubGroup Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `AttachSubGroup`, {}, requestBody as IDataObject);
					} else if (operation === 'detachSubGroup') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						};
						
						// Debug logging
						console.log('DetachSubGroup Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DetachSubGroup`, {}, requestBody as IDataObject);
					} else if (operation === 'attachInstance') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						const templateIdentifier = this.getNodeParameter('templateIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							group_identifier: groupIdentifier,
							template_identifier: templateIdentifier
						};
						
						// Debug logging
						console.log('AttachInstance Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `AttachInstance`, {}, requestBody as IDataObject);
					} else if (operation === 'detachInstance') {
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							group_identifier: groupIdentifier
						};
						
						// Debug logging
						console.log('DetachInstance Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DetachInstance`, {}, requestBody as IDataObject);
					}
				}
				// Managers operations
				else if (resource === 'managers') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'attachManager') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						const managerType = this.getNodeParameter('managerType', i) as string;
						const setPrimary = this.getNodeParameter('set_primary', i) as string;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier,
							manager_type: managerType,
							set_primary: setPrimary
						};
						
						// Debug logging
						console.log('AttachManager Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `AttachManager`, {}, requestBody as IDataObject);
					} else if (operation === 'powerManager') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const type = this.getNodeParameter('type', i) as string;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							type: type
						};
						
						// Debug logging
						console.log('PowerManager Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', 'PowerManager', {}, requestBody as IDataObject);
					} else if (operation === 'userAuthorities') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const authorities = this.getNodeParameter('authorities.authority', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							authorities: authorities
						};
						
						// Debug logging
						console.log('UserAuthorities Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', 'UserAuthorities', {}, requestBody as IDataObject);
					}
				}
				// Memberships operations
				else if (resource === 'memberships') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'attachUserToGroup') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier
						};
						
						// Debug logging
						console.log('AttachUserToGroup Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `AttachUserToGroup`, {}, requestBody as IDataObject);
					} else if (operation === 'detachUserFromGroup') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier
						};
						
						// Debug logging
						console.log('DetachUserFromGroup Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DetachUserFromGroup`, {}, requestBody as IDataObject);
					} else if (operation === 'detachUserFromOu') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier
						};
						
						// Debug logging
						console.log('DetachUserFromOu Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DetachUserFromOu`, {}, requestBody as IDataObject);
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
						
						// Debug logging
						console.log('ImportGroupsMembersCSV Request:', {
							queryParams: qs,
							formData: { sheet_file: 'CSV file content' },
							domain: domain,
							endpoint: `ImportGroupsMembersCSV/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportGroupsMembersCSV/${parseInt(domain)}`, qs, formData as IDataObject);
					} else if (operation === 'detachManager') {
						const userIdentifier = this.getNodeParameter('userIdentifier.identifier', i, {}) as Record<string, string>;
						const groupIdentifier = this.getNodeParameter('groupIdentifier.identifier', i, {}) as Record<string, string>;
						
						const requestBody = {
							domain: parseInt(domain),
							user_identifier: userIdentifier,
							group_identifier: groupIdentifier
						};
						
						// Debug logging
						console.log('DetachManager Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DetachManager`, {}, requestBody as IDataObject);
					}
				}
				// Utilities operations
				else if (resource === 'utilities') {
					if (operation === 'test') {
						const domain = this.getNodeParameter('domain', i) as string;
						
						// Debug logging
						console.log('Test Request:', {
							domain: domain,
							endpoint: `Test/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `Test/${parseInt(domain)}`);
					} else if (operation === 'runAutoEnrollmentRules') {
						// Debug logging
						console.log('RunAutoEnrollmentRules Request:', {
							endpoint: 'RunAutoEnrollmentRules'
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', 'RunAutoEnrollmentRules');
					} else if (operation === 'runScheduledImports') {
						// Debug logging
						console.log('RunScheduledImports Request:', {
							endpoint: 'RunScheduledImports'
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', 'RunScheduledImports');
					} else if (operation === 'removeEmptyOrgUnits') {
						const domain = this.getNodeParameter('domain', i) as string;
						
						const requestBody = {
							domain: parseInt(domain)
						};
						
						// Debug logging
						console.log('RemoveEmptyOrgUnits Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', 'RemoveEmptyOrgUnits', {}, requestBody as IDataObject);
					}
				}
				// Suppliers operations
				else if (resource === 'suppliers') {
					const domain = this.getNodeParameter('domain', i) as string;
					
					if (operation === 'updateSupplier') {
						const supplierType = this.getNodeParameter('supplierType', i) as string;
						const supplierDetails = this.getNodeParameter('supplierDetails.details', i, {}) as Record<string, unknown>;
						
						const requestBody = {
							domain: parseInt(domain),
							type: supplierType,
							details: supplierDetails
						};
						
						// Debug logging
						console.log('UpdateSupplier Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `UpdateSupplier`, {}, requestBody as IDataObject);
					} else if (operation === 'deleteSupplier') {
						const externalId = this.getNodeParameter('externalId', i) as string;
						
						const requestBody = {
							domain: parseInt(domain),
							ext_id: externalId
						};
						
						// Debug logging
						console.log('DeleteSupplier Request Body:', JSON.stringify(requestBody, null, 2));
						
						responseData = await blossomApiRequest.call(this, 'POST', `DeleteSupplier`, {}, requestBody as IDataObject);
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
						
						// Debug logging
						console.log('ImportAssignmentPerformancesCSV Request:', {
							formData: { sheet_file: 'CSV file content' },
							domain: domain,
							endpoint: `ImportAssignmentPerformancesCSV/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportAssignmentPerformancesCSV/${parseInt(domain)}`, {}, formData as IDataObject);
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
						
						// Debug logging
						console.log('ImportGroupPerformancesCSV Request:', {
							formData: { sheet_file: 'CSV file content' },
							domain: domain,
							endpoint: `ImportGroupPerformancesCSV/${parseInt(domain)}`
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', `ImportGroupPerformancesCSV/${parseInt(domain)}`, {}, formData as IDataObject);
					} else if (operation === 'uploadDiploma') {
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
						
						const removeFlag = removeDiploma ? '1' : '0';
						const userParam = userIdentifier.external_id || userIdentifier.user_id || userIdentifier.user_name || userIdentifier.identity_num;
						const groupParam = groupIdentifier.group_external_id || groupIdentifier.group_id;
						const endpoint = `UploadDiploma/${parseInt(domain)}/${userParam}/${groupParam}/${removeFlag}`;
						
						// Debug logging
						console.log('UploadDiploma Request:', {
							userIdentifier: userIdentifier,
							groupIdentifier: groupIdentifier,
							removeDiploma: removeDiploma,
							hasDiplomaFile: !!diplomaFile,
							formData: removeDiploma ? {} : { diploma_file: 'PDF file content' },
							domain: domain,
							endpoint: endpoint
						});
						
						responseData = await blossomApiRequest.call(this, 'POST', endpoint, {}, formData);
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
