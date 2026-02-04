import type { INodeProperties } from 'n8n-workflow';
import { userUpdateDescription } from './update';
import { userDeleteDescription } from './delete';
import { userGetDescription } from './get';
import { userAvatarSetDescription } from './avatarSet';
import { userAuthoritiesDescription } from './userAuthorities';
import { userPowerManagerDescription } from './powerManager';
import { userImportUsersCSVDescription } from './importUsersCSV';
import { userDeleteUsersCSVDescription } from './deleteUsersCSV';

const showOnlyForUsers = {
	resource: ['user'],
};

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get user details by identifier (External ID, User ID, User Name, or Identity Number)',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/GetUser/{{$parameter.domain}}/{{$parameter.userIdentifierType}}={{$parameter.userIdentifierValue}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a user',
				description: 'Delete a user',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/DeleteUser/{{$parameter.domain}}/{{$parameter.userIdentifierType}}={{$parameter.userIdentifierValue}}',
					},
				},
			},
			{
				name: 'Delete Users CSV',
				value: 'deleteUsersCSV',
				action: 'Delete users from CSV',
				description: 'Delete users from CSV file (soft delete). Limit: 4 calls per 24 hours.',
			},
			{
				name: 'Import Users CSV',
				value: 'importUsersCSV',
				action: 'Import users from CSV',
				description: 'Import users from CSV file (requires programmatic execution). Limit: 4 calls per 24 hours.',
			},
			{
				name: 'Power Manager',
				value: 'powerManager',
				action: 'Grant or revoke power manager privileges',
				description: 'Grant or revoke Power Manager privileges for a user',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/PowerManager/{{$parameter.domain}}/{{$parameter.userIdentifierType}}={{$parameter.userIdentifierValue}}/{{$parameter.action === "grant" ? "PowerManager" : "User"}}',
					},
				},
			},
			{
				name: 'Set Avatar',
				value: 'avatarSet',
				action: 'Upload or remove user avatar',
				description: 'Upload or remove user avatar (requires programmatic execution)',
			},
			{
				name: 'Set User Authorities',
				value: 'userAuthorities',
				action: 'Set user authorities',
				description: 'Set HR manager, professional manager, coach, or authorization supervisor',
				routing: {
					request: {
						method: 'POST',
						url: '=/WebServices/sync_2/UserAuthorities/{{$parameter.domain}}/{{$parameter.userIdentifierType}}={{$parameter.userIdentifierValue}}',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Create or update a user',
				description: 'Create or update a user',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/sync_2/UpdateUser',
					},
				},
			},
		],
		default: 'update',
	},
	...userUpdateDescription,
	...userDeleteDescription,
	...userGetDescription,
	...userAvatarSetDescription,
	...userAuthoritiesDescription,
	...userPowerManagerDescription,
	...userImportUsersCSVDescription,
	...userDeleteUsersCSVDescription,
];
