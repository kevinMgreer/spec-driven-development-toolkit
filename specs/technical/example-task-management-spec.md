# Task Management — Technical Spec

| Field            | Value                                    |
| ---------------- | ---------------------------------------- |
| **Status**       | Approved                                 |
| **Version**      | 1.0                                      |
| **Feature file** | `specs/features/example-task-management.feature` |
| **Last updated** | 2026-04-13                               |

---

## Overview

Allows authenticated users to create, view, complete, and delete personal tasks. Tasks belong to
the user who created them and are not shared. This feature covers the core CRUD lifecycle for a
single task entity.

---

## Actors

| Actor                   | Role                                                   |
| ----------------------- | ------------------------------------------------------ |
| Registered user         | Creates, views, completes, and deletes their own tasks |
| Unauthenticated visitor | Cannot access any task operations                      |

---

## Scope

### In Scope

- Creating a task with a title
- Listing all tasks for the authenticated user
- Marking a task as complete or incomplete (toggle)
- Deleting a task

### Out of Scope

- Task due dates, priorities, or categories (future)
- Sharing tasks with other users (future)
- Task search or filtering (future)
- Subtasks or checklists (future)

---

## Business Rules

1. **Title is required**: A task must have a non-empty title. Whitespace-only titles are treated
   as empty.
   - Example: Submitting `"  "` is equivalent to submitting `""` and must be rejected.

2. **Title length limit**: Task titles must be 255 characters or fewer.
   - Example: A title of 256 characters must be rejected with a validation error.

3. **Duplicate titles allowed**: A user may have multiple tasks with the same title. There is no
   uniqueness constraint on titles.
   - Example: Two tasks both named "Review PR" are valid.

4. **Tasks are user-scoped**: A user may only view, complete, or delete their own tasks.
   - Example: User A cannot delete a task created by User B, even with a valid task ID.

5. **Status defaults to incomplete**: Newly created tasks always start in the incomplete state.
   - Example: `POST /api/tasks` with a valid title returns a task with `"status": "incomplete"`.

6. **Status is a toggle**: Marking an incomplete task as complete and then as incomplete is fully
   supported — there is no one-way state machine.

---

## API Contract

### `POST /api/tasks`

**Request body**:

```json
{
  "title": "string — the task title (required, 1–255 characters)"
}
```

**Success response** (`201 Created`):

```json
{
  "id": "string — unique identifier (UUID)",
  "title": "string",
  "status": "incomplete",
  "createdAt": "string — ISO 8601 timestamp"
}
```

**Error responses**:

| HTTP Status        | Condition                         | Response body                                               |
| ------------------ | --------------------------------- | ----------------------------------------------------------- |
| `400 Bad Request`  | Title is empty or whitespace-only | `{ "error": "Task title is required" }`                     |
| `400 Bad Request`  | Title exceeds 255 characters      | `{ "error": "Task title must be 255 characters or fewer" }` |
| `401 Unauthorized` | No valid auth token               | `{ "error": "Unauthorized" }`                               |

---

### `GET /api/tasks`

**Success response** (`200 OK`):

```json
[
  {
    "id": "string",
    "title": "string",
    "status": "incomplete | complete",
    "createdAt": "string — ISO 8601"
  }
]
```

Returns empty array `[]` if the user has no tasks.

**Error responses**:

| HTTP Status        | Condition           | Response body                 |
| ------------------ | ------------------- | ----------------------------- |
| `401 Unauthorized` | No valid auth token | `{ "error": "Unauthorized" }` |

---

### `PATCH /api/tasks/:id`

**Request body**:

```json
{
  "status": "complete | incomplete"
}
```

**Success response** (`200 OK`): Updated task object (same shape as `POST` response).

**Error responses**:

| HTTP Status        | Condition                                 | Response body                                              |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------- |
| `400 Bad Request`  | Invalid status value                      | `{ "error": "Status must be 'complete' or 'incomplete'" }` |
| `401 Unauthorized` | No valid auth token                       | `{ "error": "Unauthorized" }`                              |
| `404 Not Found`    | Task not found or belongs to another user | `{ "error": "Task not found" }`                            |

---

### `DELETE /api/tasks/:id`

**Success response** (`204 No Content`): Empty body.

**Error responses**:

| HTTP Status        | Condition                                 | Response body                   |
| ------------------ | ----------------------------------------- | ------------------------------- |
| `401 Unauthorized` | No valid auth token                       | `{ "error": "Unauthorized" }`   |
| `404 Not Found`    | Task not found or belongs to another user | `{ "error": "Task not found" }` |

---

## Data Constraints

| Field       | Type     | Required              | Constraints                         |
| ----------- | -------- | --------------------- | ----------------------------------- |
| `id`        | `string` | ✅ (system-generated) | UUID v4                             |
| `title`     | `string` | ✅                    | Non-empty after trim, max 255 chars |
| `status`    | `enum`   | ✅                    | `"incomplete"` \| `"complete"`      |
| `createdAt` | `string` | ✅ (system-generated) | ISO 8601 UTC                        |

---

## Dependencies

| Dependency             | Type        | Purpose                                    |
| ---------------------- | ----------- | ------------------------------------------ |
| Authentication service | Internal    | Validate user identity and extract user ID |
| Database               | Persistence | Store and retrieve task records            |

---

## Security Considerations

- All endpoints require a valid authentication token
- Task operations are scoped to the authenticated user — user ID extracted from auth token, never
  from the request body
- The `404 Not Found` response is used for both "task doesn't exist" and "task belongs to another
  user" to prevent user enumeration
