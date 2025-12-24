# 🚀 Railway Setup Guide (Fix Deployment Issues)

## ✅ Masalah: libgdk-pixbuf Error

Error yang Anda alami:
```
Processing triggers for libgdk-pixbuf-2.0-0:amd64 ...
```

**Penyebab**: Puppeteer mencoba install system dependencies yang tidak perlu.

**Solusi**: Gunakan Alpine Linux (lightweight) + proper Dockerfile

---

## 📋 File yang Sudah Saya Siapkan

- ✅ `Dockerfile` - Optimized untuk Railway
- ✅ `railway.json` - Railway configuration
- ✅ `.dockerignore` - Exclude unnecessary files
- ✅ `.env.production` - Production config

---

## 🔧 Deploy ke Railway (Step-by-Step)

### Step 1: Buka Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Login dengan GitHub account Anda
3. Click "New Project"

### Step 2: Setup Project
Pilih **"Deploy from GitHub repo"**:
1. Authorize Railway dengan GitHub
2. Pilih repository Anda
3. Click "Deploy"

### Step 3: Configure Environment Variables
Di Railway Dashboard:
1. Go ke **Variables** tab
2. Add ini variables:

```
NODE_ENV=production
PORT=3000
PUPPETEER_SKIP_DOWNLOAD=true
```

### Step 4: Trigger Deploy
1. Railway akan otomatis build dari Dockerfile
2. Tunggu sampai build selesai (5-10 menit)
3. Check logs untuk memastikan tidak ada error

### Step 5: Cek Domain
Railway assign domain automatically:
```
https://dfd-automation-production.up.railway.app
```

---

## 🐛 Troubleshooting

### Error: "libgdk-pixbuf" masih muncul?
- ✅ Sudah fixed dengan Alpine Dockerfile
- Jika masih error, coba force redeploy:
  1. Go ke Deployments
  2. Click "Redeploy" pada latest deployment

### Error: "npm install failed"
```bash
# Check package.json valid
npm install --legacy-peer-deps
```

### Error: "Port already in use"
- Railway otomatis assign PORT
- Pastikan environment variable ada

### Build timeout (>10 menit)
- Railway gratis tier 2x lebih cepat dari Vercel
- Coba clear cache:
  1. Settings → Clear build cache
  2. Redeploy

---

## ✅ Verifikasi Deploy Berhasil

Setelah deploy, test endpoints:

```bash
# Health check
curl https://your-railway-url/health

# Should return:
# {"status":"ok","timestamp":"..."}

# Then open di browser
# https://your-railway-url
```

---

## 📊 Railway vs Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| Node.js Server | ✅ | ❌ |
| File Upload | ✅ | ❌ |
| Persistent Storage | ✅ | ❌ |
| Build Time | ⚡ 3-5 min | ⏱️ 5-10 min |
| Free Tier | ✅ Yes | ✅ Yes |
| Recommended | ✅✅✅ | ❌ |

---

## 🎯 Langkah Setelah Deploy

1. ✅ Copy Railway URL
2. ✅ Buka di browser
3. ✅ Upload SQL file
4. ✅ Generate DFD
5. ✅ Copy Mermaid code ke mermaid.live
6. ✅ View diagram!

---

## 💾 File Structure untuk Railway

```
.
├── app.js                 ✅
├── Dockerfile            ✅ (Railway uses this)
├── railway.json          ✅ (Railway config)
├── package.json          ✅
├── .env.production       ✅
├── .dockerignore         ✅
├── public/
│   └── index.html        ✅
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   └── utils/
└── uploads/              (auto-created)
```

---

## 🚀 Quick Deploy Checklist

- [ ] Files committed to GitHub
- [ ] GitHub repo is public (Railway access)
- [ ] Environment variables set in Railway
- [ ] Build log shows ✅ success
- [ ] Domain assigned
- [ ] Can open URL in browser
- [ ] Upload endpoint responsive

---

## ❓ FAQ

**Q: Berapa lama deploy?**
A: 3-10 menit, tergantung size

**Q: Apakah gratis?**
A: Ya, free tier tersedia

**Q: Apakah data hilang?**
A: Tidak, Railway punya persistent storage

**Q: Bisa ubah domain?**
A: Ya, di settings → Custom Domain

**Q: Bagaimana jika error?**
A: Check Railway logs → Debug → Redeploy

---

## 🎉 Success!

Jika sudah bisa buka URL dan upload file → **Congrats!** 🎉

App Anda sekarang live di internet! 🚀

---

**Need help?** Check Railway docs: https://docs.railway.app
