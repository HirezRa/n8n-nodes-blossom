# Blossom Node – Operations Reference

Quick reference for all Blossom node operations. For detailed field descriptions and examples, see [README](../README.md) and [COMPLETE_FEATURES_LIST](../COMPLETE_FEATURES_LIST.md).

## Base URL & credentials

- **Base URL**: Your Blossom instance, e.g. `https://your-instance.blossom-kc.com` (do **not** include `/WebServices/sync_2`).
- **Credentials**: Blossom API (Basic Auth).

---

## User

| Operation           | Method | Endpoint / behavior |
|--------------------|--------|----------------------|
| Get                | GET    | `GetUser/{{domain}}/{{identifierType}}={{value}}` |
| Update             | POST   | `UpdateUser` (body: domain, details) |
| Delete             | GET    | `DeleteUser/{{domain}}/{{identifierType}}={{value}}` |
| Set Avatar         | POST   | File upload to `AvatarSet/...` or remove |
| Set User Authorities | POST | `UserAuthorities/{{domain}}/...` |
| Power Manager      | GET    | `PowerManager/{{domain}}/.../PowerManager` or `User` |
| Import Users CSV   | POST   | Multipart to `ImportUsersCSV/{{domain}}` (limit: 4/24h) |
| Delete Users CSV   | POST   | Multipart to `DeleteUsersCSV/{{domain}}` (limit: 4/24h) |

**User identifier types:** External ID, User ID, User Name, Identity Number.

---

## Group

| Operation           | Method | Notes |
|--------------------|--------|--------|
| Update              | POST   | Create/update group (type: group, course, role, ou, template, qualification, workplan) |
| Delete              | GET    | By external_id or group_id |
| Attach Sub Group   | POST   | Attach sub workspace to parent |
| Detach Sub Group   | GET    | Detach sub workspace |
| Attach Instance     | POST   | Attach group/course to template |
| Detach Instance    | GET    | Detach from template |
| Import Groups CSV  | POST   | Multipart (limit: 4/24h) |

---

## Membership

| Operation                  | Method | Notes |
|---------------------------|--------|--------|
| Attach User to Group      | GET    | domain, userExternalId, groupExternalId |
| Detach User From Group    | GET    | Leave group external ID empty to detach from all OUs |
| Import Groups Members CSV | POST   | Multipart (limit: 4/24h) |

---

## Manager

| Operation       | Method | Notes |
|----------------|--------|--------|
| Attach Manager | GET    | User, group, manager type, primary flag |
| Detach Manager | GET    | User, group |

---

## Supplier

| Operation      | Method | Notes |
|----------------|--------|--------|
| Update Supplier| GET    | type, externalId, name, email (e.g. RegExt) |
| Delete Supplier| GET    | By supplier external ID |

---

## Performance

| Operation                        | Method | Notes |
|---------------------------------|--------|--------|
| Import Assignment Performances CSV | POST | Multipart |
| Import Group Performances CSV   | POST   | Multipart |
| Upload Diploma                 | POST   | Multipart (upload) or POST (remove) |

---

## Data (api_remote)

| Operation          | Method | Notes |
|--------------------|--------|--------|
| Get User Completion| POST   | Date range, types, filters |
| Get Members Status | POST   | Group, optional start_date |
| Get Groups         | POST   | Optional type filter |
| Get Meetings       | POST   | Workspace(s) and/or user(s), filters |
| Set Due Date       | POST   | User, group, due date (e.g. relative "-0hours") |

---

## Utility

| Operation             | Method | Notes |
|-----------------------|--------|--------|
| Test                  | GET    | `Test` – connection check |
| Run Auto Enrollment Rules | POST | Body: domain (limit: 4/24h) |
| Run Scheduled Imports | POST   | Body: domain (limit: 4/24h) |
| Remove Empty Org Units| POST   | `RemoveEmptyOrgUnits/{{domain}}` |

---

## Rate limits

- General API: 30 requests per second.
- CSV operations & Run Auto Enrollment Rules / Run Scheduled Imports: 4 calls per 24 hours each.

## Sync workflow order

1. Delete Users CSV (if needed)
2. Import Users CSV
3. Import Groups CSV
4. Import Groups Members CSV
5. Run Auto Enrollment Rules (once at the end)
