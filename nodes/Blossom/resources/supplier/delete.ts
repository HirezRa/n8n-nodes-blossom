import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSupplierDelete = {
	operation: ['delete'],
	resource: ['supplier'],
};

export const supplierDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: showOnlyForSupplierDelete,
		},
		description: 'Domain ID',
	},
	{
		displayName: 'Supplier External ID',
		name: 'supplierExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSupplierDelete,
		},
		description: 'External ID of the supplier to delete',
	},
];
