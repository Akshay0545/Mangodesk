# Minutes-AI Public API (v1)

Base URL (prod):  
```
https://<your-backend-domain>/api
```

Versioning: Prefix all endpoints with `/v1` **if** you plan to version. The examples below assume:
```
https://<your-backend-domain>/api
```
(If you add versioning, replace `/api` with `/api/v1`.)

Auth (recommended):  
Use a static API key for now. Send it with each request:
```
Authorization: Bearer <YOUR_API_KEY>
```
> If you haven’t wired auth yet, omit the header and add it later—this doc is forward-compatible.

Content-Type: `application/json`

---

## Quickstart

### Generate a summary
```bash
curl -X POST https://<host>/api/summary/generate   -H "Authorization: Bearer <API_KEY>"   -H "Content-Type: application/json"   -d '{
    "title": "Sprint 18 Planning",
    "prompt": "Summarize in 6-10 bullets. Include Action Items and Decisions.",
    "transcript": "[00:00] PM: Thanks for joining... (rest of transcript)"
  }'
```

**201 Created**
```json
{
  "message": "Summary generated successfully",
  "summary": {
    "_id": "66cfe0c7f2f9a5f0e1b7d292",
    "title": "Sprint 18 Planning",
    "content": "## Summary\n- ...",
    "originalTranscript": "[00:00] PM: Thanks for joining...",
    "prompt": "Summarize in 6-10 bullets. Include Action Items and Decisions.",
    "isShared": false,
    "sharedWith": [],
    "shareToken": null,
    "createdAt": "2025-08-17T08:40:23.512Z",
    "updatedAt": "2025-08-17T08:40:23.512Z"
  }
}
```

---

## Resources

### Summary object
```ts
Summary {
  _id: string
  title: string
  content: string                 // AI-generated Markdown
  originalTranscript: string      // Raw transcript text
  prompt: string                  // Instruction used
  isShared: boolean
  sharedWith: { email: string, sharedAt: string }[]
  shareToken: string | null       // For share links
  createdAt: string (ISO)
  updatedAt: string (ISO)
}
```

---

## Endpoints

### 1) Generate a summary
**POST** `/summary/generate`

Create an AI summary from a transcript and optional prompt.

**Body**
```json
{
  "title": "string (optional)",
  "prompt": "string (optional, default: concise bullet summary)",
  "transcript": "string (required)"
}
```

**Responses**
- `201 Created` → `{ message, summary }`
- `400 Bad Request` → `{ error: "Transcript is required" }`
- `500 Internal Server Error` → `{ error: "Failed to generate summary" }`

---

### 2) List summaries (newest first)
**GET** `/summary`

**Query (optional)**
- `q`: simple search (future enhancement)
- `limit`: number (default 20, max 100)
- `cursor`: string for pagination (future enhancement)

**Responses**
- `200 OK` → `Summary[]`

---

### 3) Get a summary by id
**GET** `/summary/:id`

**Responses**
- `200 OK` → `Summary`
- `404 Not Found` → `{ error: "Summary not found" }`

---

### 4) Update a summary
**PUT** `/summary/:id`

**Body** (any subset)
```json
{
  "title": "string",
  "content": "string"
}
```

**Responses**
- `200 OK` → `{ message: "Summary updated successfully", summary }`
- `400 Bad Request` → `{ error: "Nothing to update" }`
- `404 Not Found` → `{ error: "Summary not found" }`

---

### 5) Delete a summary
**DELETE** `/summary/:id`

**Responses**
- `200 OK` → `{ message: "Summary deleted successfully" }`
- `404 Not Found` → `{ error: "Summary not found" }`

---

### 6) Share a summary via email
**POST** `/summary/:id/share`

Sends the **summary content only** by email to one or more recipients.  
(Your backend already supports validating and deduplicating emails.)

**Body**
```json
{
  "emails": ["alice@company.com", "bob@company.com"]
  // or "emails": "alice@company.com, bob@company.com"
}
```

**Responses**
- `200 OK` → `{ message: "Summary shared successfully", summary }`
- `400 Bad Request` → `{ error: "At least one email is required" }`
- `400 Bad Request` → `{ error: "Invalid emails: ..." }`
- `404 Not Found` → `{ error: "Summary not found" }`
- `500 Internal Server Error` → `{ error: "Failed to share summary" }`

---

### 7) Get a shared summary (token)
**GET** `/summary/shared/:token`

Fetch a read-only shared summary by token.  
(Useful if a partner wants to render a public view themselves.)

**Responses**
- `200 OK` → `Summary`
- `404 Not Found` → `{ error: "Shared summary not found" }`

---

### 8) Health check
**GET** `/health`

**Response**
```json
{ "status": "OK", "message": "Minutes-AI API is running" }
```

---

## Errors

All errors follow:
```json
{
  "error": "Human readable message"
}
```

Common codes:
- `400` — validation error (missing transcript, invalid email)
- `404` — not found (summary or token)
- `429` — rate limited (if you enable it)
- `500` — internal error

---

## Notes for Integrators
- Responses are JSON; summary content is **Markdown**.
- For very large transcripts, the backend chunks and merges behind the scenes.
- Email sends **only** the summary body with the sender **Minutes-AI**.
