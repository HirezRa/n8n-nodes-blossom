# n8n-nodes-blossom

A comprehensive n8n community node for integrating with Blossom Learning Management System (LMS) API. This node provides full access to the Blossom Sync API V2, supporting all operations for users, groups, memberships, utilities, suppliers, and performance data.

## Features

- **Complete API Coverage**: Supports all Blossom Sync API V2 operations
- **Multiple Authentication Methods**: Basic Auth, API Key, JWT, and OAuth 2.0
- **CSV Import/Export**: Bulk operations for users, groups, and performance data
- **File Upload Support**: Avatar images, diploma files, and CSV imports
- **Generic API Access**: Make custom requests to any Blossom endpoint
- **Comprehensive Error Handling**: Detailed error messages and validation

## Installation

```bash
npm install n8n-nodes-blossom
```

### Important Note for Existing Users

If you already have an older version installed and are experiencing issues with updates, you may need to:

1. **Clear npm cache** (if getting 404 errors):
   ```bash
   npm cache clean --force
   ```

2. **Uninstall the old version**:
   ```bash
   npm uninstall n8n-nodes-blossom
   ```

3. **Install the latest version**:
   ```bash
   npm install n8n-nodes-blossom@latest
   ```

4. **If still having issues, try installing specific version**:
   ```bash
   npm install n8n-nodes-blossom@2.0.0
   ```

**Note**: Older versions (1.1.1 and below) were removed from NPM for security reasons. If you're getting 404 errors, it means n8n is trying to download a version that no longer exists.

## Authentication

The node supports multiple authentication methods:

### Basic Authentication
- **Username**: Your Blossom username
- **Password**: Your Blossom password
- **Base URL**: Your Blossom instance URL (e.g., `https://blossom-kc.com/`)

### API Key Authentication
- **API Key**: Your Blossom API key
- **Base URL**: Your Blossom instance URL

### JWT Authentication
- **JWT Token**: JWT token generated with payload: `{"iss":"<user_name>","exp":<unix_timestamp>}`
- **Base URL**: Your Blossom instance URL

### OAuth 2.0 Authentication
- **OAuth 2.0 Token**: Access token obtained from `{{baseUrl}}/WebServices/sync_2?auth_token`
- **Base URL**: Your Blossom instance URL

## Available Operations

### User Management
- **Update User**: Create or update user with full profile details
- **Import Users CSV**: Bulk import users from CSV/Excel files
- **Delete User**: Delete a single user (soft delete)
- **Delete Users CSV**: Bulk delete users from CSV/Excel files
- **Set Avatar**: Upload or remove user avatar (JPG/PNG)

### Group Management
- **Update Group**: Create or update groups, courses, roles, organizational units, templates, qualifications, and workplans
- **Import Groups CSV**: Bulk import groups from CSV/Excel files
- **Delete Group**: Delete a group object
- **Attach Sub Group**: Attach sub group to parent group
- **Detach Sub Group**: Detach sub group from parent
- **Attach Instance**: Attach group/course to template
- **Detach Instance**: Detach group/course from template

### Membership Management
- **Attach User to Group**: Add user to group, course, OU, qualification, or workplan
- **Detach User from Group**: Remove user from group
- **Detach User from OU**: Remove user from organizational unit
- **Import Groups Members CSV**: Bulk attach users to groups via CSV
- **Attach Manager**: Add manager to group with permissions
- **Detach Manager**: Remove manager from group

### Utility Functions
- **Test**: Test API connection and get random number
- **Run Auto Enrollment Rules**: Execute auto enrollment for all workspaces and users
- **Run Scheduled Imports**: Execute scheduled imports from SFTP or local folder
- **Remove Empty Org Units**: Delete empty organizational units
- **User Authorities**: Set HR manager, professional manager, coach, and supervisor
- **Power Manager**: Set/unset user as power manager
- **Upload Diploma**: Upload or remove diploma file for user in group

### Supplier Management
- **Update Supplier**: Create or update supplier by external ID
- **Delete Supplier**: Delete supplier by external ID

### Performance Management
- **Import Assignment Performances CSV**: Import assignment performance data
- **Import Group Performances CSV**: Import group performance data for qualifications and courses

### Generic API
- **Make Request**: Make custom API requests to any Blossom endpoint

## Usage Examples

### 1. Create a New User

```json
{
  "resource": "User",
  "operation": "updateUser",
  "domain": "1",
  "details": {
    "external_id": "user123",
    "username": "john.doe",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@company.com",
    "password": "securePassword123",
    "birthday": "1990-01-15",
    "job_title": "Software Developer",
    "department": "IT"
  }
}
```

### 2. Import Users from CSV

```json
{
  "resource": "User",
  "operation": "importUsersCSV",
  "domain": "1",
  "options": {
    "keep_old_values": "1",
    "temp_password": "0",
    "new_user_notification": "1"
  },
  "sheet_file": {
    "value": "csv_content_here",
    "options": {
      "filename": "users.csv",
      "contentType": "text/csv"
    }
  }
}
```

### 3. Create a Group/Course

```json
{
  "resource": "Group",
  "operation": "updateGroup",
  "domain": "1",
  "details": {
    "external_id": "course456",
    "name": "Advanced JavaScript",
    "type": "course",
    "description": "Learn advanced JavaScript concepts",
    "open_date": "2024-02-01",
    "close_date": "2024-03-01",
    "passing_grade": "80"
  }
}
```

### 4. Attach User to Group

```json
{
  "resource": "Membership",
  "operation": "attachUserToGroup",
  "domain": "1",
  "user_identifier": {
    "external_id": "user123"
  },
  "group_identifier": {
    "external_id": "course456"
  }
}
```

### 5. Upload User Avatar

```json
{
  "resource": "User",
  "operation": "setAvatar",
  "domain": "1",
  "user_identifier": {
    "external_id": "user123"
  },
  "remove_avatar": "0",
  "avatarfile": {
    "value": "binary_image_data",
    "options": {
      "filename": "avatar.jpg",
      "contentType": "image/jpeg"
    }
  }
}
```

### 6. Test API Connection

```json
{
  "resource": "Utility",
  "operation": "test"
}
```

## CSV Import Templates

### Users CSV Template
Required columns: `external_id`, `username`, `firstname`, `lastname`, `email`
Optional columns: `password`, `birthday`, `job_title`, `department`, `company`, `address`, `city`, `zip`, `bphone`, `hphone`, `mphone`, `gender`, `employment_date`, `about`, `user_nt`, `disabled`, `חטיבה`, `קבלן שטח`, `קבלן משרדי`

### Groups CSV Template
Required columns: `external_id`, `name`, `type`
Optional columns: `description`, `open_date`, `close_date`, `passing_grade`, `gathering_area`, `location`, `audience`, `estimated_budget`, `publish_grades_criteria`, `publish_grades_on_add`, `hide_score`, `hide_from_members`, `hide_from_user_profile`, `parent_external_id`, `template_external_id`, `classification`

### Group Members CSV Template
Required columns: `user_external_id` (or `user_id`), `workspace_external_id` (or `group_id`)
Optional columns: `manager_external_id`, `manager_type`

## Error Handling

The node provides comprehensive error handling with detailed error messages:

- **API Errors**: Returns specific error messages from the Blossom API
- **Validation Errors**: Validates required parameters before making requests
- **File Upload Errors**: Handles file format and size validation
- **Authentication Errors**: Clear messages for authentication failures

## Rate Limits

- **CSV Operations**: Maximum 4 calls per 24 hours
- **General API**: 30 requests per second
- **Scheduled Operations**: Run outside working hours for best performance

## What's Included

This starter repository includes two example nodes to learn from:

- **[Example Node](nodes/Example/)** - A simple starter node that shows the basic structure with a custom `execute` method
- **[GitHub Issues Node](nodes/GithubIssues/)** - A complete, production-ready example built using the **declarative style**:
  - **Low-code approach** - Define operations declaratively without writing request logic
  - Multiple resources (Issues, Comments)
  - Multiple operations (Get, Get All, Create)
  - Two authentication methods (OAuth2 and Personal Access Token)
  - List search functionality for dynamic dropdowns
  - Proper error handling and typing
  - Ideal for HTTP API-based integrations

> [!TIP]
> The declarative/low-code style (used in GitHub Issues) is the recommended approach for building nodes that interact with HTTP APIs. It significantly reduces boilerplate code and handles requests automatically.

Browse these examples to understand both approaches, then modify them or create your own.

## Finding Inspiration

Looking for more examples? Check out these resources:

- **[npm Community Nodes](https://www.npmjs.com/search?q=keywords:n8n-community-node-package)** - Browse thousands of community-built nodes on npm using the `n8n-community-node-package` tag
- **[n8n Built-in Nodes](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes)** - Study the source code of n8n's official nodes for production-ready patterns and best practices
- **[n8n Credentials](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/credentials)** - See how authentication is implemented for various services

These are excellent resources to understand how to structure your nodes, handle different API patterns, and implement advanced features.

## Prerequisites

Before you begin, install the following on your development machine:

### Required

- **[Node.js](https://nodejs.org/)** (v22 or higher) and npm
  - Linux/Mac/WSL: Install via [nvm](https://github.com/nvm-sh/nvm)
  - Windows: Follow [Microsoft's NodeJS guide](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
- **[git](https://git-scm.com/downloads)**

### Recommended

- Follow n8n's [development environment setup guide](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/)

> [!NOTE]
> The `@n8n/node-cli` is included as a dev dependency and will be installed automatically when you run `npm install`. The CLI includes n8n for local development, so you don't need to install n8n globally.

## Getting Started with this Starter

Follow these steps to create your own n8n community node package:

### 1. Create Your Repository

[Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template, then clone it:

```bash
git clone https://github.com/<your-organization>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required dependencies including the `@n8n/node-cli`.

### 3. Explore the Examples

Browse the example nodes in [nodes/](nodes/) and [credentials/](credentials/) to understand the structure:

- Start with [nodes/Example/](nodes/Example/) for a basic node
- Study [nodes/GithubIssues/](nodes/GithubIssues/) for a real-world implementation

### 4. Build Your Node

Edit the example nodes to fit your use case, or create new node files by copying the structure from [nodes/Example/](nodes/Example/).

> [!TIP]
> If you want to scaffold a completely new node package, use `npm create @n8n/node` to start fresh with the CLI's interactive generator.

### 5. Configure Your Package

Update `package.json` with your details:

- `name` - Your package name (must start with `n8n-nodes-`)
- `author` - Your name and email
- `repository` - Your repository URL
- `description` - What your node does

Make sure your node is registered in the `n8n.nodes` array.

### 6. Develop and Test Locally

Start n8n with your node loaded:

```bash
npm run dev
```

This command runs `n8n-node dev` which:

- Builds your node with watch mode
- Starts n8n with your node available
- Automatically rebuilds when you make changes
- Opens n8n in your browser (usually http://localhost:5678)

You can now test your node in n8n workflows!

> [!NOTE]
> Learn more about CLI commands in the [@n8n/node-cli documentation](https://www.npmjs.com/package/@n8n/node-cli).

### 7. Lint Your Code

Check for errors:

```bash
npm run lint
```

Auto-fix issues when possible:

```bash
npm run lint:fix
```

### 8. Build for Production

When ready to publish:

```bash
npm run build
```

This compiles your TypeScript code to the `dist/` folder.

### 9. Prepare for Publishing

Before publishing:

1. **Update documentation**: Replace this README with your node's documentation. Use [README_TEMPLATE.md](README_TEMPLATE.md) as a starting point.
2. **Update the LICENSE**: Add your details to the [LICENSE](LICENSE.md) file.
3. **Test thoroughly**: Ensure your node works in different scenarios.

### 10. Publish to npm

Publish your package to make it available to the n8n community:

```bash
npm publish
```

Learn more about [publishing to npm](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

### 11. Submit for Verification (Optional)

Get your node verified for n8n Cloud:

1. Ensure your node meets the [requirements](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/):
   - Uses MIT license ✅ (included in this starter)
   - No external package dependencies
   - Follows n8n's design guidelines
   - Passes quality and security review

2. Submit through the [n8n Creator Portal](https://creators.n8n.io/nodes)

**Benefits of verification:**

- Available directly in n8n Cloud
- Discoverable in the n8n nodes panel
- Verified badge for quality assurance
- Increased visibility in the n8n community

## Available Scripts

This starter includes several npm scripts to streamline development:

| Script                | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `npm run dev`         | Start n8n with your node and watch for changes (runs `n8n-node dev`) |
| `npm run build`       | Compile TypeScript to JavaScript for production (runs `n8n-node build`) |
| `npm run build:watch` | Build in watch mode (auto-rebuild on changes)                    |
| `npm run lint`        | Check your code for errors and style issues (runs `n8n-node lint`) |
| `npm run lint:fix`    | Automatically fix linting issues when possible (runs `n8n-node lint --fix`) |
| `npm run release`     | Create a new release (runs `n8n-node release`)                   |

> [!TIP]
> These scripts use the [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli) under the hood. You can also run CLI commands directly, e.g., `npx n8n-node dev`.

## Troubleshooting

### My node doesn't appear in n8n

1. Make sure you ran `npm install` to install dependencies
2. Check that your node is listed in `package.json` under `n8n.nodes`
3. Restart the dev server with `npm run dev`
4. Check the console for any error messages

### Linting errors

Run `npm run lint:fix` to automatically fix most common issues. For remaining errors, check the [n8n node development guidelines](https://docs.n8n.io/integrations/creating-nodes/).

### TypeScript errors

Make sure you're using Node.js v22 or higher and have run `npm install` to get all type definitions.

## Resources

- **[n8n Node Documentation](https://docs.n8n.io/integrations/creating-nodes/)** - Complete guide to building nodes
- **[n8n Community Forum](https://community.n8n.io/)** - Get help and share your nodes
- **[@n8n/node-cli Documentation](https://www.npmjs.com/package/@n8n/node-cli)** - CLI tool reference
- **[n8n Creator Portal](https://creators.n8n.io/nodes)** - Submit your node for verification
- **[Submit Community Nodes Guide](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/)** - Verification requirements and process

## Contributing

Have suggestions for improving this starter? [Open an issue](https://github.com/n8n-io/n8n-nodes-starter/issues) or submit a pull request!

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
