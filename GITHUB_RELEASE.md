# הוראות ליצירת Release ב-GitHub

## שלב 1: לך ל-Releases
1. פתח את ה-repository: https://github.com/HirezRa/n8n-nodes-blossom
2. לחץ על "Releases" (בצד ימין)
3. לחץ על "Create a new release"

## שלב 2: הגדרת Release
1. **Choose a tag**: בחר `v1.1.0` מהרשימה הנפתחת
2. **Release title**: `Enhanced Blossom Node with JWT and OAuth2 Support`
3. **Describe this release**:

```markdown
## 🚀 What's New in v1.1.0

### ✨ New Features
- **JWT Authentication**: Added support for JWT token authentication
- **OAuth 2.0 Authentication**: Added support for OAuth 2.0 authentication
- **Enhanced Documentation**: Comprehensive README with detailed examples
- **Updated Repository URLs**: Corrected GitHub repository links

### 🔧 Improvements
- **Complete API Coverage**: All 29 Blossom Sync API V2 operations supported
- **Multiple Auth Methods**: 4 authentication types (Basic, API Key, JWT, OAuth 2.0)
- **CSV Operations**: Full support for bulk import/export operations
- **File Uploads**: Avatar images, diploma files, and CSV imports
- **Error Handling**: Comprehensive error handling and validation

### 📚 Documentation
- Detailed usage examples for all operations
- CSV template specifications
- Authentication setup guides
- Error handling documentation

## 🎯 Available Operations

### User Management (5 operations)
- Update User, Import Users CSV, Delete User, Delete Users CSV, Set Avatar

### Group Management (7 operations)  
- Update Group, Import Groups CSV, Delete Group, Attach/Detach Sub Group, Attach/Detach Instance

### Membership Management (6 operations)
- Attach/Detach User to Group, Import Groups Members CSV, Attach/Detach Manager, Detach User from OU

### Utility Functions (7 operations)
- Test, Run Auto Enrollment Rules, Run Scheduled Imports, Remove Empty Org Units, User Authorities, Power Manager, Upload Diploma

### Supplier Management (2 operations)
- Update Supplier, Delete Supplier

### Performance Management (2 operations)
- Import Assignment Performances CSV, Import Group Performances CSV

## 📦 Installation

```bash
npm install n8n-nodes-blossom
```

## 🔗 Links
- **NPM Package**: https://www.npmjs.com/package/n8n-nodes-blossom
- **GitHub Repository**: https://github.com/HirezRa/n8n-nodes-blossom
- **Documentation**: See README.md for detailed usage examples

## 🏷️ Previous Releases
- **v1.0.2**: Initial release with Basic Auth and API Key support
- **v1.0.1**: First release
```

## שלב 3: הגדרות נוספות
1. **Set as the latest release**: ☑️ (סמן)
2. **Create a discussion for this release**: ☐ (לא לסמן)
3. **Set as a pre-release**: ☐ (לא לסמן)

## שלב 4: פרסום
1. לחץ על "Publish release"
2. ה-Release יופיע בעמוד הראשי של ה-repository
3. התגים יוצגו בעמוד ה-Releases

## שלב 5: הוספת Topics (אופציונלי)
1. לך לעמוד הראשי של ה-repository
2. לחץ על ⚙️ ליד "About"
3. הוסף את ה-Topics הבאים:
   - `n8n-community-node-package`
   - `blossom`
   - `api`
   - `integration`
   - `lms`
   - `learning-management-system`
   - `nodejs`
   - `typescript`
   - `jwt`
   - `oauth2`
