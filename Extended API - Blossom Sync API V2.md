תיעוד API - Blossom Sync API V2
מידע כללי
Endpoint URI: https://blossom-kc.com/WebServices/sync_2
סוג אימות: Basic Authentication
תיאור: יצירה, עדכון ומחיקה של אובייקטי מערכת וחיבורם יחד.
הגבלת קצב: 30 בקשות לשנייה

זיהוי אובייקטים
אובייקטים מזוהים באמצעות השדה external_id (בדרך כלל ה-ID ממערכת חיצונית).

סדר ביצוע Sync - שיטות CSV
בעת ביצוע sync run, יש לבצע את הבקשות בסדר הבא:

DeleteUsersCSV
ImportUsersCSV
ImportGroupsCSV
ImportGroupsMembersCSV

הגבלה: כל קריאה מוגבלת למקסימום 4 קריאות לכל 24 שעות.
פורמט קובץ: הקריאות מצפות לקובץ CSV/XLSX במשתנה POST בשם sheet_file או ב-request body. ה-CSV צריך להיות מקודד UTF-8 ולעמוד ב-RFC-4180 או TSV.

UpdateUser
תיאור
Create or update user.
חתימת הפונקציה
string UpdateUser(string domain, object/querystring details)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or iddetailsobject/querystringQuery string (when using GET) or JSON Object (when using POST) that contains keys and values for the user
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין
details: אובייקט JSON או query string המכיל מפתחות וערכים עבור המשתמש

פרמטרים אופציונליים (Optional Parameters)
ניתן להוסיף את הפרמטרים הבאים בתוך details לפי הצורך:
השדות הזמינים בתוך details:

external_id
username
firstname
lastname
password
id
employee_id
email
gender
company
department
employment_date
job_title
about
address
city
zip
birthday
bphone
hphone
mphone
user_nt
disabled
חטיבה
קבלן שטח
קבלן משרדי

הערות לזיהוי שדות מותאמים אישית:

לפי שם
לפי id (field_12)
לפי key (אם הוגדר)

פורמטים:

Date format: yyyy-mm-dd
Checkbox format: 1 or 0

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"details\":{\"external_id\":\"a123\",\"username\":\"billy\",\"password\":\"secret12\",\"firstname\":\"Billy\",\"lastname\":\"Joel\",\"birthday\":\"1949-05-09\"}}" -L "[Endpoint URI]/UpdateUser"
דוגמה 2: Request JSON
json{"domain":1,"details":{"external_id":"a123","username":"billy","password":"secret12","firstname":"Billy","lastname":"Joel","birthday":"1949-05-09"}}
```

### הערות חשובות
When using GET, make sure to url encode the values to prevent collision with reserved characters such as & and /.

---

## ImportUsersCSV

### תיאור
Import multiple users using csv/excel

### חתימת הפונקציה
```
string ImportUsersCSV(string domain, object/querystring options)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or id
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין

פרמטרים אופציונליים (Optional Parameters)
ניתן להוסיף את הפרמטרים הבאים לפי הצורך:
שם הפרמטרסוגתיאורערכים אפשרייםoptions.keep_old_valuesintEmpty cells in the import file won't erase the current profile field values1/0options.temp_passwordintset temporary password for new users1/0options.new_user_notificationintsend users details by mail (requires valid email)1/0options.password_not_requiredintdo not require password for new users (SSO only)1/0options.clean_ouintremove empty org' units (only relevant with manager_ou=1)1/0options.manager_ouintCreate org' unit tree based on management relation1/0
סיכום פרמטרים אופציונליים:

keep_old_values: תאים ריקים בקובץ לא ימחקו ערכי שדות קיימים
temp_password: הגדר סיסמה זמנית למשתמשים חדשים
new_user_notification: שלח פרטי משתמשים במייל (דורש דוא"ל תקין)
password_not_required: אל תדרוש סיסמה למשתמשים חדשים (SSO בלבד)
clean_ou: הסר יחידות ארגוניות ריקות
manager_ou: צור עץ יחידות ארגוניות מבוסס על יחסי ניהול

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/ImportUsersCSV/1/password_not_required=1" -F sheet_file=@filename.csv
דוגמה 2: CURL with manager_ou
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/ImportUsersCSV/1/password_not_required=1&manager_ou=1&clean_ou=1" -F sheet_file=@filename.csv
הערות חשובות

updating a deleted user using ImportUsers or UpdateUser will restore them
row level errors include an identifer field username to assist in rectifying the problem in data
max of 4 calls per 24 hours
When manager_ou is active, the following columns should be added to the file: "manager_ou","ou_name". The organizational tree will be created automatically using these columns.

דוגמאות תגובה (Response Examples)
הכל תקין
json{
    "res": "success",
    "results": []
}
שגיאה קריטית
json{
    "res": "error",
    "error_msg": "Cannot continue, the following fields are missing: something, mandatory"
}
שורה עם שגיאות ואזהרות
json{
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
                },
                {
                    "type": "error",
                    "col_name": "user_timezone",
                    "message": "Invalid value"
                }
            ]
        },
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

---

## DeleteUser

### תיאור
Delete user

### חתימת הפונקציה
```
string DeleteUser(string domain, anyType user_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DeleteUser/1/external_id=a123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"}}" -L "[Endpoint URI]/DeleteUser"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"}}
```

---

## DeleteUsersCSV

### תיאור
delete multiple users using csv/excel

### חתימת הפונקציה
```
string DeleteUsersCSV(string domain)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or id
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/DeleteUsersCSV/1" -F sheet_file=@filename.csv
הערות חשובות

deleting a user does not remove them from the database ("soft" delete)
updating a deleted user using ImportUsers or UpdateUser will restore them
deleting an already deleted or non-existing user does not trigger a warning
max of 4 calls per 24 hours

דוגמאות תגובה (Response Examples)
הכל תקין
json{
    "res": "success",
    "results": []
}
שגיאה קריטית
json{
    "res": "error",
    "error_msg": "Cannot continue, the following fields are missing: something, mandatory"
}
```

---

## AvatarSet

### תיאור
Update or remove user avatar. (REST ONLY)

### חתימת הפונקציה
```
string AvatarSet(string domain, anyType user_identifier, boolean remove_avatar)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורערכים אפשרייםdomainstringDomain name or id-user_identifieranyTypeUser external ID or identifier pairuser_id=123, user_name=abc, identity_num=123, external_id=a123
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין
user_identifier: מזהה משתמש חיצוני או זוג מזהים

פרמטרים אופציונליים (Optional Parameters)
ניתן להוסיף את הפרמטרים הבאים לפי הצורך:
שם הפרמטרסוגתיאורremove_avatarboolean1 to remove current avatar, otherwise 0. A file should not be attached upon removal.
סיכום פרמטרים אופציונליים:

remove_avatar: 1 להסרת אווטאר קיים, אחרת 0

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/AvatarSet/1/external_id=a123/0" -F avatarfile=@filename.jpg
```

### הערות חשובות
- POST request
- The file should be added as 'avatarfile' (jpg/png) or in the request body (jpg)

---

## UpdateGroup

### תיאור
Create or update group object (Group/Course/Role/Ou/Template/Qualification/Workplan).

### חתימת הפונקציה
```
string UpdateGroup(string domain, object/querystring details)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור |
|-----------|-----|--------|
| domain | string | Domain name or id |
| details | object/querystring | Query string that contains keys and values for the group object |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- details: query string המכיל מפתחות וערכים עבור אובייקט הקבוצה

### פרמטרים אופציונליים (Optional Parameters)

**ניתן להוסיף את הפרמטרים הבאים בתוך details לפי הצורך:**

השדות הזמינים בתוך `details`:
- name
- description
- external_id
- open_date
- close_date
- passing_grade
- gathering_area
- location
- audience
- estimated_budget
- publish_grades_criteria
- publish_grades_on_add
- hide_score
- hide_from_members
- hide_from_user_profile
- parent_external_id
- template_external_id
- classification

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/UpdateGroup/1/external_id=a456&name=group_name&type=course&description=The%20course%20description&open_date=2021-01-20
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"details\":{\"external_id\":\"a456\",\"name\":\"group_name\",\"type\":\"course\",\"description\":\"The course description\",\"open_date\":\"2021-01-20\"}}" -L "[Endpoint URI]/UpdateGroup"
דוגמה 3: Request JSON
json{"domain":1,"details":{"external_id":"a456","name":"group_name","type":"course","description":"The course description","open_date":"2021-01-20"}}
```

### הערות חשובות
When using GET, make sure to url encode the values to prevent collision with reserved characters such as & and /.

---

## ImportGroupsCSV

### תיאור
Import multiple workspaces using csv/excel

### חתימת הפונקציה
```
string ImportGroupsCSV(string domain, object/querystring options)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or id
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין

פרמטרים אופציונליים (Optional Parameters)
ניתן להוסיף את הפרמטרים הבאים לפי הצורך:
שם הפרמטרסוגתיאורערכים אפשרייםoptions.keep_old_valuesintEmpty cells in the import file won't erase the current profile field values1/0options.manager_typestringManager permissions name'all'/'none' or permission nameoptions.override_existing_permissionsintOverride existing managers permissions1/0options.remove_existing_managersintRemove existing managers1/0options.set_primary_managerintSet as primary manager1/0
סיכום פרמטרים אופציונליים:

keep_old_values: תאים ריקים בקובץ לא ימחקו ערכי שדות קיימים
manager_type: שם הרשאות מנהל או 'all'/'none'
override_existing_permissions: דרוס הרשאות מנהלים קיימות
remove_existing_managers: הסר מנהלים קיימים
set_primary_manager: הגדר כמנהל ראשי

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/ImportGroupsCSV/1/keep_old_values=1&manager_type=all&override_existing_permissions=0&remove_existing_managers=0&set_primary_manager=0" -F sheet_file=@filename.csv
הערות חשובות

row level errors include an identifer field group_external_id (when set) to assist in rectifying the problem in data
max of 4 calls per 24 hours

דוגמאות תגובה (Response Examples)
הכל תקין
json{
    "res": "success",
    "results": []
}
שגיאה קריטית - external id מופיע יותר מפעם אחת
json{
    "res": "error",
    "error_msg": "Cannot continue, the following external id appear more than once: 12345678"
}
שגיאה קריטית - parent workspace חסר
json{
    "res": "error",
    "error_msg": "Cannot continue, the following parents are missing: 12345678"
}
אזהרה ברמת שורה - מנהל לא נמצא
json{
    "res": "success",
    "results": [
        {
            "row": 2,
            "res": "success",
            "group_external_id": "a456",
            "issues": [
                {
                    "type": "warning",
                    "col_name": "manager_external_id",
                    "message": "Manager is missing"
                }
            ]
        }
    ]
}
שגיאה ברמת שורה - שם קבוצה קיים
json{
    "res": "success",
    "results": [
        {
            "row": 2,
            "res": "error",
            "issues": [
                {
                    "type": "error",
                    "col_name": "group_name",
                    "message": "Name already exists: #42074  external_id=aaa11"
                }
            ],
            "group_external_id": "aaa114312",
            "status_error": "invalid data"
        }
    ]
}
```

---

## DeleteGroup

### תיאור
Delete a group object

### חתימת הפונקציה
```
string DeleteGroup(string domain, anyType group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DeleteGroup/1/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/DeleteGroup"
דוגמה 3: Request JSON
json{"domain":1,"group_identifier":{"group_id":"123"}}
```

---

## AttachSubGroup

### תיאור
Attach sub group to a parent group (Group/Course/Ou - both group should be of the same type)

### חתימת הפונקציה
```
string AttachSubGroup(string domain, anyType sub_group_identifier, anyType parent_group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| sub_group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |
| parent_group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- sub_group_identifier: מזהה קבוצת משנה
- parent_group_identifier: מזהה קבוצת אב

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/AttachSubGroup/1/group_id=123/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"sub_group_identifier\":{\"group_id\":\"123\"},\"parent_group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/AttachSubGroup"
דוגמה 3: Request JSON
json{"domain":1,"sub_group_identifier":{"group_id":"123"},"parent_group_identifier":{"group_id":"123"}}
```

---

## DetachSubGroup

### תיאור
Detach a sub group from its only parent (Group/Course/Ou)

### חתימת הפונקציה
```
string DetachSubGroup(string domain, anyType group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DetachSubGroup/1/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/DetachSubGroup"
דוגמה 3: Request JSON
json{"domain":1,"group_identifier":{"group_id":"123"}}
```

---

## AttachInstance

### תיאור
Attach Group/Course to a Template

### חתימת הפונקציה
```
string AttachInstance(string domain, anyType group_identifier, anyType template_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |
| template_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- group_identifier: מזהה קבוצה
- template_identifier: מזהה תבנית

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/AttachInstance/1/group_id=123/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"group_identifier\":{\"group_id\":\"123\"},\"template_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/AttachInstance"
דוגמה 3: Request JSON
json{"domain":1,"group_identifier":{"group_id":"123"},"template_identifier":{"group_id":"123"}}
```

---

## DetachInstance

### תיאור
Detach Group/Course from its only Template

### חתימת הפונקציה
```
string DetachInstance(string domain, anyType group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DetachInstance/1/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/DetachInstance"
דוגמה 3: Request JSON
json{"domain":1,"group_identifier":{"group_id":"123"}}
```

---

## AttachUserToGroup

### תיאור
Attach user to a group object (Group/Course/Ou/Qualification/Workplan)

### חתימת הפונקציה
```
string AttachUserToGroup(string domain, anyType user_identifier, anyType group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/AttachUserToGroup/1/external_id=a123/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/AttachUserToGroup"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"group_identifier":{"group_id":"123"}}
```

---

## ImportGroupsMembersCSV

### תיאור
attach multiple users to workspaces using csv/excel

### חתימת הפונקציה
```
string ImportGroupsMembersCSV(string domain, string options)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or id
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין

פרמטרים אופציונליים (Optional Parameters)
ניתן להוסיף את הפרמטרים הבאים לפי הצורך:
שם הפרמטרסוגתיאורערכים אפשרייםoptions.clean_ouintremove empty org' units1/0
סיכום פרמטרים אופציונליים:

clean_ou: הסר יחידות ארגוניות ריקות

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/ImportGroupsMembersCSV/1/clean_ou=1" -F sheet_file=@filename.csv
הערות חשובות

row level errors include identifier fields based on the submitted fields, to assist in rectifying the problem in data
max of 4 calls per 24 hours

דוגמאות תגובה (Response Examples)
הכל תקין
json{
    "res": "success",
    "results": []
}
שגיאה קריטית
json{
    "res": "error",
    "error_msg": "Cannot continue, the following fields are missing: something, mandatory"
}
שורה עם שגיאות
json{
    "res": "success",
    "results": [
        {
            "row": 2,
            "res": "error",
            "user_external_id": "a123",
            "workspace_external_id": "a456",
            "issues": [
                {
                    "type": "error",
                    "col_name": "user_external_id",
                    "message": "no relevant match found for this value"
                },
                {
                    "type": "error",
                    "col_name": "workspace_external_id",
                    "message": "no relevant match found for this value"
                }
            ]
        }
    ]
}
```

---

## DetachUserFromGroup

### תיאור
Detach user from a group object (Group/Course/Ou/Qualification/Workplan)

### חתימת הפונקציה
```
string DetachUserFromGroup(string domain, anyType user_identifier, anyType group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DetachUserFromGroup/1/external_id=a123/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/DetachUserFromGroup"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"group_identifier":{"group_id":"123"}}
```

---

## DetachUserFromOu

### תיאור
Detach user from its only ou

### חתימת הפונקציה
```
string DetachUserFromOu(string domain, anyType user_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DetachUserFromOu/1/external_id=a123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"}}" -L "[Endpoint URI]/DetachUserFromOu"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"}}
```

---

## RunAutoEnrollmentRules

### תיאור
Execute auto enrollment rules for all workspaces and users.

### חתימת הפונקציה
```
string RunAutoEnrollmentRules()
פרמטרים חובה (Required Parameters)
אין פרמטרים חובה לפונקציה זו
סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: POST request
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/RunAutoEnrollmentRules"
הערות חשובות

It is recommended to call this method when done updating users and workspaces
Please only call this method outside of working hours, as it may take a while to process
Max of 4 calls per 24 hours

דוגמאות תגובה (Response Examples)
json{
    "res": "success"
}
```

---

## RunScheduledImports

### תיאור
Execute scheduled imports.

### חתימת הפונקציה
```
string RunScheduledImports()
פרמטרים חובה (Required Parameters)
אין פרמטרים חובה לפונקציה זו
סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: POST request
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/RunScheduledImports"
הערות חשובות

You cannot run this on midnight because the scheduled imports will run on midnight regardless
Max of 4 calls per 24 hours

דוגמאות תגובה (Response Examples)
json{
    "res": "success"
}
```

---

## RemoveEmptyOrgUnits

### תיאור
Delete org' units with no members, managers, or relevant hierarchy. Same as clean_ou=1 in ImportGroupsMembersCSV and ImportUsersCSV

### חתימת הפונקציה
```
string RemoveEmptyOrgUnits(string domain)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור |
|-----------|-----|--------|
| domain | string | Domain name or id |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/RemoveEmptyOrgUnits/1
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1}" -L "[Endpoint URI]/RemoveEmptyOrgUnits"
דוגמה 3: Request JSON
json{"domain":1}
דוגמאות תגובה (Response Examples)
json{
    "res": "success"
}
```

---

## AttachManager

### תיאור
Attach manager to a group object (Group/Course/Role/Ou/Template/Qualification/Workplan)

### חתימת הפונקציה
```
string AttachManager(string domain, anyType user_identifier, anyType group_identifier, string manager_type, int set_primary)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### פרמטרים אופציונליים (Optional Parameters)

**ניתן להוסיף את הפרמטרים הבאים לפי הצורך:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| manager_type | string | Manager permissions name | 'all', 'none', or specific permission name |
| set_primary | int | Set manager as primary or remove existing managers | 1: set manager as primary<br>2: remove existing managers and add this manager as primary<br>otherwise 0 |

**סיכום פרמטרים אופציונליים:**
- manager_type: שם הרשאות מנהל או 'all'/'none'
- set_primary: הגדר מנהל כראשי (1), הסר מנהלים קיימים והגדר זה כראשי (2), אחרת 0

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/AttachManager/1/external_id=a123/group_id=123/all/0
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"group_identifier\":{\"group_id\":\"123\"},\"manager_type\":\"all\",\"set_primary\":\"0\"}" -L "[Endpoint URI]/AttachManager"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"group_identifier":{"group_id":"123"},"manager_type":"all","set_primary":"0"}
```

---

## DetachManager

### תיאור
Detach manager from a group object (Group/Course/Role/Ou/Template/Qualification/Workplan)

### חתימת הפונקציה
```
string DetachManager(string domain, anyType user_identifier, anyType group_identifier)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DetachManager/1/external_id=a123/group_id=123
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"group_identifier\":{\"group_id\":\"123\"}}" -L "[Endpoint URI]/DetachManager"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"group_identifier":{"group_id":"123"}}
```

---

## UserAuthorities

### תיאור
Attach authorities to user (Human resources coordinator, Professional manager, Personal coach)

### חתימת הפונקציה
```
string UserAuthorities(string domain, anyType user_identifier, object/querystring authorities)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |
| authorities | object/querystring | Query string/JSON that contains the authority user's external ID or identifier pair | - |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים
- authorities: אובייקט JSON או query string המכיל מזהה חיצוני או זוג מזהים של המשתמש בעל הסמכות

### השדות הזמינים ב-authorities

- user_hr_manager_id
- user_professional_manager_id
- user_coach_id
- user_auth_supervisor_id

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/UserAuthorities/1/external_id=a123/user_hr_manager_id=a007&user_professional_manager_id=a007&user_coach_id=a007&user_auth_supervisor_id=a007
```

#### דוגמה 2: GET request with user_id
```
[Endpoint URI]/UserAuthorities/1/external_id=a123/user_hr_manager_id=user_id=1234&user_professional_manager_id=user_id=1234&user_coach_id=user_id=1234&user_auth_supervisor_id=user_id=1234
דוגמה 3: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"authorities\":{\"user_hr_manager_id\":\"a007\",\"user_professional_manager_id\":\"a007\",\"user_coach_id\":\"a007\",\"user_auth_supervisor_id\":\"a007\"}}" -L "[Endpoint URI]/UserAuthorities"
דוגמה 4: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"authorities":{"user_hr_manager_id":"a007","user_professional_manager_id":"a007","user_coach_id":"a007","user_auth_supervisor_id":"a007"}}
```

### הערות חשובות
- to clear, pass an empty value
- authorities that are not included will not change

---

## PowerManager

### תיאור
Set/unset user as power manager

### חתימת הפונקציה
```
string PowerManager(string domain, anyType user_identifier, string type)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים

### פרמטרים אופציונליים (Optional Parameters)

**ניתן להוסיף את הפרמטרים הבאים לפי הצורך:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| type | string | Set or unset power manager | PowerManager, User |

**סיכום פרמטרים אופציונליים:**
- type: PowerManager להגדרה כמנהל כוח, User לביטול

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request - set PowerManager
```
[Endpoint URI]/PowerManager/1/external_id=a123/PowerManager
```

#### דוגמה 2: GET request - unset PowerManager
```
[Endpoint URI]/PowerManager/1/external_id=a123/User
דוגמה 3: POST request - set PowerManager
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"type\":\"PowerManager\"}" -L "[Endpoint URI]/PowerManager"
דוגמה 4: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"type":"PowerManager"}
```

---

## UploadDiploma

### תיאור
Upload or remove diploma file for a user in a group object. (REST ONLY)

### חתימת הפונקציה
```
string UploadDiploma(string domain, anyType user_identifier, anyType group_identifier, boolean remove_diploma)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור | ערכים אפשריים |
|-----------|-----|--------|----------------|
| domain | string | Domain name or id | - |
| user_identifier | anyType | User external ID or identifier pair | user_id=123, user_name=abc, identity_num=123, external_id=a123 |
| group_identifier | anyType | Group external ID or identifier pair | group_id=123, group_external_id=a456 |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- user_identifier: מזהה משתמש חיצוני או זוג מזהים
- group_identifier: מזהה קבוצה חיצוני או זוג מזהים

### פרמטרים אופציונליים (Optional Parameters)

**ניתן להוסיף את הפרמטרים הבאים לפי הצורך:**

| שם הפרמטר | סוג | תיאור |
|-----------|-----|--------|
| remove_diploma | boolean | 1 to remove current diploma, otherwise 0. A file should not be attached upon removal. |

**סיכום פרמטרים אופציונליים:**
- remove_diploma: 1 להסרת דיפלומה קיימת, אחרת 0

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/UploadDiploma/1/external_id=a123/group_id=123/0
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"user_identifier\":{\"external_id\":\"a123\"},\"group_identifier\":{\"group_id\":\"123\"},\"remove_diploma\":\"0\"}" -L "[Endpoint URI]/UploadDiploma"
דוגמה 3: Request JSON
json{"domain":1,"user_identifier":{"external_id":"a123"},"group_identifier":{"group_id":"123"},"remove_diploma":"0"}
```

### הערות חשובות
- POST request
- The file should be added as 'diploma_file'

---

## UpdateSupplier

### תיאור
Create or update supplier by external ID.

### חתימת הפונקציה
```
string UpdateSupplier(string domain, string type, object/querystring details)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור |
|-----------|-----|--------|
| domain | string | Domain name or id |
| type | string | Insert RegExt for external event institutions |
| details | object/querystring | Query string that contains keys and values |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין
- type: הכנס RegExt עבור מוסדות אירועים חיצוניים
- details: query string המכיל מפתחות וערכים

### השדות הזמינים ב-details

- name
- address
- email
- phone
- fax
- contact
- business_number
- supplier_number
- external_id

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/UpdateSupplier/1/RegExt/external_id=abcd&name=Elton%20John&address=Old%20Windsor&phone=123-456&email=elton@example.com&contact=John%20Reid&business_number=12345
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"type\":\"RegExt\",\"details\":{\"external_id\":\"abcd\",\"name\":\"Elton John\",\"address\":\"Old Windsor\",\"phone\":\"123-456\",\"email\":\"elton@example.com\",\"contact\":\"John Reid\",\"business_number\":\"12345\"}}" -L "[Endpoint URI]/UpdateSupplier"
דוגמה 3: Request JSON
json{"domain":1,"type":"RegExt","details":{"external_id":"abcd","name":"Elton John","address":"Old Windsor","phone":"123-456","email":"elton@example.com","contact":"John Reid","business_number":"12345"}}
```

### הערות חשובות
When using GET, make sure to url encode the values to prevent collision with reserved characters such as & and /.

---

## DeleteSupplier

### תיאור
Delete supplier by external_id

### חתימת הפונקציה
```
string DeleteSupplier(string domain, string ext_id)
```

### פרמטרים חובה (Required Parameters)

**יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:**

| שם הפרמטר | סוג | תיאור |
|-----------|-----|--------|
| domain | string | Domain name or id |

**סיכום פרמטרים חובה:**
- domain: שם או מזהה דומיין

### פרמטרים אופציונליים (Optional Parameters)

**ניתן להוסיף את הפרמטרים הבאים לפי הצורך:**

| שם הפרמטר | סוג | תיאור |
|-----------|-----|--------|
| ext_id | string | External ID |

**סיכום פרמטרים אופציונליים:**
- ext_id: מזהה חיצוני

### סוג ההחזרה (Return Type)
string: JSON with success or failure details

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/DeleteSupplier/1/abcd
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -H "Content-Type: application/json" -d "{\"domain\":1,\"ext_id\":\"abcd\"}" -L "[Endpoint URI]/DeleteSupplier"
דוגמה 3: Request JSON
json{"domain":1,"ext_id":"abcd"}
```

---

## ImportAssignmentPerformancesCSV

### תיאור
Import assignment performances using csv/excel

### חתימת הפונקציה
```
string ImportAssignmentPerformancesCSV(string domain)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or id
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/ImportAssignmentPerformancesCSV/1" -F sheet_file=@filename.csv
דוגמאות תגובה (Response Examples)
הכל תקין
json{
    "res": "success",
    "results": []
}
דוגמה לשגיאות
json{
    "res": "success",
    "results": [
        {
            "row": 2,
            "res": "error",
            "issues": [
                {
                    "type": "error",
                    "col_name": "date",
                    "message": "Performance already exist on that day (grade: 90 completed: Yes)"
                }
            ],
            "user_name": "Michal_PM",
            "date": "20/01/2015"
        },
        {
            "row": 3,
            "res": "error",
            "issues": [
                {
                    "type": "error",
                    "col_name": "assignment_id",
                    "message": "No relevant match found for this value"
                },
                {
                    "type": "error",
                    "col_name": "user_name",
                    "message": "No relevant match found for this value"
                }
            ]
        }
    ]
}
שגיאה קריטית
json{
    "res": "error",
    "error_msg": "Cannot continue, the file must contain the column user_name or user_external_id."
}
```

---

## ImportGroupPerformancesCSV

### תיאור
Import performances for qualifications and courses using csv/excel

### חתימת הפונקציה
```
string ImportGroupPerformancesCSV(string domain)
פרמטרים חובה (Required Parameters)
יש לצרף את הפרמטרים הבאים בכל קריאה לפונקציה:
שם הפרמטרסוגתיאורdomainstringDomain name or id
סיכום פרמטרים חובה:

domain: שם או מזהה דומיין

סוג ההחזרה (Return Type)
string: JSON with success or failure details
דוגמאות שימוש
דוגמה 1: CURL
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/ImportGroupPerformancesCSV/1" -F sheet_file=@filename.csv
דוגמאות תגובה (Response Examples)
הכל תקין
json{
    "res": "success",
    "results": []
}
דוגמה לשגיאות
json{
    "res": "success",
    "results": [
        {
            "row": 3,
            "res": "error",
            "issues": [
                {
                    "type": "error",
                    "col_name": "user_name",
                    "message": "No relevant match found for this value"
                }
            ]
        }
    ]
}
שגיאה קריטית
json{
    "res": "error",
    "error_msg": "Cannot continue, the file must contain the column user_name or user_external_id."
}
```

---

## Test

### תיאור
Test method

### חתימת הפונקציה
```
string Test()
```

### פרמטרים חובה (Required Parameters)

**אין פרמטרים חובה לפונקציה זו**

### סוג ההחזרה (Return Type)
string: JSON with protocol and a random number

### דוגמאות שימוש

#### דוגמה 1: GET request
```
[Endpoint URI]/Test
דוגמה 2: POST request
bashcurl -X POST -u "user:password" -L "[Endpoint URI]/Test"

טיפול בשגיאות (Error Handling)
בעת שגיאה, קוד הסטטוס יהיה 50x או 40x והתגובה תכלול את השדות הבאים: "res":"error" ו-"error_msg".
דוגמת תגובה
json{
    "res": "error",
    "error_msg": "To err is human but to really foul things up you need a computer."
}
דוגמת תגובה #2
השגיאה הבאה מצביעה על כך שיש לשנות את URL הבקשה מ-https://platform.blossom-kc.com/platform/xyz/... ל-https://platform.blossom-kc.com/xyz/...
html<script>location.pathname = location.pathname.replace('platform/', '')</script>

אימות JWT (JWT Authentication)
JWT מושבת כרגע. כדי להפעיל, יש לעבור להגדרות השרת ולשנות את סוג האימות.
אלגוריתמים נתמכים: ES256, HS256, HS384, HS512, RS256, RS384, RS512
מבנה ה-payload:
json{
    "iss": "<user_name>",
    "exp": <unix timestamp of a date in the near future>
}
המפתח: הסיסמה המוגדרת במערכת

אימות OAuth 2.0 (OAuth 2.0 Authentication)
OAuth 2.0 מושבת כרגע. כדי להפעיל, יש לעבור להגדרות השרת ולסמן את תיבת הסימון OAuth2.
קבלת auth token:
יש להשתמש בשיטת האימות שנבחרה ל: [Endpoint URI]?auth_token
מבנה ה-payload:
json{
    "expires_in": <unix timestamp of a date in the near future>,
    "auth_token": "<the auth token string>"
}
הערה: Refresh tokens אינם נתמכים.

משאבים נוספים
קבצי דוגמה: samples.zip
דוגמאות Postman: https://www.postman.com/solar-spaceship-524590/blossom-platform-api
מדריך JWT: ניתן למצוא פרטים על סוג אימות זה במדריך

הערות כלליות

הבקשות מוגבלות ל-30 לשנייה. יש לוודא שלא חורגים ממגבלה זו
קריאות CSV מוגבלות למקסימום 4 קריאות לכל 24 שעות
הקבצים צריכים להיות מקודדים UTF-8 ולעמוד ב-RFC-4180 או TSV
בעת שימוש ב-GET, יש לוודא url encoding של הערכים למניעת התנגשות עם תווים שמורים כגון & ו-/