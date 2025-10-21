רשימת מלאה של כל פונקציות ה-API והפרמטרים שלהן
1. UpdateUser
Parameters:

domain (required) - string
details (required) - object/querystring

Available fields: external_id, username, firstname, lastname, password, id, employee_id, email, gender, company, department, employment_date, job_title, about, address, city, zip, birthday, bphone, hphone, mphone, user_nt, disabled, חטיבה, קבלן שטח, קבלן משרדי



2. ImportUsersCSV
Parameters:

domain (required) - string
options (optional) - object/querystring

keep_old_values: [1/0]
temp_password: [1/0]
new_user_notification: [1/0]
password_not_required: [1/0]
clean_ou: [1/0]
manager_ou: [1/0]



3. DeleteUser
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123



4. DeleteUsersCSV
Parameters:

domain (required) - string

5. AvatarSet
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


remove_avatar (required) - boolean

0 = upload, 1 = remove



6. UpdateGroup
Parameters:

domain (required) - string
details (required) - object/querystring

Available fields: name, description, external_id, open_date, close_date, passing_grade, gathering_area, location, audience, estimated_budget, publish_grades_criteria, publish_grades_on_add, hide_score, hide_from_members, hide_from_user_profile, parent_external_id, template_external_id, classification



7. ImportGroupsCSV
Parameters:

domain (required) - string
options (optional) - object/querystring

keep_old_values: [1/0]
manager_type: Manager permissions name OR 'all'/'none'
override_existing_permissions: [1/0]
remove_existing_managers: [1/0]
set_primary_manager: [1/0]



8. DeleteGroup
Parameters:

domain (required) - string
group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



9. AttachSubGroup
Parameters:

domain (required) - string
sub_group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456


parent_group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



10. DetachSubGroup
Parameters:

domain (required) - string
group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



11. AttachInstance
Parameters:

domain (required) - string
group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456


template_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



12. DetachInstance
Parameters:

domain (required) - string
group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



13. AttachUserToGroup
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



14. ImportGroupsMembersCSV
Parameters:

domain (required) - string
options (optional) - string

clean_ou: [1/0]



15. DetachUserFromGroup
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



16. DetachUserFromOu
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123



17. RunAutoEnrollmentRules
Parameters:

None

18. RunScheduledImports
Parameters:

None

19. RemoveEmptyOrgUnits
Parameters:

domain (required) - string

20. AttachManager
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456


manager_type (required) - string

Options: Manager permissions name OR 'all'/'none'


set_primary (required) - int

0 = regular, 1 = set as primary, 2 = remove existing and set as primary



21. DetachManager
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456



22. UserAuthorities
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


authorities (required) - object/querystring

Available fields: user_hr_manager_id, user_professional_manager_id, user_coach_id, user_auth_supervisor_id



23. PowerManager
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


type (required) - string

Options: "PowerManager" or "User"



24. UploadDiploma
Parameters:

domain (required) - string
user_identifier (required) - anyType

Options: user_id=123, user_name=abc, identity_num=123, external_id=a123


group_identifier (required) - anyType

Options: group_id=123, group_external_id=a456


remove_diploma (required) - boolean

0 = upload, 1 = remove



25. UpdateSupplier
Parameters:

domain (required) - string
type (required) - string

Value: "RegExt" for external event institutions


details (required) - object/querystring

Available fields: name, address, email, phone, fax, contact, business_number, supplier_number, external_id



26. DeleteSupplier
Parameters:

domain (required) - string
ext_id (required) - string

27. ImportAssignmentPerformancesCSV
Parameters:

domain (required) - string

28. ImportGroupPerformancesCSV
Parameters:

domain (required) - string

29. Test
Parameters:

None