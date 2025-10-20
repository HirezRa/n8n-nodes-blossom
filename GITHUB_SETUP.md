# הוראות להגדרת GitHub Repository

## שלב 1: יצירת Repository ב-GitHub

1. לך ל-https://github.com/HirezRa
2. לחץ על "New repository" או "New"
3. מלא את הפרטים הבאים:
   - **Repository name**: `n8n-nodes-blossom`
   - **Description**: `n8n community node for Blossom Learning Management System (LMS) API integration`
   - **Visibility**: Public
   - **Initialize this repository with**: 
     - ☑️ Add a README file
     - ☑️ Add .gitignore (בחר Node)
     - ☑️ Choose a license (בחר MIT)

4. לחץ על "Create repository"

## שלב 2: העלאת הקוד

לאחר יצירת ה-repository, הרץ את הפקודות הבאות:

```bash
# הוסף את ה-remote החדש
git remote add origin https://github.com/HirezRa/n8n-nodes-blossom.git

# דחוף את הקוד
git push -u origin main
```

## שלב 3: הגדרת GitHub Pages (אופציונלי)

1. לך ל-Settings של ה-repository
2. גלול למטה ל-"Pages"
3. תחת "Source" בחר "Deploy from a branch"
4. בחר "main" branch
5. לחץ על "Save"

## שלב 4: הוספת Topics

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

## שלב 5: יצירת Release

1. לך ל-"Releases" ב-GitHub
2. לחץ על "Create a new release"
3. בחר את התג `v1.1.0`
4. כתוב כותרת: "Enhanced Blossom Node with JWT and OAuth2 Support"
5. כתוב תיאור:
   ```
   ## What's New
   - Added JWT authentication support
   - Added OAuth 2.0 authentication support
   - Enhanced documentation with detailed examples
   - Updated repository URLs
   
   ## Features
   - Complete Blossom Sync API V2 coverage
   - Multiple authentication methods
   - CSV import/export support
   - File upload capabilities
   - Comprehensive error handling
   ```
6. לחץ על "Publish release"
