# 📚 API Documentation - DFD Automation

Complete API reference untuk DFD Automation Generator.

## 🌐 Base URL

```
http://localhost:3000/api
```

## 📤 Upload & Generate DFD

### POST /dfd/upload

Upload SQL file dan generate DFD automatically untuk semua levels.

**Endpoint:** `POST /api/dfd/upload`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlFile` | File | Yes | SQL file (.sql format, max 10MB) |

**Request Example:**

```bash
curl -X POST \
  -F "sqlFile=@database.sql" \
  http://localhost:3000/api/dfd/upload
```

JavaScript:
```javascript
const formData = new FormData();
formData.append('sqlFile', fileInput.files[0]);

const response = await fetch('/api/dfd/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.data.outputs);
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "DFD generated successfully",
  "data": {
    "summary": {
      "totalDataStores": 5,
      "totalProcesses": 20,
      "totalExternalEntities": 3,
      "relationships": 8
    },
    "outputs": {
      "level0Image": "uploads/dfd_level0_1703600000000.png",
      "level1Image": "uploads/dfd_level1_1703600000000.png",
      "level2Image": "uploads/dfd_level2_1703600000000.png",
      "jsonData": "uploads/dfd_data_1703600000000.json"
    },
    "dfdData": {
      "level0": {
        "level": 0,
        "title": "Level 0: Context Diagram",
        "description": "Shows the system as a single process...",
        "elements": [
          {
            "id": "P0",
            "name": "System",
            "displayName": "Complete System",
            "type": "process",
            "level": 0
          },
          {
            "id": "DS_USERS",
            "name": "users",
            "displayName": "Users",
            "type": "dataStore",
            "description": "Data Store: users"
          },
          {
            "id": "EE_ADMIN",
            "name": "Admin",
            "displayName": "Administrator",
            "type": "externalEntity",
            "description": "System Administrator"
          }
        ],
        "flows": [
          {
            "id": "F_EE_ADMIN_P0",
            "from": "EE_ADMIN",
            "to": "P0",
            "label": "Request/Query",
            "dataElements": ["Request"]
          }
        ],
        "relationships": [
          {
            "id": "REL_orders_users",
            "from": "DS_ORDERS",
            "to": "DS_USERS",
            "fromTable": "orders",
            "toTable": "users",
            "localColumn": "user_id",
            "referenceColumn": "id",
            "label": "user_id → id",
            "type": "oneToMany"
          }
        ]
      },
      "level1": { ... },
      "level2": { ... }
    },
    "mermaidCode": {
      "level0": "graph TD\n  P0[\"SYSTEM...\"]\n  DS_USERS[(\"Users\")]\n  ...",
      "level1": "graph TD\n  P1[\"1.1 Add Users\"]\n  ...",
      "level2": "graph TD\n  P1.1[\"Create User\"]\n  ..."
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "File must be SQL format (.sql)",
  "type": "ValidationError"
}
```

**Error Codes:**

| Code | Description |
|------|-------------|
| 400 | Bad Request (invalid file format, size, etc) |
| 500 | Server Error (parsing failed, rendering failed) |

---

## 📜 Get DFD History

### GET /dfd/history

Retrieve last 10 generated DFDs.

**Endpoint:** `GET /api/dfd/history`

**Request Example:**

```bash
curl http://localhost:3000/api/dfd/history
```

JavaScript:
```javascript
const response = await fetch('/api/dfd/history');
const data = await response.json();
console.log(data.data.files);
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "files": [
      {
        "name": "dfd_level0_1703600000000.png",
        "url": "/uploads/dfd_level0_1703600000000.png"
      },
      {
        "name": "dfd_level1_1703599999000.png",
        "url": "/uploads/dfd_level1_1703599999000.png"
      },
      {
        "name": "dfd_data_1703599998000.json",
        "url": "/uploads/dfd_data_1703599998000.json"
      }
    ]
  }
}
```

---

## 🔍 Get DFD by ID

### GET /dfd/:id

Retrieve DFD data by timestamp ID.

**Endpoint:** `GET /api/dfd/:id`

**URL Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | string | Timestamp from filename (e.g., 1703600000000) |

**Request Example:**

```bash
curl http://localhost:3000/api/dfd/1703600000000
```

JavaScript:
```javascript
const id = '1703600000000';
const response = await fetch(`/api/dfd/${id}`);
const data = await response.json();
console.log(data.data); // DFD data
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "level": 0,
    "title": "Level 0: Context Diagram",
    "description": "Shows the system as a single process...",
    "elements": [...],
    "flows": [...],
    "relationships": [...],
    "generatedAt": "2024-12-26T12:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "DFD not found"
}
```

---

## 📥 Download DFD Files

### GET /dfd/:id/download

Get download links untuk semua DFD files (Level 0, 1, 2 + JSON).

**Endpoint:** `GET /api/dfd/:id/download`

**URL Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | string | Timestamp from filename |

**Request Example:**

```bash
curl http://localhost:3000/api/dfd/1703600000000/download
```

JavaScript:
```javascript
const id = '1703600000000';
const response = await fetch(`/api/dfd/${id}/download`);
const data = await response.json();

if (data.success) {
  // Download files manually atau create ZIP
  window.location.href = data.data.files.level0;
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "files": {
      "level0": "uploads/dfd_level0_1703600000000.png",
      "level1": "uploads/dfd_level1_1703600000000.png",
      "level2": "uploads/dfd_level2_1703600000000.png",
      "jsonData": "uploads/dfd_data_1703600000000.json"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "DFD files not found"
}
```

---

## 📊 Response Data Structures

### Element Object

```typescript
interface Element {
  id: string;              // Unique identifier (P1, DS_USERS, EE_ADMIN)
  type: 'process' | 'dataStore' | 'externalEntity';
  name: string;            // Internal name
  displayName: string;     // Display name
  description?: string;    // Optional description
  level?: number;          // DFD level (0, 1, 2)
  columns?: Column[];       // For dataStore only
  operation?: string;       // For process only (CREATE, READ, UPDATE, DELETE)
}
```

### DataFlow Object

```typescript
interface DataFlow {
  id: string;              // Flow ID (F_SOURCE_TARGET)
  from: string;            // Source element ID
  to: string;              // Target element ID
  label: string;           // Flow label
  dataElements: string[];  // Data items flowing (e.g., ["name", "email"])
}
```

### Relationship Object

```typescript
interface Relationship {
  id: string;              // Relationship ID
  from: string;            // Source dataStore ID
  to: string;              // Target dataStore ID
  fromTable: string;       // Source table name
  toTable: string;         // Target table name
  localColumn: string;     // Local column name
  referenceColumn: string; // Reference column name
  label: string;           // Relationship label
  type: string;            // 'oneToMany', 'oneToOne', etc
}
```

### DFD Level Object

```typescript
interface DFDLevel {
  level: number;
  title: string;
  description: string;
  elements: Element[];
  flows: DataFlow[];
  relationships?: Relationship[];
}
```

---

## 🔐 Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "type": "ErrorType"  // ValidationError, FileError, InternalError
}
```

### Common Errors

| Message | Code | Meaning |
|---------|------|---------|
| No file uploaded | 400 | File tidak dikirim |
| File must be SQL format (.sql) | 400 | Format file salah |
| File size must be less than 10 MB | 400 | File terlalu besar |
| Failed to parse SQL file | 500 | SQL parsing error |
| Failed to render diagram | 500 | Mermaid/Puppeteer error |
| DFD not found | 404 | ID tidak ada |

---

## 🔄 Request/Response Examples

### Complete Workflow Example

```javascript
// 1. Upload SQL file
const formData = new FormData();
formData.append('sqlFile', document.querySelector('input[type=file]').files[0]);

const uploadResponse = await fetch('/api/dfd/upload', {
  method: 'POST',
  body: formData
});

const uploadData = await uploadResponse.json();

if (uploadData.success) {
  const { outputs, dfdData, mermaidCode } = uploadData.data;
  
  console.log('Generated Files:');
  console.log('- Level 0:', outputs.level0Image);
  console.log('- Level 1:', outputs.level1Image);
  console.log('- Level 2:', outputs.level2Image);
  console.log('- Data:', outputs.jsonData);
  
  // 2. Get DFD by ID
  const id = outputs.level0Image.match(/\d+/)[0];
  const getResponse = await fetch(`/api/dfd/${id}`);
  const getData = await getResponse.json();
  console.log('DFD Data:', getData.data);
  
  // 3. Download files
  const downloadResponse = await fetch(`/api/dfd/${id}/download`);
  const downloadData = await downloadResponse.json();
  console.log('Download URLs:', downloadData.data.files);
}
```

---

## 📋 Request Validation Rules

### File Upload Validation

- **Format**: Must be `.sql` file
- **Size**: Max 10 MB
- **Content**: Valid SQL syntax required
- **Tables**: At least 1 table required
- **Naming**: Table names should be alphanumeric + underscore

### SQL Content Requirements

✅ Must include:
- At least 1 `CREATE TABLE` statement
- At least 1 column per table
- Primary key definitions

✅ Optional:
- Foreign key relationships
- Default values
- Constraints

❌ Not supported:
- Views, triggers, stored procedures
- Complex expressions
- Comments (ignored)

---

## 🚀 Rate Limiting

Currently no rate limiting implemented. 

**Recommended for production:**
- Implement rate limiting (e.g., 10 uploads per minute per IP)
- Use Redis or in-memory cache
- Add API key authentication

---

## 📈 Performance Considerations

| Operation | Typical Time |
|-----------|-------------|
| SQL Parsing | 100-500ms |
| DFD Generation | 200-800ms |
| Mermaid Rendering | 1-3s |
| Image Export | 2-5s |
| **Total** | **3-9 seconds** |

Factors affecting performance:
- Database size (tables, relationships)
- Server resources (CPU, RAM)
- Puppeteer overhead

---

## 🔗 Additional Resources

- [API Base URL](http://localhost:3000/api)
- [Web UI](http://localhost:3000)
- [Documentation](./README.md)
- [Quick Start](./QUICK_START.md)
- [Setup Guide](./SETUP.md)

---

**API Documentation v1.0**
Last updated: December 26, 2024
