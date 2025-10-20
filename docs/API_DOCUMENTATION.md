# Blossom API Documentation

## Overview

This document provides comprehensive documentation for the Blossom Sync API V2 integration with n8n. The API allows you to manage users, groups, memberships, and other resources in your Blossom Learning Management System.

## Base URL

All API endpoints are relative to your Blossom instance base URL:

```
https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2
```

Replace `YOUR-COMPANY` with your organization's subdomain.

## Authentication

The API supports multiple authentication methods:

### Basic Authentication
- **Username**: Your API user credentials (not your login credentials)
- **Password**: Your API user password (not your login password)
- **Domain**: Domain name or ID (e.g., '1' or 'company-name')

### API Key Authentication
- **API Key**: Your Blossom API key

### JWT Authentication
- **JWT Token**: JWT token generated with payload: `{"iss":"<user_name>","exp":<unix_timestamp>}`

### OAuth 2.0 Authentication
- **OAuth 2.0 Token**: Access token obtained from `{{baseUrl}}/WebServices/sync_2?auth_token`

## Rate Limits

- **API Calls**: Maximum 30 requests per second
- **CSV Import Methods**: Maximum 4 calls per 24 hours per method
- **System Operations**: Maximum 4 calls per 24 hours

## Endpoints

### Users

#### Update User
**POST** `/UpdateUser`

Create or update user with full profile details.

**Request Body:**
```json
{
  "domain": "1",
  "details": {
    "external_id": "user123",
    "username": "john.doe",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@company.com",
    "password": "SecurePass123!",
    "gender": "M",
    "birthday": "1990-05-15",
    "employee_id": "EMP001",
    "company": "Tech Corp",
    "department": "Engineering",
    "job_title": "Senior Developer",
    "employment_date": "2024-01-15",
    "address": "123 Main Street",
    "city": "New York",
    "zip": "10001",
    "mphone": "+1-555-0100",
    "bphone": "+1-555-0101",
    "hphone": "+1-555-0102",
    "user_nt": "DOMAIN\\johndoe",
    "about": "Experienced developer",
    "disabled": false
  }
}
```

**Response:**
```json
{
  "res": "success",
  "message": "User updated successfully"
}
```

#### Get User
**GET** `/GetUser/{domain}/{identifier}`

Get user details by identifier.

**Parameters:**
- `domain`: Domain name or ID
- `identifier`: User identifier (external_id, user_id, username, identity_num)

**Response:**
```json
{
  "res": "success",
  "user": {
    "external_id": "user123",
    "username": "john.doe",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@company.com",
    "gender": "M",
    "birthday": "1990-05-15",
    "employee_id": "EMP001",
    "company": "Tech Corp",
    "department": "Engineering",
    "job_title": "Senior Developer",
    "employment_date": "2024-01-15",
    "address": "123 Main Street",
    "city": "New York",
    "zip": "10001",
    "mphone": "+1-555-0100",
    "bphone": "+1-555-0101",
    "hphone": "+1-555-0102",
    "user_nt": "DOMAIN\\johndoe",
    "about": "Experienced developer",
    "disabled": false
  }
}
```

#### Delete User
**POST** `/DeleteUser`

Delete a user (soft delete).

**Request Body:**
```json
{
  "domain": "1",
  "user_identifier": {
    "external_id": "user123"
  }
}
```

**Response:**
```json
{
  "res": "success",
  "message": "User deleted successfully"
}
```

#### Import Users CSV
**POST** `/ImportUsersCSV/{domain}/{options}`

Import multiple users using CSV/Excel files.

**Parameters:**
- `domain`: Domain name or ID
- `options`: Query parameters for import options

**Form Data:**
- `sheet_file`: CSV/Excel file

**Options:**
- `keep_old_values`: Empty cells won't erase current values (1/0)
- `temp_password`: Set temporary password for new users (1/0)
- `new_user_notification`: Send user details by mail (1/0)
- `password_not_required`: Don't require password for new users (1/0)
- `clean_ou`: Remove empty org units (1/0)
- `manager_ou`: Create org unit tree based on management relation (1/0)

**Response:**
```json
{
  "res": "success",
  "results": [
    {
      "row": 2,
      "res": "success",
      "username": "user1",
      "issues": []
    }
  ]
}
```

### Groups

#### Update Group
**POST** `/UpdateGroup`

Create or update group object.

**Request Body:**
```json
{
  "domain": "1",
  "details": {
    "external_id": "group123",
    "name": "Engineering Team",
    "description": "Software engineering team",
    "type": "group",
    "open_date": "2024-01-15",
    "close_date": "2024-12-31",
    "passing_grade": 80,
    "gathering_area": "Office",
    "location": "New York",
    "audience": "Employees",
    "estimated_budget": 50000,
    "publish_grades_criteria": "on_completion",
    "publish_grades_on_add": false,
    "hide_score": false,
    "hide_from_members": false,
    "hide_from_user_profile": false,
    "parent_external_id": "parent123",
    "template_external_id": "template123",
    "classification": "Internal"
  }
}
```

**Response:**
```json
{
  "res": "success",
  "message": "Group updated successfully"
}
```

#### Get Group
**GET** `/GetGroup/{domain}/{identifier}`

Get group details by identifier.

**Parameters:**
- `domain`: Domain name or ID
- `identifier`: Group identifier (group_id, group_external_id)

**Response:**
```json
{
  "res": "success",
  "group": {
    "external_id": "group123",
    "name": "Engineering Team",
    "description": "Software engineering team",
    "type": "group",
    "open_date": "2024-01-15",
    "close_date": "2024-12-31",
    "passing_grade": 80,
    "gathering_area": "Office",
    "location": "New York",
    "audience": "Employees",
    "estimated_budget": 50000,
    "publish_grades_criteria": "on_completion",
    "publish_grades_on_add": false,
    "hide_score": false,
    "hide_from_members": false,
    "hide_from_user_profile": false,
    "parent_external_id": "parent123",
    "template_external_id": "template123",
    "classification": "Internal"
  }
}
```

#### Delete Group
**POST** `/DeleteGroup`

Delete a group object.

**Request Body:**
```json
{
  "domain": "1",
  "group_identifier": {
    "group_external_id": "group123"
  }
}
```

**Response:**
```json
{
  "res": "success",
  "message": "Group deleted successfully"
}
```

### Memberships

#### Attach User to Group
**POST** `/AttachUserToGroup`

Attach user to group object.

**Request Body:**
```json
{
  "domain": "1",
  "user_identifier": {
    "external_id": "user123"
  },
  "group_identifier": {
    "group_external_id": "group123"
  }
}
```

**Response:**
```json
{
  "res": "success",
  "message": "User attached to group successfully"
}
```

#### Detach User from Group
**POST** `/DetachUserFromGroup`

Detach user from group object.

**Request Body:**
```json
{
  "domain": "1",
  "user_identifier": {
    "external_id": "user123"
  },
  "group_identifier": {
    "group_external_id": "group123"
  }
}
```

**Response:**
```json
{
  "res": "success",
  "message": "User detached from group successfully"
}
```

### Utilities

#### Test
**GET** `/Test`

Test API connection and get random number.

**Response:**
```json
{
  "res": "success",
  "protocol": "https",
  "random": 12345
}
```

#### Run Auto Enrollment Rules
**POST** `/RunAutoEnrollmentRules`

Execute auto enrollment rules for all workspaces and users.

**Request Body:**
```json
{
  "domain": "1"
}
```

**Response:**
```json
{
  "res": "success",
  "message": "Auto enrollment rules executed successfully"
}
```

#### Run Scheduled Imports
**POST** `/RunScheduledImports`

Execute scheduled imports from SFTP or local folder.

**Request Body:**
```json
{
  "domain": "1"
}
```

**Response:**
```json
{
  "res": "success",
  "message": "Scheduled imports executed successfully"
}
```

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "res": "error",
  "error_msg": "Authentication failed"
}
```

#### 404 Not Found
```json
{
  "res": "error",
  "error_msg": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "res": "error",
  "error_msg": "Internal server error"
}
```

### Validation Errors

#### Missing Required Fields
```json
{
  "res": "error",
  "error_msg": "Cannot continue, the following fields are missing: username, email"
}
```

#### Invalid Data
```json
{
  "res": "success",
  "results": [
    {
      "row": 2,
      "res": "error",
      "status_error": "invalid data",
      "username": "user1",
      "issues": [
        {
          "type": "error",
          "col_name": "email",
          "message": "Invalid email format"
        }
      ]
    }
  ]
}
```

## Best Practices

1. **Always use external_id** for identifying objects across systems
2. **Handle errors gracefully** and provide meaningful error messages
3. **Respect rate limits** to avoid API throttling
4. **Use batch operations** when processing multiple items
5. **Validate data** before sending to the API
6. **Use appropriate authentication** method for your use case
7. **Test connections** before performing operations
8. **Monitor API responses** for success/failure status

## Examples

### Complete User Management Workflow

1. **Create User**
2. **Set Avatar**
3. **Add to Group**
4. **Set Authorities**
5. **Test Connection**

### Batch Operations

1. **Import Users CSV**
2. **Import Groups CSV**
3. **Import Group Members CSV**
4. **Run Auto Enrollment Rules**

### Error Handling

1. **Check API Response**
2. **Handle Validation Errors**
3. **Retry Failed Operations**
4. **Log Errors for Debugging**
