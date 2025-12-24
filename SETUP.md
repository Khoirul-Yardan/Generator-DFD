# 📋 Setup Guide - DFD Automation

Panduan lengkap setup project **DFD Automation** di Windows dengan XAMPP.

## 🖥️ Environment

- **OS**: Windows
- **Server**: XAMPP 
- **Path**: `c:\xampp\htdocs\New folder`
- **Node.js**: v16+
- **NPM**: v8+

## 1️⃣ Prerequisites

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) - Download dan install versi LTS
- [Git](https://git-scm.com/) (optional, untuk version control)
- XAMPP (sudah terinstall)

Cek instalasi:
```bash
node --version
npm --version
```

## 2️⃣ Project Setup

### Step 1: Navigate ke Project Directory

```bash
cd c:\xampp\htdocs\New folder
```

### Step 2: Initialize NPM Project

Project sudah memiliki `package.json`. Cukup install dependencies:

```bash
npm install
```

Ini akan menginstall semua packages yang diperlukan:
- express
- multer
- mermaid
- puppeteer
- joi
- dotenv

**Note**: Puppeteer agak besar (~150MB), tunggu proses selesai.

### Step 3: Setup Environment Variables

File `.env` sudah tersedia. Jika perlu modify:

```bash
# Copy template
copy .env.example .env

# Edit .env jika diperlukan
# Buka dengan text editor favorit
```

Content `.env`:
```env
NODE_ENV=development
PORT=3000
```

### Step 4: Create Uploads Directory

Pastikan folder `uploads` ada:

```bash
# Windows Command Prompt
mkdir uploads

# Atau buat manual melalui File Explorer
# Klik kanan → New Folder → "uploads"
```

## 3️⃣ Running the Application

### Start Development Server

```bash
npm start
```

Jika sudah terinstall `nodemon`, gunakan:
```bash
npm run dev
```

**Output yang diharapkan:**
```
✓ Server running on http://localhost:3000
✓ Upload endpoint: POST /api/dfd/upload
```

### Access Web UI

Buka browser dan akses:
```
http://localhost:3000
```

Seharusnya melihat interface DFD Automation.

## 4️⃣ Testing Aplikasi

### Option A: Menggunakan Web UI

1. Buka `http://localhost:3000` di browser
2. Klik upload area atau drag-drop file SQL
3. Click "🚀 Generate DFD"
4. Tunggu proses selesai
5. Download atau view diagrams

### Option B: Using cURL

```bash
# Prepare SQL file
# Misalnya: test.sql

# Upload
curl -X POST -F "sqlFile=@test.sql" http://localhost:3000/api/dfd/upload
```

### Option C: Using Postman

1. Open Postman
2. Create POST request ke `http://localhost:3000/api/dfd/upload`
3. Tab "Body" → form-data
4. Key: `sqlFile`, Value: select SQL file
5. Click "Send"

## 5️⃣ Sample SQL File untuk Testing

Create file `sample.sql` dengan content:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200),
    description TEXT,
    price DECIMAL(10, 2),
    stock INT DEFAULT 0
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2),
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT DEFAULT 5,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Upload file ini untuk test.

## 6️⃣ Troubleshooting

### Port 3000 Already in Use

```bash
# Windows - Kill process pada port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Atau ubah port di .env
PORT=3001
```

### Puppeteer/Chrome Issues

```bash
# Reinstall dengan --no-sandbox
npm uninstall puppeteer
npm install puppeteer --no-sandbox

# Atau di code, tambah args:
puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

### Module Not Found

```bash
# Reinstall semua dependencies
rm -r node_modules package-lock.json
npm install
```

### Uploads Folder Permission Error

```bash
# Ensure folder writable
# Windows: Right-click folder → Properties → Security
# Atau jalankan Command Prompt as Administrator
```

## 7️⃣ Project Structure Verification

Verify struktur folder:

```
c:\xampp\htdocs\New folder\
├── app.js                    ✓
├── package.json              ✓
├── .env                      ✓
├── README.md                 ✓
│
├── public/
│   └── index.html           ✓
│
├── src/
│   ├── controllers/
│   │   └── dfdController.js ✓
│   ├── models/
│   │   └── dfdModel.js      ✓
│   ├── routes/
│   │   └── dfdRoutes.js     ✓
│   ├── services/
│   │   ├── sqlParser.js     ✓
│   │   ├── dfdGenerator.js  ✓
│   │   └── mermaidRenderer.js ✓
│   └── utils/
│       └── validation.js    ✓
│
└── uploads/                 ✓
```

## 8️⃣ Development Workflow

### File Monitoring (Optional)

Install nodemon untuk auto-restart:

```bash
npm install --save-dev nodemon
```

Di `package.json`, ubah script:
```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

Jalankan:
```bash
npm run dev
```

### Code Style (Optional)

Install ESLint:
```bash
npm install --save-dev eslint
npx eslint --init
```

## 9️⃣ Production Deployment

### Before Production:

1. Set environment:
   ```env
   NODE_ENV=production
   PORT=3000
   ```

2. Use process manager (PM2):
   ```bash
   npm install -g pm2
   pm2 start app.js --name "dfd-automation"
   pm2 save
   ```

3. Enable HTTPS (recommended)

4. Setup reverse proxy (Nginx/Apache)

## 🔟 Performance Optimization

### For Large SQL Files:

1. Increase Node heap:
   ```bash
   node --max-old-space-size=4096 app.js
   ```

2. Optimize Puppeteer:
   ```javascript
   // In mermaidRenderer.js
   puppeteer.launch({
     headless: 'new',
     args: ['--disable-dev-shm-usage'] // Gunakan disk instead of memory
   });
   ```

## 📞 Getting Help

1. **Check Logs**: Lihat console output untuk error messages
2. **Node Version**: Pastikan Node.js v16+
3. **Package Manager**: Try clearing npm cache: `npm cache clean --force`
4. **Reinstall**: `rm -r node_modules` lalu `npm install`

## ✅ Verification Checklist

- [ ] Node.js & NPM terinstall
- [ ] Project di-navigate correctly
- [ ] Dependencies terinstall (`npm install` berhasil)
- [ ] `.env` file tersedia
- [ ] `uploads/` folder terbuat
- [ ] Server start tanpa error (`npm start`)
- [ ] Web UI accessible di `http://localhost:3000`
- [ ] Upload & Generate DFD test berhasil
- [ ] Output files terbuat di `uploads/` folder

---

**Setup selesai! 🎉**

Sekarang Anda siap untuk menggunakan DFD Automation Generator!
