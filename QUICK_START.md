# 🎯 DFD Automation - Quick Reference

Panduan cepat menggunakan DFD Automation Generator.

## 🚀 Start Application

```bash
cd c:\xampp\htdocs\New folder
npm install          # First time only
npm start            # Start server
```

Akses: `http://localhost:3000`

## 📤 Upload SQL & Generate DFD

### Via Web UI (Recommended)
1. Buka `http://localhost:3000`
2. Click upload area atau drag-drop `.sql` file
3. Click "🚀 Generate DFD"
4. Tunggu processing
5. Download diagrams

### Via API (cURL)
```bash
curl -X POST \
  -F "sqlFile=@database.sql" \
  http://localhost:3000/api/dfd/upload
```

### Via API (JavaScript)
```javascript
const formData = new FormData();
formData.append('sqlFile', file);

fetch('/api/dfd/upload', {
  method: 'POST',
  body: formData
}).then(r => r.json()).then(data => {
  console.log(data.data.outputs);
});
```

## 📊 DFD Output Files

Per upload, generate 4 files:

| File | Format | Use |
|------|--------|-----|
| `dfd_level0_[timestamp].png` | Image | Context diagram |
| `dfd_level1_[timestamp].png` | Image | Process decomposition |
| `dfd_level2_[timestamp].png` | Image | Detailed operations |
| `dfd_data_[timestamp].json` | JSON | Complete data structure |

Semua tersimpan di `uploads/` folder.

## 📋 SQL File Requirements

✅ Supported:
- `CREATE TABLE` statements
- Multiple tables
- Column definitions
- Data types (VARCHAR, INT, DECIMAL, DATE, BOOLEAN, TEXT, etc)
- PRIMARY KEY
- FOREIGN KEY (relationships)
- AUTO_INCREMENT
- DEFAULT values
- UNIQUE constraints

❌ Not Supported (ignored):
- Views, Indexes, Triggers
- Stored Procedures
- Complex constraints
- Comments

### Minimal Valid SQL:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255)
);
```

## 🔍 Understanding DFD Levels

### Level 0: Context Diagram
```
         [Admin]
            ↓ ↑
         [System]
            ↓ ↑
         [User]
```
- 1 main process
- All external entities
- All data stores
- High-level overview

### Level 1: Process Decomposition
```
[Admin] → [P1: Create] → [Database]
[User]  → [P2: Read]   → [Database]
         → [P3: Update]→
         → [P4: Delete]→
```
- Main processes (CRUD per table)
- Same entities & stores
- Process breakdown

### Level 2: Detailed Operations
```
[Admin] → [P1.1: Insert Record] → [Database]
        → [P1.2: Get Record]    → [Database]
        → [P1.3: Update Record] → [Database]
        → [P1.4: Delete Record] → [Database]
```
- Detailed sub-processes
- Specific CRUD operations
- Implementation details

## 🎨 DFD Notation

### Elements
| Symbol | Meaning |
|--------|---------|
| ⭕ Circle | Process |
| ⚪ Double Line | Data Store |
| ⬜ Square/Bracket | External Entity |
| → Arrow | Data Flow |

### Naming Convention
```
P0, P1, P2          - Processes (Level 1)
P1.1, P1.2, P1.3    - Sub-processes (Level 2)
DS_USERS            - Data stores
EE_ADMIN            - External entities
F_SOURCE_TARGET     - Data flows
```

## 🔗 API Reference

### POST /api/dfd/upload
Upload SQL file dan generate DFD

**Request:**
```
Content-Type: multipart/form-data
sqlFile: File (.sql, max 10MB)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalDataStores": 5,
      "totalProcesses": 20,
      "totalExternalEntities": 3,
      "relationships": 8
    },
    "outputs": {
      "level0Image": "uploads/dfd_level0_1703123456.png",
      "level1Image": "uploads/dfd_level1_1703123456.png",
      "level2Image": "uploads/dfd_level2_1703123456.png",
      "jsonData": "uploads/dfd_data_1703123456.json"
    },
    "mermaidCode": {
      "level0": "...",
      "level1": "...",
      "level2": "..."
    }
  }
}
```

### GET /api/dfd/history
Dapatkan 10 DFD terakhir

### GET /api/dfd/:id
Dapatkan DFD data by ID

### GET /api/dfd/:id/download
Download semua files untuk DFD tertentu

## 🛠️ Configuration

### .env Variables
```env
NODE_ENV=development    # development atau production
PORT=3000              # Server port
```

### Limits
- Max file size: **10 MB**
- Max tables: No limit (tested dengan 100+ tables)
- Max processes: Auto-generated (4 per table)
- Rendering timeout: **5 seconds**

## 🔧 Troubleshooting

### Problem: "Port 3000 already in use"
```bash
# Change port di .env
PORT=3001

# Atau kill process
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### Problem: "File upload failed"
- ✓ Check file format (.sql)
- ✓ Check file size (< 10MB)
- ✓ Check SQL validity
- ✓ Check `uploads/` folder exists & writable

### Problem: "Diagram rendering failed"
- ✓ Check if Puppeteer installed correctly
- ✓ Increase Node heap: `node --max-old-space-size=4096 app.js`
- ✓ Check server logs untuk error details

### Problem: "SQL parsing error"
- ✓ Ensure valid SQL syntax
- ✓ Check table names (use alphanumeric + underscore)
- ✓ Ensure PRIMARY KEY defined
- ✓ Check FOREIGN KEY syntax

## 📚 Project Files

| File | Purpose |
|------|---------|
| `app.js` | Express server entry point |
| `public/index.html` | Web UI interface |
| `src/services/sqlParser.js` | SQL parsing logic |
| `src/services/dfdGenerator.js` | DFD generation logic |
| `src/services/mermaidRenderer.js` | Diagram rendering |
| `src/controllers/dfdController.js` | API handlers |
| `src/routes/dfdRoutes.js` | API routes |
| `src/utils/validation.js` | Input validation |
| `src/models/dfdModel.js` | Data structures |

## 📊 Sample Database

Test dengan database E-Commerce:

```sql
-- Users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0
);

-- Orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total DECIMAL(10, 2),
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Reviews
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT DEFAULT 5,
    comment TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🚀 Performance Tips

1. **Large SQL Files**: Increase Node heap
   ```bash
   node --max-old-space-size=4096 app.js
   ```

2. **Multiple Concurrent Uploads**: Use load balancer

3. **Image Export**: Pre-generate & cache untuk files yang sering diakses

## 📖 Learning Resources

- [DFD Tutorial](https://www.geeksforgeeks.org/data-flow-diagram/)
- [Mermaid Documentation](https://mermaid.js.org/)
- [Yourdon & Constantine Notation](https://en.wikipedia.org/wiki/Data_flow_diagram)

## 💡 Tips & Tricks

### Tip 1: Batch Process
Upload beberapa SQL files sekaligus untuk compare DFDs

### Tip 2: Export for Presentation
Download PNG files untuk PowerPoint/slides

### Tip 3: Documentation
Save JSON output untuk technical documentation

### Tip 4: Version Control
Simpan DFD outputs di Git untuk track changes

## ✅ Checklist Before Upload

- [ ] File is `.sql` format
- [ ] File < 10 MB
- [ ] Valid SQL syntax
- [ ] Tables have PRIMARY KEY
- [ ] Server running (`npm start`)
- [ ] Browser di `http://localhost:3000`

---

**Happy Diagramming! 🎉**

Untuk help lebih lanjut, baca `README.md` atau `SETUP.md`
