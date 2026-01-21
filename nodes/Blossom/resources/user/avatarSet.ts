import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserAvatarSet = {
	operation: ['avatarSet'],
	resource: ['user'],
};

export const userAvatarSetDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForUserAvatarSet,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'User Identifier Type',
		name: 'userIdentifierType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'User ID', value: 'user_id' },
			{ name: 'User Name', value: 'user_name' },
			{ name: 'Identity Number', value: 'identity_num' },
		],
		default: 'external_id',
		required: true,
		displayOptions: {
			show: showOnlyForUserAvatarSet,
		},
		description: 'How to identify the user',
	},
	{
		displayName: 'User Identifier Value',
		name: 'userIdentifierValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUserAvatarSet,
		},
		description: 'The value of the user identifier',
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Upload Avatar', value: 'upload' },
			{ name: 'Remove Avatar', value: 'remove' },
		],
		default: 'upload',
		required: true,
		displayOptions: {
			show: showOnlyForUserAvatarSet,
		},
		description: 'Upload or remove user avatar',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForUserAvatarSet,
				action: ['upload'],
			},
		},
		description: 'Name of the binary property containing the avatar file',
	},
];
