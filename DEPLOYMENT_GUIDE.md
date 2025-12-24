# 🚀 Deployment Guide - DFD Automation

## ⚠️ Important: Vercel vs Traditional Hosting

**Vercel** is a **serverless platform** and **does NOT support**:
- Long-running Express servers
- Persistent file storage
- Puppeteer/Chrome

**Solution**: Use Railway.app, Render.com, or other Node.js hosting

---

## 📍 Option 1: Deploy to Railway.app (RECOMMENDED ⭐)

Railway.app adalah platform hosting paling mudah untuk Node.js app.

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Find and select your `New folder` repository
4. Click "Deploy"

### Step 3: Configure Environment
1. Go to Variables tab
2. Add these environment variables:
```
NODE_ENV=production
PORT=3000
PUPPETEER_SKIP_DOWNLOAD=true
```

### Step 4: Done!
Railway will automatically:
- Install dependencies (`npm install`)
- Start server (`npm start`)
- Assign a public URL

Your DFD app will be live! 🎉

---

## 📍 Option 2: Deploy to Render.com

### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Fill in settings:
   - **Name**: `dfd-automation`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables
In "Environment" tab, add:
```
NODE_ENV=production
PUPPETEER_SKIP_DOWNLOAD=true
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

---

## 📍 Option 3: Local Docker Deployment

If you want to run locally in Docker:

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Build & Run
```bash
docker build -t dfd-automation .
docker run -p 3000:3000 dfd-automation
```

---

## ❌ Why NOT Vercel?

Vercel requires:
- ✅ Serverless functions (short-lived)
- ✅ No file persistence
- ❌ Not suitable for file uploads/downloads
- ❌ No Chrome/Puppeteer support

For our DFD app, we need:
- 📁 File system for uploads
- 📊 Server persistence
- 🎨 Optional: Puppeteer for images

**Recommendation**: Use **Railway.app** (free tier available)

---

## 🔧 Testing Deployment

After deployment, test the health endpoint:
```bash
curl https://your-app-url/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-12-24T..."}
```

---

## 📝 Files Needed for Deployment

✅ All files are ready:
- `app.js` - Main Express app
- `package.json` - Dependencies
- `.env.production` - Production config
- `src/` - All source code
- `public/` - Frontend HTML/CSS/JS

---

## 🚨 Troubleshooting

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Port already in use"
The server will auto-select available port (PORT env variable)

### Error: "File upload failed"
Check that uploads directory exists and is writable

### Error: "500 Internal Server Error"
1. Check server logs on Railway/Render
2. Verify file was uploaded
3. Check SQL file format

---

## 📌 Environment Variables (Production)

```env
NODE_ENV=production
PORT=3000
PUPPETEER_SKIP_DOWNLOAD=true
```

**Never commit `.env` file!** It's in `.gitignore`

---

## 🎯 Quick Deploy Summary

| Platform | Effort | Cost | Speed |
|----------|--------|------|-------|
| **Railway** | ⭐ Easy | Free/Paid | ⚡ Fast |
| **Render** | ⭐ Easy | Free/Paid | ⚡ Fast |
| **Vercel** | ❌ Not suitable | Free | N/A |
| **Docker** | ⭐⭐ Medium | Depends | ⚡ Fast |

---

**Recommended**: Deploy to **Railway.app** for best experience! 🚀

For questions, check the logs and error messages carefully.
