# n8n-nodes-blossom

![Blossom Logo](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

n8n community node for integrating with **Blossom LMS/LXP** (Learning Management System / Learning Experience Platform).

## Features

This node provides comprehensive integration with the **Blossom Sync API V2**, allowing you to:

- **User Management**: Get, create, update, and delete users; bulk import/delete via CSV; set avatar and authorities; Power Manager
- **Group/Workspace Management**: Create, update, delete groups; attach/detach sub-groups and instances; bulk import via CSV
- **Membership Management**: Attach and detach users from groups; bulk import members via CSV
- **Manager & Supplier**: Attach/detach managers; update/delete suppliers (e.g. RegExt)
- **Performance**: Import assignment/group performances via CSV; upload/remove diplomas
- **Data Queries**: User completion, members status, groups, meetings, set due date
- **Utility**: Test connection, run auto-enrollment rules, scheduled imports, remove empty org units

## Installation

```bash
npm install n8n-nodes-blossom
```

## Authentication

The node uses **Basic Authentication**. Configure your credentials:

1. **Base URL**: `https://your-instance.blossom-kc.com` (your Blossom instance URL)
2. **Username**: Your API username
3. **Password**: Your API password

### Getting Credentials

Contact your Blossom administrator to obtain API credentials with appropriate permissions.

## Resources and Operations

| Resource    | Operations |
|------------|------------|
| **User**   | Get, Update, Delete, Set Avatar, Set User Authorities, Power Manager, Import Users CSV, Delete Users CSV |
| **Group**  | Update, Delete, Attach/Detach Sub Group, Attach/Detach Instance, Import Groups CSV |
| **Membership** | Attach User to Group, Detach User From Group, Import Groups Members CSV |
| **Manager** | Attach Manager, Detach Manager |
| **Supplier** | Update Supplier, Delete Supplier |
| **Performance** | Import Assignment/Group Performances CSV, Upload Diploma |
| **Data**   | Get User Completion, Get Members Status, Get Groups, Get Meetings, Set Due Date |
| **Utility** | Test, Run Auto Enrollment Rules, Run Scheduled Imports, Remove Empty Org Units |

For a full list with implementation notes, see [COMPLETE_FEATURES_LIST.md](COMPLETE_FEATURES_LIST.md). For a quick API-style reference, see [docs/OPERATIONS.md](docs/OPERATIONS.md).

### User Resource

#### Get User
Retrieve a single user's details by identifier (External ID, User ID, User Name, or Identity Number).

**Required Fields:**
- Domain
- User Identifier Type (External ID, User ID, User Name, Identity Number)
- User Identifier Value

#### Update User
Create or update a user in Blossom.

**Required Fields:**
- External ID
- Domain
- Username (recommended)
- First Name (recommended)
- Last Name (recommended)

**Optional Fields:**
- Email
- Password
- Department
- Job Title
- Employee ID
- Company
- Birthday
- Custom Fields (field_1, field_2, etc.)

**Example:**
```json
{
  "domain": 1,
  "details": {
    "external_id": "u123",
    "username": "john.doe",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "department": "IT",
    "job_title": "Developer"
  }
}
```

#### Delete User
Delete a user by identifier (External ID, User ID, User Name, or Identity Number).

### Group Resource

#### Update Group
Create or update a group/workspace in Blossom.

**Group Types:**
- Group
- Course
- Role
- Org Unit (OU)
- Template
- Qualification
- Workplan

**Required Fields:**
- Domain
- External ID
- Name
- Type

**Optional Fields:**
- Description
- Open Date
- Close Date
- Passing Grade
- Parent External ID
- Template External ID
- Custom Fields

**Example:**
```json
{
  "domain": 1,
  "details": {
    "external_id": "g456",
    "name": "Safety Training Course",
    "type": "course",
    "description": "Mandatory safety training",
    "open_date": "2025-01-01",
    "close_date": "2025-12-31"
  }
}
```

#### Delete Group
Delete a group by identifier (External ID or Group ID).

### Membership Resource

#### Attach User to Group
Attach a user to a group/workspace.

**Required Fields:**
- Domain
- User External ID
- Group External ID

#### Detach User from Group
Detach a user from a group/workspace.

**Required Fields:**
- Domain
- User External ID
- Group External ID (optional - leave empty to detach from all OUs)

### Data Resource

#### Get User Completion
Retrieve user completion status for qualifications, courses, and assignments.

**Required Fields:**
- Domain
- Start Date
- End Date
- Types (Qualifications, Courses, Assignments)

**Optional Filters:**
- Group External ID
- Group ID
- User External ID
- User Name
- User ID
- Employee ID

**Example:**
```json
{
  "domain": 1,
  "start_date": "2020-01-01",
  "end_date": "2030-01-01",
  "types": "Courses,Qualifications",
  "filters": {
    "user_external_id": "u123"
  }
}
```

#### Get Members Status
Get member status in workspace(s).

**Required Fields:**
- Domain
- Group (with Group External ID, Group ID, or Group Type)

**Optional Fields:**
- Start Date (can use relative format like "-24 hours")

**Example:**
```json
{
  "domain": 1,
  "start_date": "-24 hours",
  "group": {
    "group_type": "course"
  }
}
```

#### Get Groups
Get list of groups/workspaces.

**Required Fields:**
- Domain

**Optional Filters:**
- Type (group, course, qualification, etc.)

## Usage Examples

### Example 1: Get a User

1. Add the Blossom node to your workflow
2. Select **Resource**: User
3. Select **Operation**: Get
4. Fill in:
   - Domain: `1`
   - User Identifier Type: `External ID`
   - User Identifier Value: `u123`

### Example 2: Create a User

1. Add the Blossom node to your workflow
2. Select **Resource**: User
3. Select **Operation**: Update
4. Fill in:
   - Domain: `1`
   - External ID: `u123`
   - Username: `john.doe`
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`

### Example 3: Attach User to Course

1. Add the Blossom node
2. Select **Resource**: Membership
3. Select **Operation**: Attach User to Group
4. Fill in:
   - Domain: `1`
   - User External ID: `u123`
   - Group External ID: `course_456`

### Example 4: Get User Completions

1. Add the Blossom node
2. Select **Resource**: Data
3. Select **Operation**: Get User Completion
4. Fill in:
   - Domain: `1`
   - Start Date: `2020-01-01`
   - End Date: `2030-01-01`
   - Types: Select `Courses` and `Qualifications`
   - Filters: User External ID = `u123`

## API Documentation

For complete API documentation, refer to:
- [Blossom API Documentation](https://docs.blossom-kc.com/api)
- Contact your Blossom administrator for instance-specific documentation

## Rate Limits

- **API Requests**: 30 requests per second
- **CSV Methods**: 4 calls per 24 hours each
- **RunAutoEnrollmentRules**: 4 calls per 24 hours

## Sync Workflow

When performing a complete sync, follow this order:

1. **Delete Users CSV** (if cleaning existing users)
2. **Import Users CSV** – bulk import users from CSV
3. **Import Groups CSV** – bulk import groups/workspaces from CSV
4. **Import Groups Members CSV** – bulk import group members from CSV
5. **Run Auto Enrollment Rules** (once at the end, limit: 4 calls per 24 hours)

CSV import operations require a binary file input (your CSV). Attach the file in the node or provide it from a previous node. Rate limit: 4 calls per 24 hours per CSV operation.

## External IDs

Blossom uses `external_id` as the primary identifier for synchronization with external systems. Always use `external_id` when possible for seamless integration.

## Error Handling

The node handles API errors gracefully:
- **Success Response**: `{"res": "success", "results": []}`
- **Error Response**: `{"res": "error", "error_msg": "Description"}`

Errors are automatically converted to n8n error format with appropriate messages.

## Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/HirezRa/n8n-nodes-blossom.git
cd n8n-nodes-blossom

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Testing Locally

```bash
# Start n8n with the node loaded
npm run dev
```

This will:
- Build the node with watch mode
- Start n8n with your node available
- Automatically rebuild when you make changes
- Open n8n in your browser (usually http://localhost:5678)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE.md)

## Support

For issues and questions:
- [GitHub Issues](https://github.com/HirezRa/n8n-nodes-blossom/issues)
- [n8n Community Forum](https://community.n8n.io/)

## About Blossom

Blossom is a Learning Management System (LMS) and Learning Experience Platform (LXP) established in 2007, supporting:
- SCORM and xAPI learning objects
- SAML2 single sign-on (SSO)
- Multi-factor authentication (MFA)
- IP-restricted API access
- Integration with HR systems, MS Teams, Google Workspace

For more information, visit: [Blossom Platform](https://www.blossom-kc.com)

---

**Maintained by the n8n community**
