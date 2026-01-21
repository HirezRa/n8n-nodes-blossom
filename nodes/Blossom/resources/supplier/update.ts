import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSupplierUpdate = {
	operation: ['update'],
	resource: ['supplier'],
};

export const supplierUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForSupplierUpdate,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'RegExt (External Event Institution)', value: 'RegExt' },
		],
		default: 'RegExt',
		required: true,
		displayOptions: {
			show: showOnlyForSupplierUpdate,
		},
		description: 'Supplier type',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSupplierUpdate,
		},
		description: 'External ID of the supplier',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSupplierUpdate,
		},
		description: 'Supplier name',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		placeholder: 'supplier@example.com',
		displayOptions: {
			show: showOnlyForSupplierUpdate,
		},
		description: 'Supplier email',
	},
];
