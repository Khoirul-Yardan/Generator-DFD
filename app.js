require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const dfdRoutes = require('./src/routes/dfdRoutes');
const { errorHandler } = require('./src/utils/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.sql')) {
      cb(null, true);
    } else {
      cb(new Error('Only SQL files are allowed'), false);
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', dfdRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Upload endpoint: POST /api/dfd/upload`);
});

module.exports = app;
