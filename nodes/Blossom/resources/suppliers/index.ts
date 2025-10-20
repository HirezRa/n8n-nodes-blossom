import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSuppliers = {
	resource: ['suppliers'],
};

export const suppliersDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSuppliers,
		},
		options: [
			{
				name: 'Update Supplier',
				value: 'updateSupplier',
				description: 'Create or update supplier by external ID',
				action: 'Update a supplier',
			},
			{
				name: 'Delete Supplier',
				value: 'deleteSupplier',
				description: 'Delete supplier by external_id',
				action: 'Delete a supplier',
			},
		],
		default: 'updateSupplier',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '1',
		required: true,
		displayOptions: {
			show: showOnlyForSuppliers,
		},
		description: 'Domain name or ID',
	},
	{
		displayName: 'Supplier Type',
		name: 'supplierType',
		type: 'string',
		default: 'RegExt',
		displayOptions: {
			show: {
				...showOnlyForSuppliers,
				operation: ['updateSupplier'],
			},
		},
		description: 'Supplier type (e.g., RegExt for external event institutions)',
	},
	{
		displayName: 'Supplier Details',
		name: 'supplierDetails',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		default: {},
		displayOptions: {
			show: {
				...showOnlyForSuppliers,
				operation: ['updateSupplier'],
			},
		},
		options: [
			{
				name: 'details',
				displayName: 'Details',
				values: [
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'Supplier address',
					},
					{
						displayName: 'Business Number',
						name: 'business_number',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Contact',
						name: 'contact',
						type: 'string',
						default: '',
						description: 'Contact person',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Email address',
					},
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'External ID from foreign system',
					},
					{
						displayName: 'Fax',
						name: 'fax',
						type: 'string',
						default: '',
						description: 'Fax number',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Supplier name',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Phone number',
					},
					{
						displayName: 'Supplier Number',
						name: 'supplier_number',
						type: 'string',
						default: '',
					},
				],
			},
		],

	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSuppliers,
				operation: ['deleteSupplier'],
			},
		},
		description: 'External ID of supplier to delete',
	},
];
