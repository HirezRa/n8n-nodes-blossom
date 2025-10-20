# Blossom API Integration Guide for N8N

## Overview
Complete integration guide for Blossom Sync API V2 with N8N workflows. All methods and parameters verified against official API documentation.

## API Configuration

### Base Configuration
```javascript
const config = {
  baseURL: 'https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2',
  authentication: 'basic',
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  domain: 'YOUR_DOMAIN' // domain name or id (e.g., '1')
};
```

### Rate Limits
- **API Calls**: Maximum 30 requests per second
- **CSV Methods**: Maximum 4 calls per 24 hours
  - DeleteUsersCSV
  - ImportUsersCSV
  - ImportGroupsCSV
  - ImportGroupsMembersCSV
  - RunAutoEnrollmentRules
  - RunScheduledImports

---

## 1. User Operations

### 1.1 UpdateUser - Create or Update User

**Available Fields (from API documentation):**
`external_id, username, firstname, lastname, password, id, employee_id, email, gender, company, department, employment_date, job_title, about, address, city, zip, birthday, bphone, hphone, mphone, user_nt, disabled, חטיבה, קבלן שטח, קבלן משרדי`

**Date Format:** `yyyy-mm-dd`  
**Checkbox Format:** `1` or `0`

```javascript
// N8N HTTP Request Node - POST
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UpdateUser",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "application/json"
  },
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "details": {
      "external_id": "a123",
      "username": "billy",
      "password": "secret12",
      "firstname": "Billy",
      "lastname": "Joel",
      "birthday": "1949-05-09"
    }
  }
}
```

**Complete Example with All Available Fields:**
```javascript
{
  "domain": "1",
  "details": {
    "external_id": "a123",
    "username": "john.doe",
    "firstname": "John",
    "lastname": "Doe",
    "password": "Pass123!",
    "id": "",
    "employee_id": "EMP001",
    "email": "john@company.com",
    "gender": "M",
    "company": "Tech Corp",
    "department": "Engineering",
    "employment_date": "2024-01-15",
    "job_title": "Developer",
    "about": "Bio text",
    "address": "123 Main St",
    "city": "New York",
    "zip": "10001",
    "birthday": "1990-05-15",
    "bphone": "555-0101",
    "hphone": "555-0102",
    "mphone": "555-0100",
    "user_nt": "DOMAIN\\john",
    "disabled": 0,
    "חטיבה": "Development",
    "קבלן שטח": "Main Office",
    "קבלן משרדי": "HQ Building"
  }
}
```

**Custom Fields:**
- By name: `"Field Name": "value"`
- By ID: `"field_12": "value"`
- By key: `"field_key": "value"` (if set)

### 1.2 ImportUsersCSV - Bulk Import Users

**Available Options:**
- `keep_old_values` - [1/0] Empty cells won't erase existing values
- `temp_password` - [1/0] Set temporary password for new users
- `new_user_notification` - [1/0] Send credentials by email
- `password_not_required` - [1/0] For SSO only
- `clean_ou` - [1/0] Remove empty org units (only with manager_ou=1)
- `manager_ou` - [1/0] Create org unit tree based on management

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportUsersCSV/1/password_not_required=1",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "sheet_file": "={{$binary.data}}"
  }
}
```

**CSV Template - Basic:**
```csv
external_id,username,firstname,lastname,email,password,disabled
a123,john.doe,John,Doe,john@company.com,Pass123!,0
```

**CSV Template - With Manager OU:**
When `manager_ou=1`, add these columns:
```csv
external_id,username,firstname,lastname,email,manager_ou,ou_name
a123,john.doe,John,Doe,john@company.com,a124,Engineering Team
a124,alice.brown,Alice,Brown,alice@company.com,,Management
```

### 1.3 DeleteUser - Delete Single User

**User Identifier Options:**
- `user_id=123`
- `user_name=abc`
- `identity_num=123`
- `external_id=a123`

```javascript
// N8N HTTP Request Node - POST
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteUser",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    }
  }
}

// GET method
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteUser/1/external_id=a123",
  "authentication": "basicAuth"
}
```

**Note:** Deletion is "soft delete" - users remain in database. Updating a deleted user will restore them.

### 1.4 DeleteUsersCSV - Bulk Delete Users

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteUsersCSV/1",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "sheet_file": "={{$binary.data}}"
  }
}
```

**CSV Template:**
```csv
external_id
a123
a124
```

### 1.5 AvatarSet - Update User Avatar

**Parameters:**
- `remove_avatar`: `0` (upload) or `1` (remove)
- File field: `avatarfile` (JPG/PNG)

```javascript
// Upload Avatar
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AvatarSet/1/external_id=a123/0",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "avatarfile": "={{$binary.avatar}}"
  }
}

// Remove Avatar
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AvatarSet/1/external_id=a123/1",
  "authentication": "basicAuth"
}
```

---

## 2. Group/Workspace Operations

### 2.1 UpdateGroup - Create or Update Group

**Available Fields (from API documentation):**
`name, description, external_id, open_date, close_date, passing_grade, gathering_area, location, audience, estimated_budget, publish_grades_criteria, publish_grades_on_add, hide_score, hide_from_members, hide_from_user_profile, parent_external_id, template_external_id, classification`

**Group Types:**
`course, group, role, ou, template, qualification, workplan`

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UpdateGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "details": {
      "external_id": "a456",
      "name": "group_name",
      "type": "course",
      "description": "The course description",
      "open_date": "2021-01-20"
    }
  }
}
```

**Complete Example:**
```javascript
{
  "domain": "1",
  "details": {
    "external_id": "a456",
    "name": "JavaScript Course",
    "type": "course",
    "description": "Learn JavaScript",
    "open_date": "2024-01-15",
    "close_date": "2024-12-31",
    "passing_grade": 70,
    "gathering_area": "Room 301",
    "location": "Building A",
    "audience": "Developers",
    "estimated_budget": 5000,
    "publish_grades_criteria": "on_completion",
    "publish_grades_on_add": 0,
    "hide_score": 0,
    "hide_from_members": 0,
    "hide_from_user_profile": 0,
    "parent_external_id": "parent_id",
    "template_external_id": "template_id",
    "classification": "Technical"
  }
}
```

### 2.2 ImportGroupsCSV - Bulk Import Groups

**Available Options:**
- `keep_old_values` - [1/0] Empty cells won't erase existing values
- `manager_type` - Manager permissions name OR 'all'/'none'
- `override_existing_permissions` - [1/0] Override existing permissions
- `remove_existing_managers` - [1/0] Remove existing managers
- `set_primary_manager` - [1/0] Set as primary manager

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportGroupsCSV/1/keep_old_values=1&manager_type=all&override_existing_permissions=0&remove_existing_managers=0&set_primary_manager=0",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "sheet_file": "={{$binary.data}}"
  }
}
```

**CSV Template:**
```csv
group_external_id,group_name,group_type,description
a456,JavaScript Course,course,Learn JS
```

### 2.3 DeleteGroup - Delete Group

**Group Identifier Options:**
- `group_id=123`
- `group_external_id=a456`

```javascript
// N8N HTTP Request Node - POST
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "group_identifier": {
      "group_id": "123"
    }
  }
}

// GET method
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteGroup/1/group_id=123",
  "authentication": "basicAuth"
}
```

---

## 3. Hierarchical Operations

### 3.1 AttachSubGroup - Attach Subgroup to Parent

**Note:** Both groups must be of the same type (Group/Course/OU)

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AttachSubGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "sub_group_identifier": {
      "group_id": "123"
    },
    "parent_group_identifier": {
      "group_id": "456"
    }
  }
}
```

### 3.2 DetachSubGroup - Detach from Parent

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DetachSubGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "group_identifier": {
      "group_id": "123"
    }
  }
}
```

### 3.3 AttachInstance - Attach Group/Course to Template

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AttachInstance",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "group_identifier": {
      "group_id": "123"
    },
    "template_identifier": {
      "group_id": "789"
    }
  }
}
```

### 3.4 DetachInstance - Detach from Template

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DetachInstance",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "group_identifier": {
      "group_id": "123"
    }
  }
}
```

---

## 4. User-Group Relationships

### 4.1 AttachUserToGroup - Attach User to Group

**Works for:** Group, Course, OU, Qualification, Workplan

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AttachUserToGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "group_identifier": {
      "group_id": "123"
    }
  }
}
```

### 4.2 ImportGroupsMembersCSV - Bulk Attach Users to Groups

**Available Options:**
- `clean_ou` - [1/0] Remove empty org units

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportGroupsMembersCSV/1/clean_ou=1",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "sheet_file": "={{$binary.data}}"
  }
}
```

**CSV Template:**
```csv
user_external_id,workspace_external_id
a123,a456
a124,a456
```

### 4.3 DetachUserFromGroup - Detach User from Group

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DetachUserFromGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "group_identifier": {
      "group_id": "123"
    }
  }
}
```

### 4.4 DetachUserFromOu - Detach User from OU

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DetachUserFromOu",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    }
  }
}
```

---

## 5. Manager Operations

### 5.1 AttachManager - Attach Manager to Group

**Works for:** Group, Course, Role, OU, Template, Qualification, Workplan

**Parameters:**
- `manager_type`: Permission name OR 'all'/'none'
- `set_primary`: 
  - `0` = regular manager
  - `1` = set as primary
  - `2` = remove existing and set as primary

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AttachManager",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "group_identifier": {
      "group_id": "123"
    },
    "manager_type": "all",
    "set_primary": "0"
  }
}
```

### 5.2 DetachManager - Detach Manager from Group

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DetachManager",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "group_identifier": {
      "group_id": "123"
    }
  }
}
```

### 5.3 UserAuthorities - Set User Authorities

**Available Authority Fields:**
- `user_hr_manager_id` - Human resources coordinator
- `user_professional_manager_id` - Professional manager
- `user_coach_id` - Personal coach
- `user_auth_supervisor_id` - Supervisor

**Note:** To clear, pass empty value. Fields not included will not change.

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UserAuthorities",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "authorities": {
      "user_hr_manager_id": "a007",
      "user_professional_manager_id": "a007",
      "user_coach_id": "a007",
      "user_auth_supervisor_id": "a007"
    }
  }
}

// Using user_id identifier
{
  "domain": "1",
  "user_identifier": {"external_id": "a123"},
  "authorities": {
    "user_hr_manager_id": "user_id=1234"
  }
}

// Clear authority
{
  "domain": "1",
  "user_identifier": {"external_id": "a123"},
  "authorities": {
    "user_coach_id": ""
  }
}
```

### 5.4 PowerManager - Set/Unset Power Manager

**Type Values:**
- `PowerManager` - Grant power manager role
- `User` - Revoke power manager role

```javascript
// Grant Power Manager
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/PowerManager",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "type": "PowerManager"
  }
}

// Revoke Power Manager
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/PowerManager",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    },
    "type": "User"
  }
}
```

---

## 6. Performance and Grades

### 6.1 ImportAssignmentPerformancesCSV - Import Assignment Grades

**Note:** File must contain column `user_name` OR `user_external_id`

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportAssignmentPerformancesCSV/1",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "sheet_file": "={{$binary.data}}"
  }
}
```

**CSV Template:**
```csv
user_name,assignment_id,date,grade,completed
Michal_PM,ASSIGN001,20/01/2015,90,Yes
```

### 6.2 ImportGroupPerformancesCSV - Import Course/Qualification Grades

**Note:** File must contain column `user_name` OR `user_external_id`

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportGroupPerformancesCSV/1",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "sheet_file": "={{$binary.data}}"
  }
}
```

### 6.3 UploadDiploma - Upload Diploma File

**Parameters:**
- `remove_diploma`: `0` (upload) or `1` (remove)
- File field: `diploma_file`

```javascript
// Upload Diploma
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UploadDiploma/1/external_id=a123/group_id=123/0",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "multipart/form-data"
  },
  "sendBody": true,
  "bodyParameters": {
    "diploma_file": "={{$binary.certificate}}"
  }
}

// Remove Diploma
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UploadDiploma/1/external_id=a123/group_id=123/1",
  "authentication": "basicAuth"
}
```

---

## 7. Supplier Management

### 7.1 UpdateSupplier - Create or Update Supplier

**Type:** `RegExt` (for external event institutions)

**Available Fields:**
`name, address, email, phone, fax, contact, business_number, supplier_number, external_id`

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UpdateSupplier",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "type": "RegExt",
    "details": {
      "external_id": "abcd",
      "name": "Elton John",
      "address": "Old Windsor",
      "phone": "123-456",
      "email": "elton@example.com",
      "contact": "John Reid",
      "business_number": "12345"
    }
  }
}
```

### 7.2 DeleteSupplier - Delete Supplier

```javascript
// N8N HTTP Request Node - POST
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteSupplier",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "ext_id": "abcd"
  }
}

// GET method
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteSupplier/1/abcd",
  "authentication": "basicAuth"
}
```

---

## 8. System Operations

### 8.1 RunAutoEnrollmentRules

**Important:**
- Execute auto enrollment rules for all workspaces and users
- Call after updating users and workspaces
- Only call outside working hours (may take time)
- Max 4 calls per 24 hours

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RunAutoEnrollmentRules",
  "authentication": "basicAuth"
}
```

### 8.2 RunScheduledImports

**Important:**
- Execute scheduled imports from SFTP or local folder
- Cannot run at midnight (scheduled imports run automatically)
- Max 4 calls per 24 hours

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RunScheduledImports",
  "authentication": "basicAuth"
}
```

### 8.3 RemoveEmptyOrgUnits

**Description:** Delete org units with no members, managers, or relevant hierarchy. Same as `clean_ou=1` in ImportGroupsMembersCSV and ImportUsersCSV.

```javascript
// N8N HTTP Request Node - POST
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RemoveEmptyOrgUnits",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1"
  }
}

// GET method
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RemoveEmptyOrgUnits/1",
  "authentication": "basicAuth"
}
```

### 8.4 Test - Test API Connection

```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/Test",
  "authentication": "basicAuth"
}

// Expected Response:
{
  "protocol": "...",
  "random_number": 12345
}
```

---

## 9. Response Handling

### 9.1 Success Response - No Issues
```json
{
  "res": "success",
  "results": []
}
```

### 9.2 Critical Error Response
```json
{
  "res": "error",
  "error_msg": "Cannot continue, the following fields are missing: something, mandatory"
}
```

### 9.3 Row-Level Errors
```json
{
  "res": "success",
  "results": [
    {
      "row": 2,
      "res": "error",
      "status_error": "invalid data",
      "username": "cumberbatch",
      "issues": [
        {
          "type": "error",
          "col_name": "user_name",
          "message": "This login name is already being used by: Benedict Cumberbatch #1234 domain: 1"
        }
      ]
    }
  ]
}
```

### 9.4 Row-Level Warnings
```json
{
  "res": "success",
  "results": [
    {
      "row": 4,
      "res": "success",
      "issues": [
        {
          "type": "warning",
          "col_name": "ou",
          "message": "Org' unit is missing"
        }
      ]
    }
  ]
}
```

### 9.5 N8N Function Node - Parse Response
```javascript
// N8N Function Node
const response = $input.item.json;

if (response.res === "error") {
  return {
    json: {
      success: false,
      errorType: "CRITICAL",
      message: response.error_msg
    }
  };
}

if (response.res === "success") {
  if (!response.results || response.results.length === 0) {
    return {
      json: {
        success: true,
        message: "Operation completed successfully"
      }
    };
  }
  
  const errors = response.results.filter(r => r.res === "error");
  const warnings = response.results.filter(r => 
    r.issues && r.issues.some(i => i.type === "warning")
  );
  
  return {
    json: {
      success: errors.length === 0,
      partialSuccess: errors.length > 0,
      totalRows: response.results.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      errors: errors,
      warnings: warnings
    }
  };
}
```

---

## 10. Complete Workflow Example

### Daily User Sync Workflow

```javascript
// Workflow Order (from API documentation):
// 1. DeleteUsersCSV
// 2. ImportUsersCSV
// 3. ImportGroupsCSV
// 4. ImportGroupsMembersCSV

// Step 1: Generate Delete CSV
const deletedUsers = $input.all();
let csv = 'external_id\n';
deletedUsers.forEach(user => {
  csv += `${user.json.external_id}\n`;
});

return {
  json: { count: deletedUsers.length },
  binary: {
    data: {
      data: Buffer.from(csv, 'utf-8').toString('base64'),
      mimeType: 'text/csv',
      fileName: 'delete_users.csv'
    }
  }
};

// Step 2: Generate Users CSV
const users = $input.all();
const headers = ['external_id', 'username', 'firstname', 'lastname', 'email', 'disabled'];

let csv = headers.join(',') + '\n';
users.forEach(user => {
  const row = headers.map(h => {
    let value = String(user.json[h] || '');
    if (value.includes(',') || value.includes('"')) {
      value = '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  });
  csv += row.join(',') + '\n';
});

return {
  json: { count: users.length },
  binary: {
    data: {
      data: Buffer.from(csv, 'utf-8').toString('base64'),
      mimeType: 'text/csv',
      fileName: 'import_users.csv'
    }
  }
};
```

---

## 11. Quick Reference

### Correct Sync Order
```
1. DeleteUsersCSV
2. ImportUsersCSV
3. ImportGroupsCSV
4. ImportGroupsMembersCSV
```

### User Identifier Options
```javascript
{"external_id": "a123"}
{"user_id": "123"}
{"user_name": "abc"}
{"identity_num": "123"}
```

### Group Identifier Options
```javascript
{"group_external_id": "a456"}
{"group_id": "123"}
```

### Date Format
- Always: `yyyy-mm-dd`
- Example: `2024-01-15`

### Checkbox Format
- `0` = false/disabled
- `1` = true/enabled

### File Encoding
- UTF-8 encoded
- RFC-4180 standard or TSV

### CSV File Field
- POST variable: `sheet_file`
- Or in request body

---

## 12. API Endpoints Summary

```
Base: https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2

User:
  POST /UpdateUser
  POST /ImportUsersCSV/{domain}/{options}
  POST /DeleteUser
  POST /DeleteUsersCSV/{domain}
  POST /AvatarSet/{domain}/{user_id}/{remove}

Group:
  POST /UpdateGroup
  POST /ImportGroupsCSV/{domain}/{options}
  POST /DeleteGroup
  POST /AttachSubGroup
  POST /DetachSubGroup
  POST /AttachInstance
  POST /DetachInstance

Membership:
  POST /AttachUserToGroup
  POST /ImportGroupsMembersCSV/{domain}/{options}
  POST /DetachUserFromGroup
  POST /DetachUserFromOu

Manager:
  POST /AttachManager
  POST /DetachManager
  POST /UserAuthorities
  POST /PowerManager

Performance:
  POST /ImportAssignmentPerformancesCSV/{domain}
  POST /ImportGroupPerformancesCSV/{domain}
  POST /UploadDiploma

Supplier:
  POST /UpdateSupplier
  POST /DeleteSupplier

System:
  POST /RunAutoEnrollmentRules
  POST /RunScheduledImports
  POST /RemoveEmptyOrgUnits/{domain}
  POST /Test
```

---

**Document Version**: 2.2 (Verified Against Official API Documentation)  
**Last Updated**: 2024  
**API Version**: Blossom Sync API V2