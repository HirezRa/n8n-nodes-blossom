# Blossom n8n Node - Complete Features List

**Version:** 3.0.6  
**Last Updated:** 2025-02-04

---

## 📋 Overview

This document lists all available operations in the Blossom n8n community node, organized by resource type.

---

## 👤 User Resource

### Operations

1. **Get** ✅
   - Get user details by identifier (External ID, User ID, User Name, or Identity Number)
   - Declarative routing (GET)

2. **Update** ✅
   - Create or update a user
   - Supports all user fields including custom fields
   - Declarative routing

3. **Delete** ✅
   - Delete a user by identifier (External ID, User ID, User Name, Identity Number)
   - Declarative routing

4. **Set Avatar** ✅
   - Upload or remove user avatar
   - Requires programmatic execution (file upload)
   - Supports image files

5. **Set User Authorities** ✅
   - Set HR manager, professional manager, coach, or authorization supervisor
   - Clear authorities by setting empty values
   - Declarative routing

6. **Power Manager** ✅
   - Grant or revoke Power Manager privileges
   - Declarative routing

7. **Import Users CSV** ✅
   - Bulk import users from CSV file
   - Requires programmatic execution (file upload)
   - Options: keep_old_values, temp_password, new_user_notification, password_not_required, update_password, manager_ou, clean_ou
   - Limit: 4 calls per 24 hours

8. **Delete Users CSV** ✅
   - Bulk delete users from CSV file
   - Requires programmatic execution (file upload)
   - Soft delete (can be restored)
   - Limit: 4 calls per 24 hours

---

## 👥 Group Resource

### Operations

1. **Update** ✅
   - Create or update a group/workspace
   - Supports: Group, Course, Role, Org Unit (OU), Template, Qualification, Workplan
   - Declarative routing

2. **Delete** ✅
   - Delete a group by identifier
   - Declarative routing

3. **Attach Sub Group** ✅
   - Attach a sub workspace to a parent workspace
   - Same type required
   - Declarative routing

4. **Detach Sub Group** ✅
   - Detach a sub workspace from its parent
   - Declarative routing

5. **Attach Instance** ✅
   - Attach a Group/Course to a Template
   - Declarative routing

6. **Detach Instance** ✅
   - Detach a Group/Course from its Template
   - Declarative routing

7. **Import Groups CSV** ✅
   - Bulk import groups/workspaces from CSV file
   - Requires programmatic execution (file upload)
   - Options: keep_old_values, manager_type, override_existing_permissions, remove_existing_managers, set_primary_manager
   - Limit: 4 calls per 24 hours

---

## 🔗 Membership Resource

### Operations

1. **Attach User to Group** ✅
   - Attach a user to a group/workspace
   - Declarative routing

2. **Detach User From Group / Detach User From OU** ✅
   - Detach a user from a group/workspace or Organizational Unit
   - Supports both Group and OU detachment
   - Declarative routing

3. **Import Groups Members CSV** ✅
   - Bulk import group members from CSV file
   - Requires programmatic execution (file upload)
   - Limit: 4 calls per 24 hours

---

## 👔 Manager Resource

### Operations

1. **Attach Manager** ✅
   - Attach a manager to a user in a group
   - Manager types: All, HR Manager, Professional Manager, Coach, Authorization Supervisor
   - Set primary options: No, Set as Primary, Make Exclusive
   - Declarative routing

2. **Detach Manager** ✅
   - Detach a manager from a user in a group
   - Declarative routing

---

## 🏢 Supplier Resource

### Operations

1. **Update Supplier** ✅
   - Create or update a supplier (RegExt for external event institutions)
   - Declarative routing

2. **Delete Supplier** ✅
   - Delete a supplier
   - Declarative routing

---

## ⚙️ Utility Resource

### Operations

1. **Test** ✅ TESTED
   - Test API connection
   - Returns JSON with protocol and random number
   - Declarative routing
   - **Status:** ✅ Verified working

2. **Run Auto Enrollment Rules** ✅
   - Run auto enrollment rules
   - Call once after entire sync is complete
   - Run outside working hours
   - Limit: 4 calls per 24 hours
   - Declarative routing

3. **Run Scheduled Imports** ✅
   - Run scheduled imports
   - Cannot run at midnight (runs automatically)
   - Limit: 4 calls per 24 hours
   - Declarative routing

4. **Remove Empty Org Units** ✅
   - Remove empty organizational units
   - Declarative routing

---

## 📊 Data Resource

### Operations

1. **Get User Completion** ✅ TESTED
   - Get user completion status for qualifications, courses, and assignments
   - Supports multiple filters (user, group, date range)
   - Declarative routing
   - **Status:** ✅ Verified working - Returns user completion data

2. **Get Members Status** ✅ TESTED
   - Get member status in workspace(s)
   - Supports single/multiple workspaces, date filters, group type filters
   - Declarative routing
   - **Status:** ✅ Verified working - Returns member status data

3. **Get Groups** ✅ TESTED
   - Get list of groups/workspaces
   - Supports type filters
   - Declarative routing
   - **Status:** ✅ Verified working - Returns groups list

4. **Set Due Date** ✅
   - Set due date for a user in a workspace
   - Supports relative dates ("-0hours" for immediate)
   - Declarative routing

5. **Get Meetings** ✅ TESTED
   - Get meetings information for workspace(s) and/or user(s)
   - Supports date range and filters
   - Declarative routing
   - **Status:** ✅ Verified working - Returns meetings data

---

## 📈 Performance Resource

### Operations

1. **Import Assignment Performances CSV** ✅
   - Import assignment performances from CSV file
   - Requires programmatic execution (file upload)
   - Required column: user_name or user_external_id

2. **Import Group Performances CSV** ✅
   - Import group performances from CSV file
   - Requires programmatic execution (file upload)
   - Required column: user_name or user_external_id

3. **Upload Diploma** ✅
   - Upload or remove diploma for a user in a group
   - Requires programmatic execution (file upload)
   - Supports PDF files

---

## 📝 Implementation Notes

### Declarative vs Programmatic

- **Declarative Routing:** Most operations use n8n's declarative routing system
- **Programmatic Execution:** File upload operations require custom execute function:
  - CSV imports (Users, Groups, Members, Performances)
  - File uploads (Avatar, Diploma)

### Rate Limits

- **API Requests:** 30 requests per second
- **CSV Methods:** 4 calls per 24 hours each
- **RunAutoEnrollmentRules:** 4 calls per 24 hours
- **RunScheduledImports:** 4 calls per 24 hours

### File Upload Support

All file upload operations support:
- CSV files (UTF-8 encoding, BOM removal)
- Image files (for avatars)
- PDF files (for diplomas)
- Automatic charset handling for CSV files

---

## ✅ Tested Operations

The following read-only operations have been tested against the live server:

1. ✅ **Test Connection** - Verified working
2. ✅ **Get Groups** - Verified working
3. ✅ **Get User Completion** - Verified working
4. ✅ **Get Members Status** - Verified working
5. ✅ **Get Meetings** - Verified working

**Test Date:** 2025-01-21  
**Server:** https://your-instance.blossom-kc.com  
**Success Rate:** 100% (5/5 tests passed)

---

## 📚 Documentation

- **API Documentation:** See `API/Blossom_API_Complete_Documentation.md`
- **Node README:** See `README.md`
- **Security Report:** See `SECURITY_SCAN_REPORT.md`
- **Test Report:** See `TEST_REPORT.md`

---

## 🔄 Version History

- **3.0.1** (2025-01-21): Complete rewrite with all API operations, declarative style, file upload support, comprehensive testing
- **2.5.13** (Previous): Legacy version
