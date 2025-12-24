# ❓ FAQ & Troubleshooting - DFD Automation

Solusi untuk masalah umum yang mungkin dihadapi.

## 🚀 Getting Started Issues

### Q: "npm install" gagal

**A:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

Jika masih gagal:
- Pastikan Node.js v16+ terinstall: `node --version`
- Check internet connection
- Try install with verbose: `npm install --verbose`

---

### Q: "Port 3000 already in use"

**A:**

Windows Command Prompt:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID dengan number)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3001
```

---

### Q: Server tidak start, "Cannot find module"

**A:**
```bash
# Pastikan di directory yang benar
cd c:\xampp\htdocs\New folder

# Reinstall dependencies
npm install

# Check app.js exists
dir app.js
```

---

## 📤 File Upload Issues

### Q: "File upload failed", "No file uploaded"

**A:**
- ✅ Pastikan select file sebelum click upload
- ✅ File harus format `.sql`
- ✅ File size < 10 MB
- ✅ `uploads/` folder harus ada dan writable

Create uploads folder:
```bash
mkdir uploads
```

---

### Q: "File must be SQL format (.sql)"

**A:**
- File extension harus `.sql`
- Bukan `.txt`, `.sql.txt`, atau format lain
- Ganti extension jika perlu:
  ```bash
  ren database.txt database.sql
  ```

---

### Q: Upload file besar (>10MB) gagal

**A:**

Ubah limit di `src/routes/dfdRoutes.js`:

```javascript
const upload = multer({
  storage,
  fileFilter: ...,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});
```

atau split SQL file menjadi lebih kecil.

---

## 🔧 SQL Parsing Issues

### Q: "Failed to parse SQL file"

**A:**
- ✅ Validate SQL syntax (use MySQL Workbench atau online validator)
- ✅ Pastikan `CREATE TABLE` statements valid
- ✅ Check table names (alphanumeric + underscore saja)

Contoh SQL yang valid:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255)
);
```

Contoh yang SALAH:
```sql
-- Missing semicolon
CREATE TABLE users (id INT)

-- Invalid table name
CREATE TABLE "user table" (id INT)
```

---

### Q: "Database must contain at least 1 table"

**A:**
- SQL file harus punya minimal 1 `CREATE TABLE` statement
- Check format CREATE TABLE:

```sql
-- Valid
CREATE TABLE tableName (
    column DATATYPE
);

-- Juga valid
CREATE TABLE IF NOT EXISTS tableName (
    column DATATYPE
);
```

---

### Q: Foreign keys tidak terdeteksi

**A:**

Pastikan format FOREIGN KEY correct:

```sql
-- VALID - Standard format
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- VALID - Inline
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT REFERENCES users(id)
);

-- TIDAK - Missing column definition
CREATE TABLE orders (
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### Q: Columns tidak terdeteksi dengan baik

**A:**

Pastikan format column definition correct:

```sql
-- VALID
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TIDAK - Missing datatype
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR
);

-- TIDAK - Invalid syntax
CREATE TABLE users (
    id INT PRIMARY,
    email VARCHAR(255) NOT NULL,
);  -- Trailing comma
```

---

## 🎨 DFD Generation Issues

### Q: "Failed to render diagram"

**A:**

1. Check Puppeteer installation:
   ```bash
   npm list puppeteer
   ```

2. Increase Node heap memory:
   ```bash
   node --max-old-space-size=4096 app.js
   ```

3. Disable Puppeteer sandbox:
   ```bash
   # Edit src/services/mermaidRenderer.js
   # Di puppeteer.launch(), tambah:
   args: ['--no-sandbox', '--disable-setuid-sandbox']
   ```

4. Reinstall Puppeteer:
   ```bash
   npm uninstall puppeteer
   npm install puppeteer
   ```

---

### Q: Diagram output kosong atau tidak lengkap

**A:**
- SQL file terlalu besar, reduce complexity
- Check console untuk error messages
- Validate database structure simple terlebih dahulu

---

### Q: DFD image export rusak/corrupt

**A:**
- Check disk space tersedia
- `uploads/` folder harus writable
- Try restart server
- Check Windows Firewall settings

---

## 🌐 Web UI Issues

### Q: Web UI tidak load, blank page

**A:**

1. Check server running:
   ```bash
   npm start
   # Harus lihat: "✓ Server running on http://localhost:3000"
   ```

2. Clear browser cache:
   - Press `Ctrl+Shift+Delete` di Chrome/Firefox
   - Clear all data
   - Refresh page

3. Check browser console untuk errors:
   - Press `F12` → Console tab
   - Look for red error messages

4. Try different browser

---

### Q: "Cannot POST /api/dfd/upload" error

**A:**
- Server tidak running
- Routes tidak registered dengan benar
- Check `app.js` import routes:
  ```javascript
  const dfdRoutes = require('./src/routes/dfdRoutes');
  app.use('/api', dfdRoutes);
  ```

---

### Q: Upload button disabled atau tidak berfungsi

**A:**
- Pastikan file sudah di-select
- Browser console tidak ada error
- Try refresh page
- Try different browser

---

## 💾 File Storage Issues

### Q: "uploads/" folder error, permission denied

**A:**

Windows - Run Command Prompt as Administrator:
```bash
# Create folder
mkdir c:\xampp\htdocs\New folder\uploads

# Check permissions
icacls "c:\xampp\htdocs\New folder\uploads" /grant "%USERNAME%:F"
```

atau via File Explorer:
1. Right-click `uploads` folder
2. Properties → Security → Edit
3. Select user → Full Control ✓
4. Apply → OK

---

### Q: "Disk full", cannot save files

**A:**
- Check available disk space: `C:` drive
- Delete old uploads: `del uploads\*`
- Compress or backup old files
- Move to different drive

---

## 🔍 Debugging Tips

### Enable Debug Mode

Di `app.js`, tambah:
```javascript
process.env.DEBUG = 'dfd:*';
```

### Check Server Logs

Lihat console output saat server running:
```
✓ File uploaded: database.sql
✓ SQL parsed: 5 tables, 20 processes
✓ DFD generated for all levels
✓ Diagrams rendered successfully
```

### Test API dengan cURL

```bash
# Test file upload
curl -X POST -F "sqlFile=@test.sql" http://localhost:3000/api/dfd/upload

# Test history
curl http://localhost:3000/api/dfd/history
```

### Check Generated Files

```bash
# List uploads
dir uploads

# View JSON data
type uploads\dfd_data_1703600000000.json
```

---

## 🆘 Cannot Resolve Issues?

### Step-by-Step Troubleshooting

1. **Restart Server**
   ```bash
   # Stop: Ctrl+C
   # Start: npm start
   ```

2. **Clear Cache & Reinstall**
   ```bash
   npm cache clean --force
   rmdir /s node_modules
   npm install
   ```

3. **Check Prerequisites**
   ```bash
   node --version    # Should be v16+
   npm --version     # Should be v8+
   ```

4. **Review Logs**
   - Check browser console (F12)
   - Check server console output
   - Check `uploads/` folder exists

5. **Test with Sample Data**
   - Create simple SQL file
   - Try upload simple database
   - Check if basic functionality works

6. **Check File Permissions**
   - `app.js` readable
   - `src/` folder accessible
   - `uploads/` folder writable

### Report Issue

Kalau masih tidak bisa, buat file `error-log.txt`:
```
- OS: Windows
- Node version: [output from: node --version]
- NPM version: [output from: npm --version]
- Error message: [exact error message]
- Steps to reproduce: [what you did]
```

---

## 📋 Checklist Sebelum Report Issue

- [ ] Node.js v16+ terinstall
- [ ] `npm install` berhasil tanpa error
- [ ] `.env` file ada
- [ ] `uploads/` folder ada & writable
- [ ] Server start tanpa error (`npm start`)
- [ ] Can access `http://localhost:3000`
- [ ] Web UI load dan responsive
- [ ] SQL file valid dan < 10MB
- [ ] SQL file format `.sql`
- [ ] Browser console tidak ada error (F12)
- [ ] Tried restart server
- [ ] Tried clear browser cache

---

## 🎯 Common Solutions Summary

| Issue | Solution |
|-------|----------|
| Port in use | Change PORT di `.env` atau kill process |
| npm install fails | `npm cache clean --force` + reinstall |
| Module not found | Reinstall: `npm install` |
| Upload fails | Check file format, size, permissions |
| Diagram rendering fails | Increase heap, check Puppeteer |
| Web UI blank | Refresh (Ctrl+F5), clear cache |
| SQL parsing error | Validate SQL syntax |
| Disk full | Delete old uploads |
| Permission denied | Run as Administrator |

---

## 📞 Getting Help

1. **Check Documentation**
   - `README.md` - Overview
   - `SETUP.md` - Setup guide
   - `QUICK_START.md` - Quick reference
   - `API_DOCS.md` - API reference

2. **Search Keywords**
   - Error message
   - File format
   - Permission issues
   - Network errors

3. **Review Logs**
   - Server console output
   - Browser console (F12)
   - File system permissions

4. **Try Solutions**
   - Restart server
   - Reinstall dependencies
   - Clear cache
   - Test with sample data

---

**Last Updated:** December 26, 2024

Untuk masalah lain, silakan review file-file dokumentasi lengkap yang tersedia!
