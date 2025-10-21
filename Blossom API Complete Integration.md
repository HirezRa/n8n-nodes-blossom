# Blossom API Complete Integration Guide for N8N

## מסמך מאוחד ומקיף - Comprehensive Unified Document

**גרסה / Version**: 3.0  
**תאריך עדכון / Last Updated**: 2024  
**מבוסס על / Based on**: Blossom Sync API V2 Official Documentation

---

## תוכן עניינים / Table of Contents

1. [הגדרות בסיסיות / Basic Configuration](#basic-configuration)
2. [רשימת פונקציות מלאה / Complete Functions List](#functions-list)
3. [ניהול משתמשים / User Management](#user-management)
4. [ניהול קבוצות / Group Management](#group-management)
5. [קשרי משתמשים-קבוצות / User-Group Relationships](#user-group-relationships)
6. [ניהול מנהלים / Manager Operations](#manager-operations)
7. [ציונים וביצועים / Performance & Grades](#performance-grades)
8. [ספקים / Suppliers](#suppliers)
9. [פעולות מערכת / System Operations](#system-operations)
10. [טיפול בתגובות / Response Handling](#response-handling)
11. [דוגמאות Workflow / Workflow Examples](#workflow-examples)

---

<a name="basic-configuration"></a>
## 1. הגדרות בסיסיות / Basic Configuration

### Base URL Structure
```
https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2
```

### Authentication
```javascript
const config = {
  baseURL: 'https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2',
  authentication: 'basic',
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  domain: 'YOUR_DOMAIN' // domain name or id (e.g., '1')
};
```

### Rate Limits / מגבלות קצב
- **קריאות API / API Calls**: מקסימום 30 בשנייה / Maximum 30 requests per second
- **מתודות CSV / CSV Methods**: מקסימום 4 קריאות ב-24 שעות / Maximum 4 calls per 24 hours:
  - DeleteUsersCSV
  - ImportUsersCSV
  - ImportGroupsCSV
  - ImportGroupsMembersCSV
  - RunAutoEnrollmentRules
  - RunScheduledImports

### File Encoding / קידוד קבצים
- **CSV**: UTF-8 encoded, RFC-4180 standard או TSV
- **File field name**: `sheet_file`

### Data Formats / פורמטים
- **תאריכים / Dates**: `yyyy-mm-dd` (דוגמה: 2024-01-15)
- **Checkbox**: `0` (false/disabled) או `1` (true/enabled)

---

<a name="functions-list"></a>
## 2. רשימת פונקציות מלאה / Complete Functions List

### סיכום מהיר / Quick Summary
- **סה"כ פונקציות / Total Functions**: 29
- **עם domain parameter**: 26
- **ללא domain parameter**: 3
- **פונקציות CSV**: 7

### טבלת פונקציות לפי קטגורייה / Functions by Category

| Category | Functions | Requires domain |
|----------|-----------|-----------------|
| **User Operations** | UpdateUser, ImportUsersCSV, DeleteUser, DeleteUsersCSV, AvatarSet, DetachUserFromOu | ✅ Yes |
| **Group Operations** | UpdateGroup, ImportGroupsCSV, DeleteGroup, AttachSubGroup, DetachSubGroup, AttachInstance, DetachInstance | ✅ Yes |
| **User-Group Relations** | AttachUserToGroup, ImportGroupsMembersCSV, DetachUserFromGroup | ✅ Yes |
| **Manager Operations** | AttachManager, DetachManager, UserAuthorities, PowerManager | ✅ Yes |
| **Performance** | ImportAssignmentPerformancesCSV, ImportGroupPerformancesCSV, UploadDiploma | ✅ Yes |
| **Suppliers** | UpdateSupplier, DeleteSupplier | ✅ Yes |
| **System** | RemoveEmptyOrgUnits | ✅ Yes |
| **System (No domain)** | RunAutoEnrollmentRules, RunScheduledImports, Test | ❌ No |

---

<a name="user-management"></a>
## 3. ניהול משתמשים / User Management

### 3.1 UpdateUser - יצירה/עדכון משתמש / Create or Update User

**Parameters:**
- `domain` (required) - string
- `details` (required) - object/querystring

**Available Fields:**
```
external_id, username, firstname, lastname, password, id, employee_id, 
email, gender, company, department, employment_date, job_title, about, 
address, city, zip, birthday, bphone, hphone, mphone, user_nt, disabled, 
חטיבה, קבלן שטח, קבלן משרדי
```

**N8N HTTP Request Node:**
```javascript
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

**דוגמה מלאה / Complete Example:**
```javascript
{
  "domain": "1",
  "details": {
    "external_id": "EMP001",
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

**Custom Fields / שדות מותאמים אישית:**
- By name: `"Field Name": "value"`
- By ID: `"field_12": "value"`
- By key: `"field_key": "value"` (if set)

---

### 3.2 ImportUsersCSV - ייבוא המוני / Bulk Import

**Parameters:**
- `domain` (required) - string
- `options` (optional) - object/querystring
  - `keep_old_values`: [1/0] - תאים ריקים לא ימחקו ערכים קיימים
  - `temp_password`: [1/0] - סיסמה זמנית למשתמשים חדשים
  - `new_user_notification`: [1/0] - שליחת פרטים במייל
  - `password_not_required`: [1/0] - ל-SSO בלבד
  - `clean_ou`: [1/0] - מחיקת יחידות ארגוניות ריקות (רק עם manager_ou=1)
  - `manager_ou`: [1/0] - יצירת עץ ארגוני לפי ניהול

**N8N HTTP Request Node:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportUsersCSV/1/password_not_required=1&temp_password=1",
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
a124,jane.smith,Jane,Smith,jane@company.com,Pass456!,0
```

**CSV Template - With Manager OU:**
When `manager_ou=1`:
```csv
external_id,username,firstname,lastname,email,manager_ou,ou_name
a123,john.doe,John,Doe,john@company.com,a124,Engineering Team
a124,alice.brown,Alice,Brown,alice@company.com,,Management
```

---

### 3.3 DeleteUser - מחיקת משתמש / Delete User

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
  - Options: `user_id=123`, `user_name=abc`, `identity_num=123`, `external_id=a123`

**N8N HTTP Request Node - POST:**
```javascript
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
```

**N8N HTTP Request Node - GET:**
```javascript
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteUser/1/external_id=a123",
  "authentication": "basicAuth"
}
```

**⚠️ הערה חשובה / Important Note:**
מחיקה היא "soft delete" - המשתמש נשאר במערכת. עדכון משתמש מחוק ישחזר אותו.  
Deletion is "soft delete" - user remains in database. Updating a deleted user will restore them.

---

### 3.4 DeleteUsersCSV - מחיקה המונית / Bulk Delete

**Parameters:**
- `domain` (required) - string

**N8N HTTP Request Node:**
```javascript
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

---

### 3.5 AvatarSet - עדכון תמונת פרופיל / Update Avatar

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `remove_avatar` (required) - boolean
  - `0` = upload
  - `1` = remove

**File field**: `avatarfile` (JPG/PNG)

**N8N HTTP Request Node - Upload:**
```javascript
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
```

**N8N HTTP Request Node - Remove:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/AvatarSet/1/external_id=a123/1",
  "authentication": "basicAuth"
}
```

---

### 3.6 DetachUserFromOu - ניתוק משתמש מיחידה ארגונית / Detach User from OU

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

<a name="group-management"></a>
## 4. ניהול קבוצות / Group Management

### 4.1 UpdateGroup - יצירה/עדכון קבוצה / Create or Update Group

**Parameters:**
- `domain` (required) - string
- `details` (required) - object/querystring

**Available Fields:**
```
name, description, external_id, open_date, close_date, passing_grade, 
gathering_area, location, audience, estimated_budget, publish_grades_criteria, 
publish_grades_on_add, hide_score, hide_from_members, hide_from_user_profile, 
parent_external_id, template_external_id, classification
```

**Group Types / סוגי קבוצות:**
`course, group, role, ou, template, qualification, workplan`

**N8N HTTP Request Node:**
```javascript
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

**דוגמה מלאה / Complete Example:**
```javascript
{
  "domain": "1",
  "details": {
    "external_id": "COURSE001",
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

---

### 4.2 ImportGroupsCSV - ייבוא קבוצות המוני / Bulk Import Groups

**Parameters:**
- `domain` (required) - string
- `options` (optional) - object/querystring
  - `keep_old_values`: [1/0]
  - `manager_type`: Manager permissions name OR 'all'/'none'
  - `override_existing_permissions`: [1/0]
  - `remove_existing_managers`: [1/0]
  - `set_primary_manager`: [1/0]

**N8N HTTP Request Node:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/ImportGroupsCSV/1/keep_old_values=1&manager_type=all",
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
COURSE001,JavaScript Course,course,Learn JS
GRP001,Dev Team,group,Development team
```

---

### 4.3 DeleteGroup - מחיקת קבוצה / Delete Group

**Parameters:**
- `domain` (required) - string
- `group_identifier` (required) - anyType
  - Options: `group_id=123`, `group_external_id=a456`

**N8N HTTP Request Node:**
```javascript
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
```

---

### 4.4 AttachSubGroup - חיבור תת-קבוצה / Attach Subgroup

**Parameters:**
- `domain` (required) - string
- `sub_group_identifier` (required) - anyType
- `parent_group_identifier` (required) - anyType

**⚠️ שני הקבוצות חייבות להיות מאותו סוג / Both groups must be of the same type**

**N8N HTTP Request Node:**
```javascript
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

---

### 4.5 DetachSubGroup - ניתוק תת-קבוצה / Detach Subgroup

**Parameters:**
- `domain` (required) - string
- `group_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

---

### 4.6 AttachInstance - חיבור לתבנית / Attach to Template

**Parameters:**
- `domain` (required) - string
- `group_identifier` (required) - anyType
- `template_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

---

### 4.7 DetachInstance - ניתוק מתבנית / Detach from Template

**Parameters:**
- `domain` (required) - string
- `group_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

<a name="user-group-relationships"></a>
## 5. קשרי משתמשים-קבוצות / User-Group Relationships

### 5.1 AttachUserToGroup - חיבור משתמש לקבוצה / Attach User to Group

**Works for / עובד עבור:**
Group, Course, OU, Qualification, Workplan

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `group_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

---

### 5.2 ImportGroupsMembersCSV - חיבור המוני / Bulk Attach

**Parameters:**
- `domain` (required) - string
- `options` (optional) - string
  - `clean_ou`: [1/0]

**N8N HTTP Request Node:**
```javascript
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
a123,COURSE001
a124,COURSE001
a123,GRP001
```

---

### 5.3 DetachUserFromGroup - ניתוק משתמש מקבוצה / Detach User from Group

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `group_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

---

<a name="manager-operations"></a>
## 6. ניהול מנהלים / Manager Operations

### 6.1 AttachManager - חיבור מנהל / Attach Manager

**Works for / עובד עבור:**
Group, Course, Role, OU, Template, Qualification, Workplan

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `group_identifier` (required) - anyType
- `manager_type` (required) - string
  - Options: Manager permissions name OR 'all'/'none'
- `set_primary` (required) - int
  - `0` = regular manager / מנהל רגיל
  - `1` = set as primary / הגדר כראשי
  - `2` = remove existing and set as primary / הסר קיימים והגדר כראשי

**N8N HTTP Request Node:**
```javascript
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
    "manager_type": "all",
    "set_primary": "0"
  }
}
```

---

### 6.2 DetachManager - ניתוק מנהל / Detach Manager

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `group_identifier` (required) - anyType

**N8N HTTP Request Node:**
```javascript
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

---

### 6.3 UserAuthorities - הרשאות משתמש / User Authorities

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `authorities` (required) - object/querystring

**Available Authority Fields / שדות הרשאות זמינים:**
- `user_hr_manager_id` - מנהל משאבי אנוש / HR Manager
- `user_professional_manager_id` - מנהל מקצועי / Professional Manager
- `user_coach_id` - מאמן אישי / Personal Coach
- `user_auth_supervisor_id` - מפקח / Supervisor

**⚠️ הערה / Note:** למחיקה העבר ערך ריק. שדות שלא נכללו לא ישתנו.  
To clear, pass empty value. Fields not included will not change.

**N8N HTTP Request Node:**
```javascript
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
```

**Using user_id:**
```javascript
{
  "domain": "1",
  "user_identifier": {"external_id": "a123"},
  "authorities": {
    "user_hr_manager_id": "user_id=1234"
  }
}
```

**Clear authority:**
```javascript
{
  "domain": "1",
  "user_identifier": {"external_id": "a123"},
  "authorities": {
    "user_coach_id": ""
  }
}
```

---

### 6.4 PowerManager - מנהל על / Power Manager

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `type` (required) - string
  - Options: `"PowerManager"` or `"User"`

**N8N HTTP Request Node - Grant:**
```javascript
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
```

**N8N HTTP Request Node - Revoke:**
```javascript
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

<a name="performance-grades"></a>
## 7. ציונים וביצועים / Performance & Grades

### 7.1 ImportAssignmentPerformancesCSV - ייבוא ציוני מ과제ים / Import Assignment Grades

**Parameters:**
- `domain` (required) - string

**⚠️ חובה / Required:** הקובץ חייב להכיל `user_name` או `user_external_id`  
File must contain `user_name` OR `user_external_id`

**N8N HTTP Request Node:**
```javascript
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

---

### 7.2 ImportGroupPerformancesCSV - ייבוא ציוני קורסים / Import Course Grades

**Parameters:**
- `domain` (required) - string

**⚠️ חובה / Required:** הקובץ חייב להכיל `user_name` או `user_external_id`

**N8N HTTP Request Node:**
```javascript
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

---

### 7.3 UploadDiploma - העלאת תעודה / Upload Diploma

**Parameters:**
- `domain` (required) - string
- `user_identifier` (required) - anyType
- `group_identifier` (required) - anyType
- `remove_diploma` (required) - boolean
  - `0` = upload / העלאה
  - `1` = remove / מחיקה

**File field:** `diploma_file`

**N8N HTTP Request Node - Upload:**
```javascript
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
```

**N8N HTTP Request Node - Remove:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UploadDiploma/1/external_id=a123/group_external_id=COURSE001/1",
  "authentication": "basicAuth"
}
```

---

<a name="suppliers"></a>
## 8. ספקים / Suppliers

### 8.1 UpdateSupplier - יצירה/עדכון ספק / Create or Update Supplier

**Parameters:**
- `domain` (required) - string
- `type` (required) - string
  - Value: `"RegExt"` for external event institutions
- `details` (required) - object/querystring

**Available Fields:**
```
name, address, email, phone, fax, contact, business_number, 
supplier_number, external_id
```

**N8N HTTP Request Node:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/UpdateSupplier",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "type": "RegExt",
    "details": {
      "external_id": "SUP001",
      "name": "Training Solutions Inc.",
      "address": "123 Business Park",
      "phone": "123-456",
      "fax": "123-457",
      "email": "info@training.com",
      "contact": "John Doe",
      "business_number": "12345",
      "supplier_number": "SUP-001"
    }
  }
}
```

---

### 8.2 DeleteSupplier - מחיקת ספק / Delete Supplier

**Parameters:**
- `domain` (required) - string
- `ext_id` (required) - string

**N8N HTTP Request Node - POST:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteSupplier",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1",
    "ext_id": "SUP001"
  }
}
```

**N8N HTTP Request Node - GET:**
```javascript
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/DeleteSupplier/1/SUP001",
  "authentication": "basicAuth"
}
```

---

<a name="system-operations"></a>
## 9. פעולות מערכת / System Operations

### 9.1 RunAutoEnrollmentRules - הרצת כללי רישום אוטומטי / Run Auto Enrollment

**Parameters:** None

**⚠️ הערות חשובות / Important Notes:**
- הרץ כללי רישום אוטומטי לכל המשתמשים והקבוצות / Execute auto enrollment rules for all workspaces and users
- הרץ רק אחרי עדכון משתמשים וקבוצות / Call after updating users and workspaces
- רק מחוץ לשעות העבודה / Only outside working hours
- מקסימום 4 קריאות ב-24 שעות / Max 4 calls per 24 hours

**N8N HTTP Request Node:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RunAutoEnrollmentRules",
  "authentication": "basicAuth"
}
```

---

### 9.2 RunScheduledImports - הרצת ייבואים מתוזמנים / Run Scheduled Imports

**Parameters:** None

**⚠️ הערות חשובות / Important Notes:**
- הרצת ייבואים מתוזמנים מ-SFTP או תיקייה מקומית / Execute scheduled imports from SFTP or local folder
- לא ניתן להריץ בחצות / Cannot run at midnight
- מקסימום 4 קריאות ב-24 שעות / Max 4 calls per 24 hours

**N8N HTTP Request Node:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RunScheduledImports",
  "authentication": "basicAuth"
}
```

---

### 9.3 RemoveEmptyOrgUnits - מחיקת יחידות ארגוניות ריקות / Remove Empty Org Units

**Parameters:**
- `domain` (required) - string

**תיאור / Description:**
מוחק יחידות ארגוניות ללא חברים, מנהלים או היררכיה רלוונטית.  
Deletes org units with no members, managers, or relevant hierarchy.  
זהה ל-`clean_ou=1` ב-ImportGroupsMembersCSV ו-ImportUsersCSV  
Same as `clean_ou=1` in ImportGroupsMembersCSV and ImportUsersCSV

**N8N HTTP Request Node - POST:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RemoveEmptyOrgUnits",
  "authentication": "basicAuth",
  "sendBody": true,
  "bodyParameters": {
    "domain": "1"
  }
}
```

**N8N HTTP Request Node - GET:**
```javascript
{
  "method": "GET",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/RemoveEmptyOrgUnits/1",
  "authentication": "basicAuth"
}
```

---

### 9.4 Test - בדיקת חיבור / Test Connection

**Parameters:** None

**N8N HTTP Request Node:**
```javascript
{
  "method": "POST",
  "url": "https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2/Test",
  "authentication": "basicAuth"
}
```

**Expected Response / תגובה צפויה:**
```json
{
  "protocol": "HTTP/1.1",
  "random_number": 12345
}
```

---

<a name="response-handling"></a>
## 10. טיפול בתגובות / Response Handling

### 10.1 הצלחה ללא בעיות / Success - No Issues
```json
{
  "res": "success",
  "results": []
}
```

### 10.2 שגיאה קריטית / Critical Error
```json
{
  "res": "error",
  "error_msg": "Cannot continue, the following fields are missing: something, mandatory"
}
```

### 10.3 שגיאות ברמת שורה / Row-Level Errors
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

### 10.4 אזהרות ברמת שורה / Row-Level Warnings
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

### 10.5 N8N Function Node - ניתוח תגובות / Parse Response

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

<a name="workflow-examples"></a>
## 11. דוגמאות Workflow / Workflow Examples

### 11.1 סנכרון יומי / Daily Sync Workflow

**סדר נכון / Correct Order (from API documentation):**
```
1. DeleteUsersCSV
2. ImportUsersCSV
3. ImportGroupsCSV
4. ImportGroupsMembersCSV
```

**שלב 1: יצירת CSV מחיקה / Generate Delete CSV**
```javascript
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
```

**שלב 2: יצירת CSV משתמשים / Generate Users CSV**
```javascript
const users = $input.all();
const headers = ['external_id', 'username', 'firstname', 'lastname', 'email', 'disabled'];

let csv = headers.join(',') + '\n';
users.forEach(user => {
  const row = headers.map(h => {
    let value = String(user.json[h] || '');
    // Escape CSV special characters
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

## 12. מידע מהיר / Quick Reference

### זיהוי משתמש / User Identifiers
```javascript
{"external_id": "a123"}    // מומלץ / Recommended
{"user_id": "123"}
{"user_name": "abc"}
{"identity_num": "123"}
```

### זיהוי קבוצה / Group Identifiers
```javascript
{"group_external_id": "a456"}  // מומלץ / Recommended
{"group_id": "123"}
```

### פורמטים / Formats
- **תאריכים / Dates**: `yyyy-mm-dd` (דוגמה: 2024-01-15)
- **Checkbox**: `0` (לא / false) או `1` (כן / true)
- **קידוד CSV / CSV Encoding**: UTF-8, RFC-4180 או TSV
- **שדה קובץ / File Field**: `sheet_file`

---

## 13. נקודות חשובות / Important Notes

### ⚠️ הגבלות / Rate Limits
- **30 קריאות API לשנייה / 30 API calls per second**
- **4 קריאות CSV ב-24 שעות / 4 CSV calls per 24 hours**
- **4 קריאות מערכת ב-24 שעות / 4 system calls per 24 hours**

### ⚠️ מחיקה רכה / Soft Delete
מחיקת משתמש היא "soft delete" - המשתמש נשאר במערכת.  
User deletion is "soft delete" - user remains in database.

### ⚠️ שימוש ב-external_id
תמיד השתמש ב-`external_id` לזיהוי אובייקטים לעקביות.  
Always use `external_id` for object identification for consistency.

### ⚠️ סדר סנכרון
עקוב אחר הסדר הנכון: Delete → Users → Groups → Members  
Follow the correct order: Delete → Users → Groups → Members

---

## 14. סיכום נקודות / Endpoints Summary

```
Base URL: https://YOUR-COMPANY.blossom-kc.com/WebServices/sync_2

משתמשים / Users:
  POST /UpdateUser
  POST /ImportUsersCSV/{domain}/{options}
  POST /DeleteUser
  POST /DeleteUsersCSV/{domain}
  POST /AvatarSet/{domain}/{user_id}/{remove}
  POST /DetachUserFromOu

קבוצות / Groups:
  POST /UpdateGroup
  POST /ImportGroupsCSV/{domain}/{options}
  POST /DeleteGroup
  POST /AttachSubGroup
  POST /DetachSubGroup
  POST /AttachInstance
  POST /DetachInstance

חברויות / Memberships:
  POST /AttachUserToGroup
  POST /ImportGroupsMembersCSV/{domain}/{options}
  POST /DetachUserFromGroup

מנהלים / Managers:
  POST /AttachManager
  POST /DetachManager
  POST /UserAuthorities
  POST /PowerManager

ביצועים / Performance:
  POST /ImportAssignmentPerformancesCSV/{domain}
  POST /ImportGroupPerformancesCSV/{domain}
  POST /UploadDiploma

ספקים / Suppliers:
  POST /UpdateSupplier
  POST /DeleteSupplier

מערכת / System:
  POST /RunAutoEnrollmentRules
  POST /RunScheduledImports
  POST /RemoveEmptyOrgUnits/{domain}
  POST /Test
```

---

**סוף המסמך / End of Document**

**תאריך יצירה / Created**: 2024  
**גרסה / Version**: 3.0 - Unified Complete Guide  
**מבוסס על / Based on**: Blossom Sync API V2 Official Documentation