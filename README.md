# 🎯 DFD Automation - SQL to Diagram Generator

Aplikasi otomatis untuk menghasilkan **Data Flow Diagram (DFD)** dari file SQL database. Mendukung generasi DFD Level 0, 1, dan 2 dengan notasi ilmiah menggunakan Mermaid.js.

## ✨ Fitur Utama

- ✅ **Upload SQL Database** - Upload file SQL dalam format `.sql`
- ✅ **Auto Parse Database** - Ekstrak tables, columns, relationships secara otomatis
- ✅ **Multi-Level DFD** - Generate Level 0 (Context), Level 1 (Decomposition), Level 2 (Detailed)
- ✅ **Scientific Notation** - Mengikuti standar DFD ilmiah (Yourdon & Constantine)
- ✅ **Mermaid Rendering** - Render ke format diagram visual
- ✅ **Export as Image** - Export diagrams sebagai PNG
- ✅ **Export as JSON** - Export data sebagai JSON untuk referensi
- ✅ **Beautiful UI** - Modern, responsive web interface

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ 
- NPM/YARN

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Create uploads directory
mkdir -p uploads

# 4. Start server
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Upload & Generate DFD

```http
POST /api/dfd/upload
Content-Type: multipart/form-data

File: database.sql
```

**Response:**
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
      "level0Image": "uploads/dfd_level0_1703123456.png",
      "level1Image": "uploads/dfd_level1_1703123456.png",
      "level2Image": "uploads/dfd_level2_1703123456.png",
      "jsonData": "uploads/dfd_data_1703123456.json"
    },
    "mermaidCode": {
      "level0": "graph TD...",
      "level1": "graph TD...",
      "level2": "graph TD..."
    }
  }
}
```

### Get DFD History

```http
GET /api/dfd/history
```

### Get DFD by ID

```http
GET /api/dfd/:id
```

### Download DFD Files

```http
GET /api/dfd/:id/download
```

## 📊 DFD Levels Explained

### Level 0: Context Diagram
- **Tujuan**: Menunjukkan sistem sebagai satu proses tunggal
- **Elemen**: 1 process (P0), semua external entities, semua data stores
- **Manfaat**: High-level overview dari sistem

### Level 1: Process Decomposition
- **Tujuan**: Dekomposisi sistem menjadi main processes
- **Elemen**: Main processes untuk setiap table, same external entities, same data stores
- **Manfaat**: Memahami proses utama sistem

### Level 2: Detailed Operations
- **Tujuan**: Detail operasi CRUD untuk setiap data store
- **Elemen**: CRUD processes (Create, Read, Update, Delete)
- **Manfaat**: Implementasi detail, validasi flows

## 🔧 Project Structure

```
├── app.js                    # Express server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
│
├── public/
│   └── index.html           # Web UI
│
├── src/
│   ├── controllers/
│   │   └── dfdController.js # Request handlers
│   ├── models/
│   │   └── dfdModel.js      # Data structures & conventions
│   ├── routes/
│   │   └── dfdRoutes.js     # API routes
│   ├── services/
│   │   ├── sqlParser.js     # SQL parsing logic
│   │   ├── dfdGenerator.js  # DFD generation logic
│   │   └── mermaidRenderer.js # Mermaid rendering
│   └── utils/
│       └── validation.js    # Input validation
│
└── uploads/                 # Generated diagrams & files
```

## 📝 SQL File Format

Supported SQL statements:
- `CREATE TABLE`
- `ALTER TABLE` (untuk constraints)
- `FOREIGN KEY` definitions
- `PRIMARY KEY` definitions
- Column data types (VARCHAR, INT, DECIMAL, DATE, BOOLEAN, etc)

### Contoh SQL File:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total DECIMAL(10, 2),
    status VARCHAR(50),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## 🎨 DFD Naming Conventions

### Process IDs
- Level 0: `P0` (Context)
- Level 1: `P1`, `P2`, `P3`, ... (Main processes)
- Level 2: `P1.1`, `P1.2`, ... (Sub-processes)

### Data Store IDs
- `DS_TABLENAME` (e.g., `DS_USERS`, `DS_ORDERS`)

### External Entity IDs
- `EE_ADMIN` - Administrator
- `EE_USER` - End User
- `EE_SYSTEM` - External System

### Data Flow IDs
- `F_SOURCE_TARGET` (e.g., `F_EE_USER_P1`)

## 📊 Generated Output Files

Untuk setiap upload, sistem menghasilkan:

1. **dfd_level0_[timestamp].png** - Context diagram image
2. **dfd_level1_[timestamp].png** - Process decomposition image
3. **dfd_level2_[timestamp].png** - Detailed operations image
4. **dfd_data_[timestamp].json** - Complete DFD data structure

## 🔒 Input Validation

- File harus format `.sql` (max 10MB)
- Database harus memiliki minimal 1 table
- Supported column types: VARCHAR, INT, DECIMAL, DATE, TIMESTAMP, BOOLEAN, TEXT, etc
- Foreign key relationships diekstrak otomatis

## 🛠️ Technologies Used

- **Backend**: Node.js + Express.js
- **File Upload**: Multer
- **Diagram Rendering**: Mermaid.js + Puppeteer
- **Validation**: Joi
- **Environment**: dotenv

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "mermaid": "^10.6.1",
  "puppeteer": "^21.4.0",
  "joi": "^17.11.0",
  "sql-parser": "^1.4.2",
  "dotenv": "^16.3.1"
}
```

## 🚨 Error Handling

Sistem menyediakan error messages yang jelas:

```json
{
  "success": false,
  "message": "File must be SQL format (.sql)",
  "type": "ValidationError"
}
```

## 🔄 Data Flow Processing

```
SQL Upload
    ↓
Parse Database Structure
    ├── Extract Tables
    ├── Extract Columns
    ├── Extract Relationships
    └── Identify External Entities
    ↓
Generate DFD Levels
    ├── Level 0: Context Diagram
    ├── Level 1: Process Decomposition
    └── Level 2: Detailed Operations
    ↓
Render to Mermaid
    ├── Generate Mermaid Syntax
    ├── Apply DFD Styling
    └── Render to PNG
    ↓
Export Results
    ├── Save Images
    ├── Save JSON Data
    └── Return URLs
```

## 📚 DFD Rules Implemented

### Gane & Sarson Notation
- ⭕ Circle = Process
- ⬜ Square/Brackets = External Entity
- ⚪ Two Parallel Lines = Data Store
- Arrow = Data Flow

### Yourdon & Constantine Notation
- Rounded Rectangle = Process
- Square = External Entity
- Two Parallel Horizontal Lines = Data Store
- Arrow = Data Flow

## 🎯 Use Cases

1. **Database Documentation** - Dokumentasi alur data sistem
2. **System Analysis** - Analisis kebutuhan sistem baru
3. **Process Improvement** - Optimasi alur proses
4. **Training Material** - Material training untuk tim
5. **Technical Design** - Design dokumen teknis

## 📖 Learning Resources

- [DFD Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/data-flow-diagram/)
- [Mermaid.js Documentation](https://mermaid.js.org/)
- [Yourdon & Constantine DFD](https://en.wikipedia.org/wiki/Data_flow_diagram)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port di .env
PORT=3001
```

### Puppeteer Issues
```bash
# Install with sandbox disabled
npm install puppeteer --no-sandbox
```

### File Upload Fails
- Pastikan folder `uploads/` ada dan writable
- Check file size (max 10MB)
- Gunakan format SQL yang valid

## 📝 License

MIT

## 👨‍💻 Author

DFD Automation Generator

## 🤝 Support

Untuk pertanyaan atau issues, silakan buat issue di repository ini.

---

**Happy DFD Generating! 🚀**
