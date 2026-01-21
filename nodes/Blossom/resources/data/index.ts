import type { INodeProperties } from 'n8n-workflow';
import { userCompletionDescription } from './userCompletion';
import { membersStatusDescription } from './membersStatus';
import { groupsDescription } from './groups';
import { setDueDateDescription } from './setDueDate';
import { getMeetingsDescription } from './getMeetings';

const showOnlyForData = {
	resource: ['data'],
};

export const dataDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForData,
		},
		options: [
			{
				name: 'Get Groups',
				value: 'getGroups',
				action: 'Get list of groups',
				description: 'Get list of groups/workspaces',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/api_remote/groups',
					},
				},
			},
			{
				name: 'Get Meetings',
				value: 'getMeetings',
				action: 'Get meetings information',
				description: 'Get meetings information for workspace(s) and/or user(s)',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/api_remote/get_meetings',
					},
				},
			},
			{
				name: 'Get Members Status',
				value: 'getMembersStatus',
				action: 'Get member status in workspace',
				description: 'Get member status in workspace(s)',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/api_remote/members_status',
					},
				},
			},
			{
				name: 'Get User Completion',
				value: 'getCompletion',
				action: 'Get user completion status',
				description: 'Get user completion status for qualifications, courses, and assignments',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/api_remote/user_completion',
					},
				},
			},
			{
				name: 'Set Due Date',
				value: 'setDueDate',
				action: 'Set due date for user',
				description: 'Set due date for a user in a workspace',
				routing: {
					request: {
						method: 'POST',
						url: '/WebServices/api_remote/set_due_date',
					},
				},
			},
		],
		default: 'getCompletion',
	},
	...userCompletionDescription,
	...membersStatusDescription,
	...groupsDescription,
	...setDueDateDescription,
	...getMeetingsDescription,
];
