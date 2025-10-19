# Blossom API Integration Guide for N8N - Extended Examples

## Overview
This comprehensive guide provides detailed instructions and extensive examples for integrating Blossom Sync API V2 with N8N workflows using Cursor AI.

**Important:** This guide is based on the official Blossom API V2 documentation. All methods, parameters, and examples are verified against the API specification.

## API Configuration

### Base Configuration
```javascript
const config = {
  baseURL: 'https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2',
  authentication: 'basic',
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  domain: 'YOUR_DOMAIN' // domain name or id (e.g., '1' or 'company-name')
};
```

### Finding Your Configuration
1. **baseURL**: Replace `YOUR-COMPANY` with your organization's subdomain
2. **domain**: Check with your Blossom admin or use domain name/ID from system
3. **credentials**: Use your API user credentials (not your login credentials)

### Rate Limits
- **API Calls**: Maximum 30 requests per second
- **CSV Import Methods**: Maximum 4 calls per 24 hours per method
  - DeleteUsersCSV
  - ImportUsersCSV
  - ImportGroupsCSV
  - ImportGroupsMembersCSV
- **System Operations**: Maximum 4 calls per 24 hours
  - RunAutoEnrollmentRules
  - RunScheduledImports

---

## 1. User Management - Detailed Examples

### 1.1 Create/Update Single User - Basic
```javascript
// N8N HTTP Request Node Configuration
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
      "username": "john.doe",
      "password": "TempPass123!",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@company.com"
    }
  }
}
```

### 1.2 Create/Update User - Complete Profile
```javascript
// N8N HTTP Request Node - Full User Profile
// Available fields from API documentation
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
      // Identity fields
      "external_id": "a123",
      "username": "john.doe",
      "id": "",  // System ID (optional)
      
      // Basic information
      "firstname": "John",
      "lastname": "Doe",
      "password": "SecurePass123!",
      
      // Contact information
      "email": "john.doe@company.com",
      "mphone": "+1-555-0100",
      "bphone": "+1-555-0101",
      "hphone": "+1-555-0102",
      
      // Personal information
      "birthday": "1990-05-15", // Format: yyyy-mm-dd
      "gender": "M",
      
      // Work information
      "employee_id": "EMP001",
      "company": "Tech Corp",
      "department": "Engineering",
      "job_title": "Senior Developer",
      "employment_date": "2024-01-15", // Format: yyyy-mm-dd
      
      // Address
      "address": "123 Main Street",
      "city": "New York",
      "zip": "10001",
      
      // System fields
      "disabled": 0, // 0=active, 1=disabled (checkbox format)
      "user_nt": "DOMAIN\\johndoe",
      
      // About/Bio
      "about": "Experienced developer",
      
      // Custom fields (Hebrew examples from API doc)
      "חטיבה": "Development",
      "קבלן שטח": "Main Office",
      "קבלן משרדי": "HQ Building"
    }
  }
}
```

### 1.3 Update User with Custom Fields
```javascript
// N8N HTTP Request Node - Custom Fields by Different Methods
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UpdateUser",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "details": {
      "external_id": "a123",
      "username": "john.doe",
      
      // Method 1: By field name (as appears in system)
      "Security Clearance": "Level 3",
      
      // Method 2: By field ID
      "field_12": "Value for field 12",
      
      // Method 3: By field key (if set in system)
      "custom_field_key": "Custom value"
    }
  }
}
```

### 1.4 Bulk Import Users - CSV with Options
```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportUsersCSV/1/keep_old_values=1&temp_password=1&new_user_notification=1&password_not_required=0",
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

**Available Options:**
- `keep_old_values=1` - Empty cells won't erase existing values
- `temp_password=1` - Set temporary password for new users
- `new_user_notification=1` - Send credentials by email
- `password_not_required=1` - For SSO environments
- `manager_ou=1` - Create org unit tree based on management
- `clean_ou=1` - Remove empty org units (only with manager_ou=1)

**CSV Template - Basic Fields:**
```csv
external_id,username,firstname,lastname,email,password,disabled
a123,john.doe,John,Doe,john@company.com,Pass123!,0
a124,jane.smith,Jane,Smith,jane@company.com,Pass456!,0
```

**CSV Template - All Available Fields:**
```csv
external_id,username,firstname,lastname,password,id,employee_id,email,gender,company,department,employment_date,job_title,about,address,city,zip,birthday,bphone,hphone,mphone,user_nt,disabled
a123,john.doe,John,Doe,Pass123!,,EMP001,john@company.com,M,Tech Corp,Engineering,2024-01-15,Developer,Bio text,123 Main St,New York,10001,1990-05-15,555-0101,555-0102,555-0100,DOMAIN\john,0
```

**CSV Template - With Manager OU:**
```csv
external_id,username,firstname,lastname,email,manager_ou,ou_name
a123,john.doe,John,Doe,john@company.com,a124,Engineering Team
a124,alice.brown,Alice,Brown,alice@company.com,,Management
```

### 1.5 Delete Single User
```javascript
// N8N HTTP Request Node - Method 1: POST with JSON
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteUser",
  "authentication": "basicAuth",
  "sendHeaders": true,
  "headerParameters": {
    "Content-Type": "application/json"
  },
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "user_identifier": {
      "external_id": "a123"
    }
  }
}

// Method 2: GET with URL parameters
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteUser/1/external_id=a123",
  "authentication": "basicAuth"
}

// Alternative identifiers:
// By user_id: /DeleteUser/1/user_id=123
// By username: /DeleteUser/1/user_name=john.doe
// By identity number: /DeleteUser/1/identity_num=987654321
```

**Note:** Deletion is "soft delete" - user remains in database but is marked as deleted. Updating a deleted user will restore them.

### 1.6 Bulk Delete Users - CSV
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
a125
```

### 1.7 Update User Avatar
```javascript
// N8N HTTP Request Node - Upload Avatar
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
    "avatarfile": "={{$binary.avatar}}" // JPG or PNG file
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

## 2. Group/Workspace Management - Detailed Examples

### 2.1 Create/Update Group - Available Fields
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
      // Required fields
      "external_id": "a456",
      "name": "JavaScript Fundamentals",
      "type": "course", // course, group, role, ou, template, qualification, workplan
      
      // Optional fields (from API documentation)
      "description": "Learn JavaScript programming",
      "open_date": "2024-01-15", // Format: yyyy-mm-dd
      "close_date": "2024-12-31",
      "passing_grade": 70,
      "gathering_area": "Building A, Room 301",
      "location": "New York Office",
      "audience": "Developers, Technical Staff",
      "estimated_budget": 5000,
      "publish_grades_criteria": "on_completion",
      "publish_grades_on_add": 0, // Checkbox: 0 or 1
      "hide_score": 0,
      "hide_from_members": 0,
      "hide_from_user_profile": 0,
      "parent_external_id": "parent_group_id",
      "template_external_id": "template_id",
      "classification": "Technical Training"
    }
  }
}
```

### 2.2 Different Group Types
```javascript
// Type 1: Course
{
  "domain": "1",
  "details": {
    "external_id": "COURSE001",
    "name": "JavaScript Course",
    "type": "course"
  }
}

// Type 2: Group
{
  "domain": "1",
  "details": {
    "external_id": "GRP001",
    "name": "Development Team",
    "type": "group"
  }
}

// Type 3: Role
{
  "domain": "1",
  "details": {
    "external_id": "ROLE001",
    "name": "Developer Role",
    "type": "role"
  }
}

// Type 4: OU (Organizational Unit)
{
  "domain": "1",
  "details": {
    "external_id": "OU001",
    "name": "Engineering Department",
    "type": "ou"
  }
}

// Type 5: Template
{
  "domain": "1",
  "details": {
    "external_id": "TPL001",
    "name": "Training Template",
    "type": "template"
  }
}

// Type 6: Qualification
{
  "domain": "1",
  "details": {
    "external_id": "QUAL001",
    "name": "JS Certification",
    "type": "qualification"
  }
}

// Type 7: Workplan
{
  "domain": "1",
  "details": {
    "external_id": "WP001",
    "name": "Q1 2024 Plan",
    "type": "workplan"
  }
}
```

### 2.3 Bulk Import Groups - CSV
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

**Available Options:**
- `keep_old_values=1` - Empty cells won't erase existing values
- `manager_type=all` - Manager permissions: 'all', 'none', or specific permission name
- `override_existing_permissions=1` - Override existing manager permissions
- `remove_existing_managers=1` - Remove existing managers
- `set_primary_manager=1` - Set as primary manager

**CSV Template - Basic:**
```csv
group_external_id,group_name,group_type,description
COURSE001,JavaScript Basics,course,Introduction to JavaScript
GRP001,Dev Team,group,Development team
```

**CSV Template - With Hierarchy:**
```csv
group_external_id,group_name,group_type,parent_external_id,template_external_id
OU-TECH,Technology,ou,,
OU-ENG,Engineering,ou,OU-TECH,
COURSE001,JS Course,course,OU-ENG,TPL001
```

**CSV Template - With Manager:**
```csv
group_external_id,group_name,group_type,manager_external_id
COURSE001,JavaScript Basics,course,a123
GRP001,Dev Team,group,a124
```

### 2.4 Delete Group
```javascript
// N8N HTTP Request Node - POST method
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "group_identifier": {
      "group_external_id": "a456"
    }
  }
}

// GET method
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteGroup/1/group_external_id=a456",
  "authentication": "basicAuth"
}
```

---

## 3. Hierarchical Operations

### 3.1 Attach Subgroup to Parent
```javascript
// N8N HTTP Request Node
// Note: Both groups must be of the same type
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AttachSubGroup",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "sub_group_identifier": {
      "group_external_id": "OU-FRONTEND"
    },
    "parent_group_identifier": {
      "group_external_id": "OU-ENG"
    }
  }
}
```

### 3.2 Detach Subgroup from Parent
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
      "group_external_id": "OU-FRONTEND"
    }
  }
}
```

### 3.3 Attach Group/Course to Template
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
      "group_external_id": "COURSE001"
    },
    "template_identifier": {
      "group_external_id": "TPL001"
    }
  }
}
```

### 3.4 Detach Group/Course from Template
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
      "group_external_id": "COURSE001"
    }
  }
}
```

---

## 4. User-Group Relationships

### 4.1 Attach User to Group
```javascript
// N8N HTTP Request Node
// Works for: Group, Course, OU, Qualification, Workplan
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
      "group_external_id": "COURSE001"
    }
  }
}
```

### 4.2 Bulk Attach Users to Groups - CSV
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

**Available Options:**
- `clean_ou=1` - Remove empty org units

**CSV Template:**
```csv
user_external_id,workspace_external_id
a123,COURSE001
a124,COURSE001
a123,GRP001
```

### 4.3 Detach User from Group
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
      "group_external_id": "COURSE001"
    }
  }
}
```

### 4.4 Detach User from OU
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

### 5.1 Attach Manager to Group
```javascript
// N8N HTTP Request Node
// Works for: Group, Course, Role, OU, Template, Qualification, Workplan
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
      "group_external_id": "COURSE001"
    },
    "manager_type": "all", // 'all', 'none', or specific permission name
    "set_primary": 0 // 0=regular, 1=primary, 2=remove others and set primary
  }
}
```

**set_primary Values:**
- `0` - Add as regular manager
- `1` - Set as primary manager
- `2` - Remove existing managers and add as primary

### 5.2 Detach Manager from Group
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
      "group_external_id": "COURSE001"
    }
  }
}
```

### 5.3 Set User Authorities
```javascript
// N8N HTTP Request Node
// Available authorities: HR manager, Professional manager, Coach, Supervisor
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

// Clear authority (pass empty string)
{
  "domain": "1",
  "user_identifier": {"external_id": "a123"},
  "authorities": {
    "user_coach_id": ""
  }
}

// Using user_id instead
{
  "domain": "1",
  "user_identifier": {"external_id": "a123"},
  "authorities": {
    "user_hr_manager_id": "user_id=1234"
  }
}
```

**Available Authority Fields:**
- `user_hr_manager_id` - Human resources coordinator
- `user_professional_manager_id` - Professional manager
- `user_coach_id` - Personal coach
- `user_auth_supervisor_id` - Supervisor

### 5.4 Set Power Manager
```javascript
// N8N HTTP Request Node - Grant Power Manager
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

### 6.1 Import Assignment Performances - CSV
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
john.doe,ASSIGN001,2024-01-15,85,Yes
jane.smith,ASSIGN001,2024-01-16,92,Yes
```

**Alternative - Using external_id:**
```csv
user_external_id,assignment_id,date,grade,completed
a123,ASSIGN001,2024-01-15,85,Yes
a124,ASSIGN001,2024-01-16,92,Yes
```

### 6.2 Import Group Performances - CSV
```javascript
// N8N HTTP Request Node
// For qualifications and courses
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

**CSV Template:**
```csv
user_external_id,group_external_id,completion_date,grade,status
a123,COURSE001,2024-03-15,85,Completed
a124,COURSE001,2024-03-16,92,Completed
```

### 6.3 Upload Diploma
```javascript
// N8N HTTP Request Node - Upload diploma
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UploadDiploma/1/external_id=a123/group_external_id=COURSE001/0",
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

// Remove diploma (set last parameter to 1)
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UploadDiploma/1/external_id=a123/group_external_id=COURSE001/1",
  "authentication": "basicAuth"
}
```

---

## 7. Supplier Management

### 7.1 Create/Update Supplier
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
      "name": "Training Solutions Inc.",
      "address": "123 Business Park",
      "phone": "123-456",
      "fax": "123-457",
      "email": "info@trainingsolutions.com",
      "contact": "Sarah Johnson",
      "business_number": "12345",
      "supplier_number": "SUP-001"
    }
  }
}
```

### 7.2 Delete Supplier
```javascript
// N8N HTTP Request Node - POST method
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

### 8.1 Run Auto Enrollment Rules
```javascript
// N8N HTTP Request Node
// WARNING: Run only outside working hours
// Max 4 calls per 24 hours
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RunAutoEnrollmentRules",
  "authentication": "basicAuth"
}
```

### 8.2 Run Scheduled Imports
```javascript
// N8N HTTP Request Node
// WARNING: Cannot run at midnight
// Max 4 calls per 24 hours
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RunScheduledImports",
  "authentication": "basicAuth"
}
```

### 8.3 Remove Empty Organizational Units
```javascript
// N8N HTTP Request Node - POST method
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

### 8.4 Test API Connection
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
  "error_msg": "Cannot continue, the following fields are missing: username, email"
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
      "username": "john.doe",
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
  // Critical error - operation failed
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
    // Complete success
    return {
      json: {
        success: true,
        message: "Operation completed successfully"
      }
    };
  }
  
  // Check for row-level issues
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

## 10. Complete Workflow Examples

### 10.1 Daily User Sync
```javascript
// Workflow Order:
// 1. Schedule Trigger (2 AM)
// 2. Query Database for Changes
// 3. Generate Delete CSV
// 4. DeleteUsersCSV
// 5. Wait 1 minute
// 6. Generate Users CSV
// 7. ImportUsersCSV
// 8. Parse Response
// 9. Send Notification

// Step 3: Generate Delete CSV
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

// Step 6: Generate Users CSV
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

### 10.2 Complete Nightly Sync
```javascript
// Full sync order (from API documentation):
// 1. DeleteUsersCSV
// 2. ImportUsersCSV
// 3. ImportGroupsCSV
// 4. ImportGroupsMembersCSV

// After all imports complete:
// 5. RunAutoEnrollmentRules (off-hours only)
// 6. RemoveEmptyOrgUnits (if needed)
```

---

## 11. Data Validation

### 11.1 Pre-Import Validation
```javascript
// N8N Function Node
const items = $input.all();
const errors = [];

items.forEach((item, index) => {
  const row = item.json;
  const rowNum = index + 2; // Account for header
  
  // Validate required fields
  if (!row.external_id) {
    errors.push({ row: rowNum, field: 'external_id', issue: 'Required field missing' });
  }
  if (!row.username) {
    errors.push({ row: rowNum, field: 'username', issue: 'Required field missing' });
  }
  
  // Validate date format (yyyy-mm-dd)
  if (row.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(row.birthday)) {
    errors.push({ row: rowNum, field: 'birthday', issue: 'Invalid date format. Use yyyy-mm-dd' });
  }
  
  // Validate disabled field (0 or 1)
  if (row.disabled && !['0', '1', 0, 1].includes(row.disabled)) {
    errors.push({ row: rowNum, field: 'disabled', issue: 'Must be 0 or 1' });
  }
  
  // Validate email format
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push({ row: rowNum, field: 'email', issue: 'Invalid email format' });
  }
});

return {
  json: {
    isValid: errors.length === 0,
    totalRows: items.length,
    errors: errors
  }
};
```

---

## 12. Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Invalid credentials | Verify username/password |
| **Rate limit exceeded** | >30 requests/second | Add delays between requests (35ms) |
| **CSV import limit** | >4 calls in 24h | Schedule imports appropriately |
| **Cannot continue, fields missing** | Missing required CSV columns | Add required columns to CSV |
| **external_id appears more than once** | Duplicate IDs in CSV | Remove duplicates |
| **parents are missing** | Parent created after child | Create parents first |
| **Invalid date format** | Wrong date format | Use yyyy-mm-dd format |
| **user not found** | Wrong external_id | Verify user exists |

---

## 13. Quick Reference

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
{"user_id": "12345"}
{"user_name": "john.doe"}
{"identity_num": "987654321"}
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
- Use: `0` or `1`
- `0` = false/no/disabled
- `1` = true/yes/enabled

### File Encoding
- CSV must be UTF-8 encoded
- Follow RFC-4180 standard
- Or use TSV format

---

## 14. API Endpoints Summary

```
Base: https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2

User Operations:
  POST /UpdateUser
  POST /ImportUsersCSV/{domain}/{options}
  POST /DeleteUser
  POST /DeleteUsersCSV/{domain}
  POST /AvatarSet/{domain}/{user_id}/{remove}

Group Operations:
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

Manager Operations:
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

**Document Version**: 2.1 (Verified)  
**Last Updated**: 2024  
**Based on**: Blossom Sync API V2 Official Documentation