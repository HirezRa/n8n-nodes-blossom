import type { INodeProperties } from 'n8n-workflow';

export const domainSelect: INodeProperties = {
	displayName: 'Domain',
	name: 'domain',
	type: 'number',
	default: 1,
	description: 'Domain ID',
	required: true,
};

export const userIdentifierSelect: INodeProperties = {
	displayName: 'User Identifier',
	name: 'userIdentifier',
	type: 'options',
	options: [
		{ name: 'External ID', value: 'external_id' },
		{ name: 'User ID', value: 'user_id' },
		{ name: 'User Name', value: 'user_name' },
		{ name: 'Identity Number', value: 'identity_num' },
	],
	default: 'external_id',
	description: 'How to identify the user',
};

export const userIdentifierValue: INodeProperties = {
	displayName: 'User Identifier Value',
	name: 'userIdentifierValue',
	type: 'string',
	default: '',
	description: 'The value of the user identifier',
	required: true,
};

export const groupIdentifierSelect: INodeProperties = {
	displayName: 'Group Identifier',
	name: 'groupIdentifier',
	type: 'options',
	options: [
		{ name: 'External ID', value: 'external_id' },
		{ name: 'Group ID', value: 'group_id' },
	],
	default: 'external_id',
	description: 'How to identify the group',
};

export const groupIdentifierValue: INodeProperties = {
	displayName: 'Group Identifier Value',
	name: 'groupIdentifierValue',
	type: 'string',
	default: '',
	description: 'The value of the group identifier',
	required: true,
};
