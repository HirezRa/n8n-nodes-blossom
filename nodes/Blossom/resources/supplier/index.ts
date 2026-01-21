import type { INodeProperties } from 'n8n-workflow';
import { supplierUpdateDescription } from './update';
import { supplierDeleteDescription } from './delete';

const showOnlyForSupplier = {
	resource: ['supplier'],
};

export const supplierDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSupplier,
		},
		options: [
			{
				name: 'Update',
				value: 'update',
				action: 'Create or update a supplier',
				description: 'Create or update a supplier (RegExt for external event institutions)',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/UpdateSupplier/{{$parameter.domain}}/{{$parameter.type}}/external_id={{$parameter.externalId}}&name={{$parameter.name}}&email={{$parameter.email}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a supplier',
				description: 'Delete a supplier',
				routing: {
					request: {
						method: 'GET',
						url: '=/WebServices/sync_2/DeleteSupplier/{{$parameter.domain}}/{{$parameter.supplierExternalId}}',
					},
				},
			},
		],
		default: 'update',
	},
	...supplierUpdateDescription,
	...supplierDeleteDescription,
];
