import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IDataObject,
} from 'n8n-workflow';
import { userDescription } from './resources/user';
import { groupDescription } from './resources/group';
import { membershipDescription } from './resources/membership';
import { managerDescription } from './resources/manager';
import { supplierDescription } from './resources/supplier';
import { utilityDescription } from './resources/utility';
import { performanceDescription } from './resources/performance';
import { dataDescription } from './resources/data';
import { blossomApiRequest } from './shared/transport';
import { blossomFileUpload, extractBinaryFile } from './shared/fileUpload';

export class Blossom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Blossom',
		name: 'blossom',
		icon: 'file:blossom.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Blossom LMS/LXP API - manage users, groups, memberships, and learning data',
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
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl.replace(/\\/WebServices\\/sync_2\\/?$/, "").replace(/\\/$/, "")}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
			properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Data',
						value: 'data',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Manager',
						value: 'manager',
					},
					{
						name: 'Membership',
						value: 'membership',
					},
					{
						name: 'Performance',
						value: 'performance',
					},
					{
						name: 'Supplier',
						value: 'supplier',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Utility',
						value: 'utility',
					},
				],
				default: 'user',
			},
			...userDescription,
			...groupDescription,
			...membershipDescription,
			...managerDescription,
			...supplierDescription,
			...utilityDescription,
			...performanceDescription,
			...dataDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject = {};

				// File upload operations require custom handling
				if (resource === 'user' && operation === 'importUsersCSV') {
					const operationName = 'Import Users CSV';
					const domain = this.getNodeParameter('domain', i) as number;
					const csvFile = this.getNodeParameter('csvFile', i) as string;
					const importOptions = this.getNodeParameter('importOptions', i, {}) as IDataObject;

					const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
						this,
						i,
						csvFile,
						'users.csv',
						'text/csv',
					);

					// Check if CSV contains manager_ou or ou_name columns
					const csvContent = fileBuffer.toString('utf-8');
					const firstLine = csvContent.split('\n')[0] || '';
					const hasManagerOu = firstLine.includes('manager_ou') || firstLine.includes('ou_name');
					
					// Build options path
					const optionParts: string[] = [];
					if (importOptions.keep_old_values !== false) optionParts.push('keep_old_values=1');
					if (importOptions.temp_password) optionParts.push('temp_password=1');
					if (importOptions.new_user_notification) optionParts.push('new_user_notification=1');
					if (importOptions.password_not_required) optionParts.push('password_not_required=1');
					if (importOptions.update_password) optionParts.push('update_password=1');
					// Auto-detect manager_ou if CSV contains these columns
					if (importOptions.manager_ou || hasManagerOu) optionParts.push('manager_ou=1');
					if (importOptions.clean_ou) optionParts.push('clean_ou=1');

					const optionsPath = optionParts.length > 0 ? `/${optionParts.join('&')}` : '/keep_old_values=1';
					const endpoint = `/WebServices/sync_2/ImportUsersCSV/${domain}${optionsPath}`;

					responseData = await blossomFileUpload.call(
						this,
						endpoint,
						fileBuffer,
						fileName,
						mimeType,
						'sheet_file',
						operationName,
					);
				} else if (resource === 'user' && operation === 'deleteUsersCSV') {
					const operationName = 'Delete Users CSV';
					const domain = this.getNodeParameter('domain', i) as number;
					const csvFile = this.getNodeParameter('csvFile', i) as string;

					const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
						this,
						i,
						csvFile,
						'delete_users.csv',
						'text/csv',
					);

					const endpoint = `/WebServices/sync_2/DeleteUsersCSV/${domain}`;
					responseData = await blossomFileUpload.call(
						this,
						endpoint,
						fileBuffer,
						fileName,
						mimeType,
						'sheet_file',
						operationName,
					);
				} else if (resource === 'user' && operation === 'avatarSet') {
					const operationName = 'Set Avatar';
					const domain = this.getNodeParameter('domain', i) as number;
					const userIdentifierType = this.getNodeParameter('userIdentifierType', i) as string;
					const userIdentifierValue = this.getNodeParameter('userIdentifierValue', i) as string;
					const action = this.getNodeParameter('action', i) as string;
					const removeFlag = action === 'remove' ? '1' : '0';

					if (action === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
							this,
							i,
							binaryPropertyName,
							'avatar.jpg',
							'image/jpeg',
						);

						const endpoint = `/WebServices/sync_2/AvatarSet/${domain}/${userIdentifierType}=${userIdentifierValue}/${removeFlag}`;
						responseData = await blossomFileUpload.call(
							this,
							endpoint,
							fileBuffer,
							fileName,
							mimeType,
							'avatarfile',
							operationName,
						);
					} else {
						// Remove avatar - no file needed
						const endpoint = `/WebServices/sync_2/AvatarSet/${domain}/${userIdentifierType}=${userIdentifierValue}/1`;
						responseData = await blossomApiRequest.call(this, 'POST', endpoint, undefined, {}, {}, operationName);
					}
				} else if (resource === 'group' && operation === 'importGroupsCSV') {
					const operationName = 'Import Groups CSV';
					const domain = this.getNodeParameter('domain', i) as number;
					const csvFile = this.getNodeParameter('csvFile', i) as string;
					const importOptions = this.getNodeParameter('importOptions', i, {}) as IDataObject;

					const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
						this,
						i,
						csvFile,
						'groups.csv',
						'text/csv',
					);

					// Build options path
					const optionParts: string[] = [];
					if (importOptions.keep_old_values) optionParts.push('keep_old_values=1');
					if (importOptions.manager_type) optionParts.push(`manager_type=${importOptions.manager_type}`);
					if (importOptions.override_existing_permissions) optionParts.push('override_existing_permissions=1');
					if (importOptions.remove_existing_managers) optionParts.push('remove_existing_managers=1');
					if (importOptions.set_primary_manager) optionParts.push('set_primary_manager=1');

					const optionsPath = optionParts.length > 0 ? `/${optionParts.join('&')}` : '/keep_old_values=1';
					const endpoint = `/WebServices/sync_2/ImportGroupsCSV/${domain}${optionsPath}`;

					responseData = await blossomFileUpload.call(
						this,
						endpoint,
						fileBuffer,
						fileName,
						mimeType,
						'sheet_file',
						operationName,
					);
				} else if (resource === 'membership' && operation === 'importGroupsMembersCSV') {
					const operationName = 'Import Groups Members CSV';
					const domain = this.getNodeParameter('domain', i) as number;
					const csvFile = this.getNodeParameter('csvFile', i) as string;

					const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
						this,
						i,
						csvFile,
						'members.csv',
						'text/csv',
					);

					const endpoint = `/WebServices/sync_2/ImportGroupsMembersCSV/${domain}`;
					responseData = await blossomFileUpload.call(
						this,
						endpoint,
						fileBuffer,
						fileName,
						mimeType,
						'sheet_file',
						operationName,
					);
				} else if (resource === 'performance' && operation === 'importAssignmentPerformancesCSV') {
					const operationName = 'Import Assignment Performances CSV';
					const domain = this.getNodeParameter('domain', i) as number;
					const csvFile = this.getNodeParameter('csvFile', i) as string;

					const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
						this,
						i,
						csvFile,
						'performances.csv',
						'text/csv',
					);

					const endpoint = `/WebServices/sync_2/ImportAssignmentPerformancesCSV/${domain}`;
					responseData = await blossomFileUpload.call(
						this,
						endpoint,
						fileBuffer,
						fileName,
						mimeType,
						'sheet_file',
						operationName,
					);
				} else if (resource === 'performance' && operation === 'importGroupPerformancesCSV') {
					const operationName = 'Import Group Performances CSV';
					const domain = this.getNodeParameter('domain', i) as number;
					const csvFile = this.getNodeParameter('csvFile', i) as string;

					const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
						this,
						i,
						csvFile,
						'performances.csv',
						'text/csv',
					);

					const endpoint = `/WebServices/sync_2/ImportGroupPerformancesCSV/${domain}`;
					responseData = await blossomFileUpload.call(
						this,
						endpoint,
						fileBuffer,
						fileName,
						mimeType,
						'sheet_file',
						operationName,
					);
				} else if (resource === 'performance' && operation === 'uploadDiploma') {
					const operationName = 'Upload Diploma';
					const domain = this.getNodeParameter('domain', i) as number;
					const userIdentifierType = this.getNodeParameter('userIdentifierType', i) as string;
					const userIdentifierValue = this.getNodeParameter('userIdentifierValue', i) as string;
					const groupIdentifierType = this.getNodeParameter('groupIdentifierType', i) as string;
					const groupIdentifierValue = this.getNodeParameter('groupIdentifierValue', i) as string;
					const action = this.getNodeParameter('action', i) as string;
					const removeFlag = action === 'remove' ? '1' : '0';

					if (action === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const { fileBuffer, fileName, mimeType } = await extractBinaryFile.call(
							this,
							i,
							binaryPropertyName,
							'diploma.pdf',
							'application/pdf',
						);

						const endpoint = `/WebServices/sync_2/UploadDiploma/${domain}/${userIdentifierType}=${userIdentifierValue}/${groupIdentifierType}=${groupIdentifierValue}/${removeFlag}`;
						responseData = await blossomFileUpload.call(
							this,
							endpoint,
							fileBuffer,
							fileName,
							mimeType,
							'diploma_file',
							operationName,
						);
					} else {
						// Remove diploma - no file needed
						const endpoint = `/WebServices/sync_2/UploadDiploma/${domain}/${userIdentifierType}=${userIdentifierValue}/${groupIdentifierType}=${groupIdentifierValue}/1`;
						responseData = await blossomApiRequest.call(this, 'POST', endpoint, undefined, {}, {}, operationName);
					}
			} else if (resource === 'utility') {
				// Utility operations - explicit API calls like old version 2.5.13
				if (operation === 'test') {
					const operationName = 'Test Connection';
					const domain = this.getNodeParameter('domain', i) as number;
					responseData = await blossomApiRequest.call(
						this,
						'POST',
						`/WebServices/sync_2/Test/${domain}`,
						undefined,
						{},
						{},
						operationName,
					);
				} else if (operation === 'runAutoEnrollmentRules') {
					const operationName = 'Run Auto Enrollment Rules';
					responseData = await blossomApiRequest.call(
						this,
						'POST',
						'/WebServices/sync_2/RunAutoEnrollmentRules',
						undefined,
						{},
						{},
						operationName,
					);
				} else if (operation === 'runScheduledImports') {
					const operationName = 'Run Scheduled Imports';
					responseData = await blossomApiRequest.call(
						this,
						'POST',
						'/WebServices/sync_2/RunScheduledImports',
						undefined,
						{},
						{},
						operationName,
					);
				} else if (operation === 'removeEmptyOrgUnits') {
					const operationName = 'Remove Empty Org Units';
					const domain = this.getNodeParameter('domain', i) as number;
					responseData = await blossomApiRequest.call(
						this,
						'POST',
						`/WebServices/sync_2/RemoveEmptyOrgUnits/${domain}`,
						undefined,
						{},
						{},
						operationName,
					);
				} else {
					// Unknown utility operation
					responseData = {};
				}
			} else {
				// All other operations use declarative routing - no custom execute needed
				// This will be handled by n8n's declarative routing system
				// Return empty result - declarative routing will handle it
				responseData = {};
			}

				returnData.push({
					json: responseData as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
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
